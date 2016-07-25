import React from 'react';

import rockSrc from '../icons/rock.png';
import paperSrc from '../icons/paper.png';
import scissorsSrc from '../icons/scissors.png';

export default (props) => {
    var content;
    if (!props.gameData.iPlayedRockPaperScissors){
        const imgStyle = {
            maxWidth: "25%",
            borderRadius: "10%",
            cursor: "pointer"
        };
        const playRock = props.manager.playRockPaperScissors.bind(
            props.manager, props.gameData, "rock");
        const playPaper = props.manager.playRockPaperScissors.bind(
            props.manager, props.gameData, "paper");
        const playScissors = props.manager.playRockPaperScissors.bind(
            props.manager, props.gameData, "scissors");

        content = <div>
            <h2>Rock Paper Scissors</h2>
            <p>
                To decide who gets to pick their role (order or chaos), we play
                a game of rock, paper, scissors. The player who wins gets to
                pick their role. If it's a tie, the first player to make their
                move gets to pick a role.
            </p>
            <p>
                Click or tap one of these images.
            </p>
            <div style={{padding: "0.2em", textAlign: "center"}}>
                <img className="rpcImage" src={rockSrc} style={imgStyle}
                     onClick={playRock}/>
                <img className="rpcImage" src={paperSrc} style={imgStyle}
                     onClick={playPaper}/>
                <img className="rpcImage" src={scissorsSrc} style={imgStyle}
                     onClick={playScissors}/>
            </div>
        </div>
    } else {
        content = <p>Waiting for your opponent to make their move...</p>
    }

    return (
        <div style={{backgroundColor: "white", color: "#333", padding: "16px"}}>
            {content}
        </div>
    );
}