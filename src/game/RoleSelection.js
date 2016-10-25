import React from 'react';

const sources = {
    rock: require("../icons/rock.png"),
    paper: require("../icons/paper.png"),
    scissors: require("../icons/scissors.png")
};

export default (props) => {
    var content;
    const div1Style = {
        textAlign: "center"
    };
    const div2Style = {
        textAlign: "center",
        display: "inline-block",
        maxWidth: "50%"
    };
    const imgStyle = {
        maxWidth: "25%"
    };

    const myMoveSrc = sources[props.gameData.myRockPaperScissorsMove];
    const otherMoveSrc = sources[props.gameData.otherRockPaperScissorsMove];

    const rpcResult = (
        <div style={div1Style}>
            <div style={div2Style}>
                You:<br />
                <img src={myMoveSrc} style={imgStyle} />
            </div>
            <div style={div2Style}>
                Opponent:<br />
                <img src={otherMoveSrc}
                     style={{...imgStyle, transform:"scale(-1)"}} />
            </div>
        </div>
    );
    if(props.gameData.iWonRockPaperScissors){
        const button1Style = {
            backgroundColor: "blue",
            color: "white",
            borderRadius: "0.5em",
            fontSize: "1.1em",
            cursor: "pointer",
            margin: "0 1em",
            padding: "0.2em"
        };
        const button2Style = {
            ...button1Style,
            backgroundColor: "red"
        };
        const chooseOrder = props.manager.chooseRole.bind(props.manager, props.gameData, "order");
        const chooseChaos = props.manager.chooseRole.bind(props.manager, props.gameData, "chaos");
        content = (
            <div>
                <p> 
                    You won the right to choose which role you want to
                    take in the game.
                </p>
                <p style={{textAlign: "center"}}>
                    <a style={button1Style} onClick={chooseOrder}>ORDER</a>
                    <a style={button2Style} onClick={chooseChaos}>CHAOS</a>
                </p>
            </div>
        )
    } else {
        content = (
            <p>Waiting for the other player to chose their role...</p>
        )
    }
    return (
        <div style={{backgroundColor: "white", color: "#333", padding: "16px"}}>
            {rpcResult}
            {content}
        </div>
    );
}