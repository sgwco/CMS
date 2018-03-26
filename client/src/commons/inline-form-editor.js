import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'reactstrap';

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

  cancelInput = () => {
    this.setState({ showInput: false });
  }

  changeText = () => {

  }

  render() {
    const { text } = this.props;
    return (
      <span>
        {this.state.showInput ? (
          <Form inline>
            <input
              autoFocus
              type='text'
              value={text}
              onChange={this.changeText}
              onBlur={this.cancelInput}
            />
            {/* <Input
              type='text'
              value={text}
              onBlur={this.cancelInput}
              onChange={this.changeText}
            /> */}
          </Form>
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