import React from 'react';

const App = (props) => {
    const headerStyle = {
        fontFamily: "\"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif",
        fontSize: "32px",
        borderBottom: "3px solid red",
        color: "#333",
        lineHeight: "70px",
        textAlign: "center",
        backgroundColor: "white"
    };
    const h1Style = {
        verticalAlign: "middle",
        display: "inlineBlock",
        margin: 0
    };
    const wordStyle = {
        color: "red"
    };

    const containerStyle = {
        width: "80%",
        margin: "0 auto",
        minWidth: "340px",
        maxWidth: "1200px"
    }
    return (
        <div>
            <header style={headerStyle}>
                <h1 style={h1Style}>
                    <span style={wordStyle}>ORDER</span>&nbsp;&amp;&nbsp;
                    <span style={wordStyle}>CHAOS</span>
                </h1>
            </header>
            <div style={containerStyle}>
                {props.children}
            </div>
        </div>
    );
};

export default App;
