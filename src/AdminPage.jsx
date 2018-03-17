import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class AdminPage extends Component {

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      author: '',
      text: '',
    };
  }

  submit = () => {
    const { author, text } = this.state;
    const opts = { author, text };

    fetch('https://us-central1-ywake-4dedb.cloudfunctions.net/api/addQuote/', {
      method: 'post',
      body: JSON.stringify(opts),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.status);
      this.clearData();
      console.log("RECEIVED: ", data.status);
    })
    .catch(err => {
      alert("UH OH SHIT FUCKED UP: " + err);
    });
  };

  clearData = () => {
    this.setState({
      author: '',
      text: '',
    });
  };

  render() {
    const { author, text } = this.state;

    return <div style={{ position: "fixed", width: "100%", height: "100%", padding: 100 }}>
      <p style={{ fontSize: "2em" }}>
        Quote Author
      </p>
      <TextField
        hintText="Author Name"
        value={author}
        onChange={(event) => this.setState({ author: event.target.value })}
      />
      <p style={{ fontSize: "2em" }}>
      Quote Text
      </p>
      <TextField
        hintText="Quote text"
        value={text}
        onChange={(event) => this.setState({ text: event.target.value })}
      />
      <br/>
      <RaisedButton
        style={{ marginTop: 50 }}
        label="Submit"
        primary={true}
        onClick={this.submit}
      />
    </div>;
  }
}