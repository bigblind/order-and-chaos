import React, {Component} from 'react';
import {Link} from 'react-router';

const Home = () => {
    const columnStyle = {
        width: "50%",
        float: "left"
    };
    const firstButton = {
        margin: "1.83em 0",
        display: "block",
        backgroundColor:"white",
        color: "red",
        padding: "1em",
        borderRadius: "1em",
        width: "60%",
        border: "3px solid red",
        textDecoration: "none",
        fontWeight: "700"
    };
    const nextButton = {
        ...firstButton,
        margin: "0",
        opacity: "0.7",
        color: "blue",
        borderColor: "blue"
    };
    return (
        <div style={{color: "white"}}>
            <div style={columnStyle}>
                <Link to="/games/new" style={firstButton}>Play against a friend</Link><br />
                <Link to= "/" style={nextButton}>Play against the computer <span style={{float:"right"}}>(coming soon)</span></Link>
            </div>
            <div style={columnStyle}>
                <h2>How to play</h2>
                <p>
                    The game is played on a grid of 6 rows and 6 columns. One player plays as "order", the other plays as "chaos". The players take turns placing red and blue pieces on the board.
                    The player playing "order" goes first. Their objective is to create a row of 5 stones of either color, horizontally, vertically or diagonally.
                    The player playng as "choas" is trying to prevent this.
                </p>
            </div>
        </div>
    );
};

export default Home;
