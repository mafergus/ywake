import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const items = [];
items.push(<MenuItem value={0} key={0} primaryText={`12:00am`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i} key={i} primaryText={`${i}:00am`} />);
}
items.push(<MenuItem value={12} key={12} primaryText={`12:00pm`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i} key={i+12} primaryText={`${i}:00pm`} />);
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  handleChange = (event, index, value) => this.setState({ value });

  render() {
    return (
      <div className="hero" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        <h1 style={{ fontSize: "5em", color: "white", width: "100%", textAlign: "center" }}>
          YWake
        </h1>
        <p style={{ fontSize: "1.5em", color: "white", width: "100%", textAlign: "center" }}>
          Welcome to Ywake! Sign up for a daily dose of inspirational goodness, sent right to your phone!
        </p>
        <div style={{ width: 500, padding: 10, marginTop: 200, backgroundColor: "white", textAlign: "center", alignSelf: "center", borderRadius: 5 }}>
          <TextField
            style={{ marginTop: 50, width: 350 }}
            hintText="Enter Your Phone Number, with country code! eg +16508546767"
          />
          <DropDownMenu maxHeight={300} value={this.state.value} onChange={this.handleChange}>
            {items}
          </DropDownMenu>
          <RaisedButton label="Let's Go!" />
        </div>
      </div>
    );
  }
}

class MaterialApp extends Component {
  render() {
    return <MuiThemeProvider>
      <App />
    </MuiThemeProvider>;
  }
}

export default MaterialApp;
