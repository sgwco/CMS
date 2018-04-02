import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from '@fortawesome/react-fontawesome';
import { InputGroup, InputGroupAddon, Button } from 'reactstrap';

export default class InlineFormEditor extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showInput: false
    };
  }

  showInput = () => {
    this.setState({ showInput: true });
  }

  saveCategory = () => {
    this.setState({ showInput: false });
  }

  detectEscape = (event) => {
    if (event.keyCode === 27) {
      this.setState({ showInput: false });
    }
  }

  changeText = () => {

  }

  render() {
    const { text } = this.props;
    return (
      <span>
        {this.state.showInput ? (
          <InputGroup>
            <input
              autoFocus
              className='form-control'
              type='text'
              value={text}
              onKeyDown={this.detectEscape}
              onChange={this.changeText}
            />
            <InputGroupAddon addonType="append">
              <Button color="primary" onClick={this.saveCategory}>
                <FontAwesome icon="save" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        ) : (
          <span
            className='inline-text'
            onDoubleClick={this.showInput}
          >
            {text}
          </span>
        )}
        
      </span>
    );
  }
}