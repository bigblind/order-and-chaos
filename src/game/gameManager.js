import firebase from 'firebase';
import {user} from './auth';

export default class GameManager {
    constructor(ref){
        this.ref = ref;
    }

    get id(){
        return this.ref.key;
    }

    static newGame() {
        return user.then((userObj) => {
            const
                gameData = {

                started: firebase.database.ServerValue.TIMESTAMP,
                player1: userObj.uid,
                player2: null,
                grid: "....................................",
                rockPaperScissors: {
                    player1: null,
                    player2: null
                },
                order: null,
                currentTurn: 0,
                online: {
                    [userObj.uid]: true
                },
                winner: null
            };
            const gameRef = firebase.database().ref("/games").push();
            return new GameManager(gameRef);
        });
    }

    static joinGame(gameId) {
        return user.then((userObj) => {
            const gameRef = firebase.database().ref(`/games/${gameId}`);
            return gameRef.once("value").then((snapshot) => {
                const gameVal = snapshot.val();
                if(gameVal.player2 === null){
                    gameRef.update({
                        player2: userObj.uid,
                        [`online/${userObj.uid}`]: true
                    });
                }
                return new GameManager(gameRef);
            })
        });
    }
}