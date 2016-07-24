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
                    player2: ""
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
        const userRole = gameData.order === this.userId ? "order" : "chaos";
        var phase = "waitingForPlayer";
        if(gameData.player2 !== ""){
            phase = "rockPaperScissors"
        }
        const rpc = gameData.rockPaperScissors;
        if(rpc.player1 !== "" && rpc.player2 !== "" && rpc.player1 !== rpc.player2){
            phase = "chooserole";
        }
        if(gameData.order !== ""){
            phase = "game";
        }
        if(gameData.winner !== ""){
            phase = "gameOver";
        }

        return {
            ...gameData,
            userRole,
            phase,
            isMyTurn: (gameData.currentTurn % 2 === 0) ?
                userRole === "order" : userRole === "chaos",
        }
    }
}