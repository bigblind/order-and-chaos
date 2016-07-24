import React from 'react';

export default () => {
    const inputStyle = {
        width: "100%",
        backgroundColor: "#EEE"
    };
    return (
        <div style={{backgroundColor: "white", color: "#333", padding: "16px"}}>
            <h2>Invite your opponent.</h2>
            <p>
                We're waiting for a second player to join the game. Give
                this link to a friend to let them join.
            </p>
            <p>
                <input value={window.location.href} readonly style={inputStyle}/>
            </p>
        </div>
    )
}