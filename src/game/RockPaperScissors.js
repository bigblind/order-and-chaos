import React from 'react';

import rockSrc from '../icons/rock.png';
import paperSrc from '../icons/paper.png';
import scissorsSrc from '../icons/scissors.png';

export default (props) => {
    const imgStyle={
        maxWidth: "25%",
        borderRadius: "50px"
    };
    return (
        <div style={{backgroundColor: "white", color: "#333", padding: "16px"}}>
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
                <img className="rpcImage" src={rockSrc} style={imgStyle} />
                <img className="rpcImage" src={paperSrc} style={imgStyle} />
                <img className="rpcImage" src={scissorsSrc} style={imgStyle} />
            </div>
        </div>
    );
}