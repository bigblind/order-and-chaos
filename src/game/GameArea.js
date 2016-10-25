import React from 'react';

class GameArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           color: null
        };
        this.chooseColor = this.chooseColor.bind(this);
        this.makeMove = this.makeMove.bind(this);
    }

    render() {
        const props = this.props
        const myTurn = props.gameData.isMyTurn;

        var message;
        if(myTurn){
            message = "It's your turn. Click a color below, then select a square.";
        }else{
            message = "Waiting for your opponent to make a turn.";
        }

        const messageBox = <div
            style={{backgroundColor: "white", color: "#333", padding: "16px"}}>
            {message}
        </div>;

        const button1Style = {
            backgroundColor: "blue",
            color: "white",
            borderRadius: "0.5em",
            fontSize: "1.1em",
            cursor: "pointer",
            margin: "0 1em",
            padding: "0.2em",
            minWidth: "100px",
            display: "inline-block"
        };
        const button2Style = {
            ...button1Style,
            backgroundColor: "red"
        };

        const colorSelect = <div
            style={{
                textAlign: "center",
                visibility: myTurn ? "visible" : "hidden",
                padding: "50px"
        }}>
            <a style={button1Style} onClick={this.chooseColor.bind(this, "B")}>{this.state.color == "B" ? "✓" : "\xa0\xa0"}</a>
            <a style={button2Style} onClick={this.chooseColor.bind(this, "R")}>{this.state.color == "R" ? "✓" : "\xa0\xa0"}</a>
        </div>;
        
        const grid = <table style={{margin: "auto"}}>
            <tbody>
                {this.makeRow(0)}
                {this.makeRow(1)}
                {this.makeRow(2)}
                {this.makeRow(3)}
                {this.makeRow(4)}
                {this.makeRow(5)}
            </tbody>
        </table>;

        return <div>
            {messageBox}
            {colorSelect}
            {grid}
        </div>
    }
    
    makeRow(y){
        return <tr>
            {this.makeCell(0, y)}
            {this.makeCell(1, y)}
            {this.makeCell(2, y)}
            {this.makeCell(3, y)}
            {this.makeCell(4, y)}
            {this.makeCell(5, y)}
        </tr>
    }

    makeCell(x, y){
        const myTurn = this.props.gameData.isMyTurn;
        const canSelect = this.props.manager.isCellAvailable(this.props.gameData, x, y);
        var color = "rgba(0, 0, 0, 0)";
        if(this.props.manager.getCellColor(this.props.gameData, x, y) === "B"){
            color = "#00F"
        }
        if (this.props.manager.getCellColor(this.props.gameData, x, y) === "R") {
            color = "#F00"
        }
        const props = {
            onClick: myTurn && canSelect ? this.makeMove.bind(this, x, y) : void(0),
            style: {
                cursor: myTurn && canSelect ? "pointer" : "default",
                backgroundColor: color
            }
        };
        return <td {...props}>&nbsp;</td>
    }
    
    chooseColor(color){
        this.setState({color});
    }
    
    makeMove(x, y){
        if(!this.state.color){
            alert("You first need to select a color.");
            return
        }
        this.props.manager.makeMove(this.props.gameData, x, y, this.state.color);
        this.setState({color: null});
    }
}

export default GameArea
