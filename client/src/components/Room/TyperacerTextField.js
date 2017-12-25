import React, { Component } from 'react';
import moment from 'moment';
import MiniSignal from 'mini-signals';
import GameSocket from '../../GameSocket';

import TyperacerText from './TyperacerText';
import Members from './Members';
import KeystrokesPerMinutes from './KeystrokesPerMinutes';

import { Grid, Col, Panel, FormControl } from 'react-bootstrap';

class TyperacerTextField extends Component {
  constructor(props) {
    super(props);

    this.kpmSignal = new MiniSignal();
    this.socket = new GameSocket(this.props.match.params.roomname, this.props.match.params.username);

    const text = 'Ao integrar com a API do Pagar.me, você pode criar transações a partir dos pedidos feitos na sua plataforma. É possível usar os mecanismos de cartão de crédito e boleto para efetuar os pagamentos. Os itens a seguir explicam de forma mais detalhada como criar uma transação de cada tipo:\n' +
      '\n' +
      'Capturar os dados do cliente: Obtendo os dados do Cartão\n' +
      'Criar a transação de Cartão de crédito ou Boleto bancário\n' +
      'É importante também entender os conceitos a seguir, para que a sua operação esteja alinhada com todos os detalhes do nosso produto.';
    this.textArray = text.split(' ');

    this.state = {
      textTypedHistory: [],
      lastWordIsIncorrect: false
    }

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.socket.socket.disconnect();
  }

  handleChange(event) {
    const newValue = event.target.value;
    const textArray = this.textArray;
    const textTypedHistory = this.state.textTypedHistory;

    const newValueWords = newValue
      .split(' ')
      .filter(word => word.length > 0);

    if (newValueWords.length > textTypedHistory.length) {
      // if a new word was is typed, then check if the new word is correct

      const newWord = newValueWords[newValueWords.length - 1];

      if (newWord === textArray[textTypedHistory.length]) {
        // the new word is correct

        const updatedTextTypedHistory = [...this.state.textTypedHistory, {word: newWord, moment: moment()}];

        this.kpmSignal.dispatch(updatedTextTypedHistory);
        this.setState({
          textTypedHistory: updatedTextTypedHistory,
          lastWordIsIncorrect: false
        });
      } else if (newValue[newValue.length - 1] === ' ') {
        // the new word is wrong

        this.setState({
          lastWordIsIncorrect: true
        });
      }
    }
  }

  render() {
    return (
      <Grid fluid={true}>
        <Col xs={4}>
          <Panel header="Text to type">
            <TyperacerText
              textArray={this.textArray}
              wordsTypedCount={this.state.textTypedHistory.length}
              lastWordIsIncorrect={this.state.lastWordIsIncorrect} />
          </Panel>
        </Col>

        <Col xs={4}>
          <Panel header="Your text">
            <FormControl componentClass="textarea" onChange={this.handleChange} />
          </Panel>
        </Col>

        <Col xs={4}>
            <Col xs={12}>
              <Panel header="Your score">
                <KeystrokesPerMinutes socket={this.socket} kpmSignal={this.kpmSignal} />
              </Panel>
            </Col>

            <Col xs={12}>
              <Panel header="Ranking">
                <Members socket={this.socket} />
              </Panel>
            </Col>
        </Col>
      </Grid>
    );
  }
}

export default TyperacerTextField;