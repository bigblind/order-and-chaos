import React from 'react';
import {withRouter} from 'react-router';

import GameManager from './gameManager';

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ready: false
        };
        var gmPromise;
        if(props.params.gameId === "new"){
            gmPromise = GameManager.newGame();
        }else{
            gmPromise = GameManager.joinGame(props.params.gameId);
        }
        gmPromise.then((manager) => {
            this.gameManager = manager;
            this.setState({ready: true});
            if(props.params.gameId != manager.id){
                props.router.replace(`/games/${manager.id}`);
            }
        });
    }
    
    render() {
        return <p>TEST {this.props.params.gameId}</p>
    }
}

export default withRouter(Game);
