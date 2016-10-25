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
                winner: "",
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
        if (game.winner !== "") {
            phase = "gameOver";
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