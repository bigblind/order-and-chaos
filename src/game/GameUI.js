import React from 'react';
import ReactFire from 'reactfire';

import WaitingForPlayerMessage from './WaitingForPlayerMessage';
import RockPaperScissors from './RockPaperScissors';

const GameUI =  (props) => {
    if(!props.gameData) {
        return <p>Loading...</p>
    }

    const game = props.manager.augmentData(props.gameData);
    if(game.phase === "waitingForPlayer") {
        return (
            <WaitingForPlayerMessage />
        )
    }
    if(game.phase === "rockPaperScissors"){
        return (
            <RockPaperScissors manager={props.manager} gameData={game} />
        );
    }
};

export default ReactFire.createContainer(GameUI, (props) => {
    console.log("binding to ref:");
    console.log(props.manager.ref.ref);
    return {
        gameData: {
            ref: props.manager.ref,
            type: "object"
        }
    }
});