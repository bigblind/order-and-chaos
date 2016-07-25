import React from 'react';

const App = (props) => {
    const headerStyle = {
        fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
        fontSize: "32px",
        borderBottom: "6px solid red",
        borderImage: "linear-gradient(90deg, #ff0000 45%, #0000ff 55%) 100% 1",
        color: "#333",
        lineHeight: "70px",
        textAlign: "center",
        backgroundColor: "white"
    };
    const h1Style = {
        verticalAlign: "middle",
        display: "inlineBlock",
        margin: 0,
        fontSize:"0.8em"
    };
    const wordStyle = {
        color: "blue"
    };
    const word2Style = {
        color: "red"
    };

    const containerStyle = {
        width: "80%",
        margin: "0 auto",
        minWidth: "300px",
        maxWidth: "1200px"
    };
    return (
        <div>
            <header style={headerStyle}>
                <h1 style={h1Style}>
                    <span style={wordStyle}>ORDER</span>&nbsp;&amp;&nbsp;
                    <span style={word2Style}>CHAOS</span>
                </h1>
            </header>
            <div style={containerStyle}>
                {props.children}
            </div>
        </div>
    );
};

export default App;
