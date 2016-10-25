import firebase from 'firebase';
import {user} from './auth';

export default class GameManager {
    constructor(ref, userId){
        this.ref = ref;
        this.userId = userId;
    }

    get id(){
        return this.ref.key;
    }

    static newGame() {
        return user.then((userObj) => {
            const gameData = {
                started: firebase.database.ServerValue.TIMESTAMP,
                player1: userObj.uid,
                player2: "",
                grid: "....................................",
                rockPaperScissors: {
                    player1: "",
                    player2: "",
                    player1Time: 0,
                    player2Time: 0
                },
                order: "",
                currentTurn: 0,
                online: {
                    [userObj.uid]: true
                },
                winner: ""
            };
            const gameRef = firebase.database().ref().child("games").push(gameData);
            return new GameManager(gameRef, userObj.uid);
        });
    }

    static joinGame(gameId) {
        return user.then((userObj) => {
            const gameRef = firebase.database().ref().child("games").child(gameId);
            return gameRef.once("value").then((snapshot) => {
                const gameVal = snapshot.val();
                if(gameVal.player2 === "" && gameVal.player1 !== userObj.uid){
                    gameRef.update({
                        player2: userObj.uid,
                        [`online/${userObj.uid}`]: true
                    });
                }
                return new GameManager(gameRef, userObj.uid);
            });
        });
    }

    augmentData(gameData){
        gameData = {
            ...gameData,
            userId: this.userId,
            phase: GameManager.getGamePhase(gameData),
            ...this.getPlayerIds(gameData)
        };
        
        gameData = {
            ...gameData,
            ...GameManager.getRockPaperScissorsData(gameData),
            userRole: GameManager.getUserRole(gameData)
        };

        gameData.iWon = gameData.userRole === gameData.winner;
        gameData.isMyTurn = GameManager.isMyTurn(gameData);
        
        return gameData;
    }

    static getGamePhase(game) {
        var phase = "waitingForPlayer";
        if (game.player2 !== "") {
            phase = "rockPaperScissors"
        }
        const rpc = game.rockPaperScissors;
        if (rpc.player1 !== "" && rpc.player2 !== "") {
            phase = "chooserole";
        }
        if (game.order !== "") {
            phase = "game";
        }
        return phase;
    }

    static getUserRole(game) {
        return game.order === game.myPlayerId ? "order" : "chaos";
    }

    chooseRole(game, role){
        const orderPlayer = role === "order" ? game.myPlayerId : game.otherPlayerId;
        this.ref.update({order: orderPlayer});
    }

    makeMove(game, x, y, color){
        const index = y * 6 + x;
        const newGrid = game.grid.slice(0, index) + color + game.grid.slice(index + 1, 36);
        var winner = this.checkGridForWinner(newGrid);
        this.ref.update({
            grid: newGrid,
            currentTurn: game.currentTurn + 1,
            winner: winner
        });
    }

    checkGridForWinner(grid){
        var r, c;

        for (r = 0; r < 2; r++)
            for (c = 0; c < 6; c++)
                if (this.checkLine(grid, r, c, r + 1, c, r + 2, c, r + 3, c, r + 4, c))
                    return "order";

        // Check right
        for (r = 0; r < 6; r++)
            for (c = 0; c < 2; c++)
                if (this.checkLine(grid, r, c, r, c+1, r, c+2, r, c+3, r, c+4))
                    return "order";

        // Check down-right
        for (r = 0; r < 2; r++)
            for (c = 0; c < 2; c++)
                if (this.checkLine(grid, r, c, r+1, c+1, r+2, c+2, r+3, c+3, r+4, c+4))
                    return "order";

        // Check down-left
        for (r = 4; r < 6; r++)
            for (c = 0; c < 2; c++)
                if (this.checkLine(grid, r, c, r-1, c+1, r-2, c+2, r-3, c+3, r-4, c+4))
                    return "order";

        if(grid.indexOf(".") === -1){
            return "chaos";
        }
        return "";
    }

    checkLine(grid, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5){
        const c1 = this.getCellColor(grid, x1, y1),
            c2 = this.getCellColor(grid, x2, y2),
            c3 = this.getCellColor(grid, x3, y3),
            c4 = this.getCellColor(grid, x4, y4),
            c5 = this.getCellColor(grid, x5, y5);
        const result = (c1 !== "." && (c1 === c2) && (c2 === c3) && (c3 === c4) && (c4 === c5));
        console.log(`Result ${x1} ${y1} ${c1} ${x2} ${y2} ${c2} ${x3} ${y3} ${c3} ${x4} ${y4} ${c4} ${x5} ${y5} ${c5} -> ${result}`);
        return result
    }
    
    isCellAvailable(game, x, y) {
        return game.grid[y * 6 + x] === "."
    }

    getCellColor(grid, x, y){
        if(grid.grid){
            grid = grid.grid;
        }
        return grid[y * 6 + x];
    }

    static isMyTurn(gameData) {
        // The first turn is turn 0, so the first player's turn (order)
        // has even numbers.
        return (gameData.currentTurn % 2 === 0) ?
            gameData.userRole === "order" : gameData.userRole === "chaos";
    }

    getPlayerIds(gameData) {
        if(gameData.player1 === this.userId){
            return {
                myPlayerId: "player1",
                otherPlayerId: "player2"
            };
        }else if(gameData.player2 === this.userId){
            return {
                myPlayerId: "player2",
                otherPlayerId: "player1"
            };
        }
        return {
            myPlayerId: null
        };
    }

    playRockPaperScissors(game, decision){
        const playerId = game.myPlayerId;
        this.ref.child("rockPaperScissors").update({
            [playerId]: decision,
            [playerId + "Time"]: firebase.database.ServerValue.TIMESTAMP
        });
    }
    
    static getRockPaperScissorsData(game){
        return {
            iPlayedRockPaperScissors: GameManager.iPlayedRockPaperScissors(
                game
            ),
            iWonRockPaperScissors: GameManager.iWonRockPaperScissors(game),
            ...GameManager.getRockPaperScissorsMoves(game)
        }
    }
    
    static getRockPaperScissorsMoves(game){
        const rpc = game.rockPaperScissors;
        return {
            myRockPaperScissorsMove: rpc[game.myPlayerId],
            otherRockPaperScissorsMove: rpc[game.otherPlayerId]
        }
    }
    
    static iPlayedRockPaperScissors(game){
        const myPlayerId = game.myPlayerId;
        return game.rockPaperScissors[myPlayerId] !== ""
    }
    
    static iWonRockPaperScissors(game){
        const myPlayerId = game.myPlayerId;
        const otherPlayererId = game.otherPlayerId;
        const rpc = game.rockPaperScissors;
        
        const myChoice = rpc[myPlayerId];
        const otherChoice = rpc[otherPlayererId];
        
        if(myChoice === otherChoice) {
            return rpc[myPlayerId + "Time"] < rpc[otherPlayererId + "Time"];
        }
        
        return (
            myChoice === "rock" && otherChoice === "scissors" ||
            myChoice === "paper" && otherChoice === "rock" ||
            myChoice === "scissors" && otherChoice === "paper"
        );
    }
}