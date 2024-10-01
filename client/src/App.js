import React from 'react';
import './App.css';
import Dice from './Dice';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            player1: 'Player 1',
            player2: 'Player 2',
            dice1: 1,
            dice2: 1,
            dice3: 1,
            dice4: 1,
            winner: ''
        };
    }

    rollTheDice = () => {
        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const dice4 = Math.floor(Math.random() * 6) + 1;
        let winner = '';

        if (dice1 + dice2 > dice3 + dice4) {
            winner = `${this.state.player1} WINS!`;
        } else if (dice1 + dice2 < dice3 + dice4) {
            winner = `${this.state.player2} WINS!`;
        } else {
            winner = 'Draw!';
        }

        this.setState({ dice1, dice2, dice3, dice4, winner });
    };

    render() {
        return (
            <div className="container">
              <h1>Dice Game</h1>
                <h3>{this.state.winner || "Press \"Roll the Die\" to begin"}</h3>
                <div className="players">
                    <div className="player">
                        <p>{this.state.player1}</p>
                        <Dice number={this.state.dice1} />
                        <Dice number={this.state.dice2} />
                    </div>
                    <div className="player">
                        <p>{this.state.player2}</p>
                        <Dice number={this.state.dice3} />
                        <Dice number={this.state.dice4} />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={this.rollTheDice}>Roll the Dice</button>
                </div>
            </div>
        );
    }
}

export default App;
