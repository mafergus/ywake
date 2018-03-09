import React, { Component } from 'react';
import autoBind from 'react-autobind';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PhoneNumberTextField from './country-code-dropdown/PhoneNumberTextField';

const items = [];
items.push(<MenuItem value={0} key={0} primaryText={`12:00am`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i} key={i} primaryText={`${i}:00am`} />);
}
items.push(<MenuItem value={12} key={12} primaryText={`12:00pm`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i} key={i+12} primaryText={`${i}:00pm`} />);
}

const countries = [];
countries.push(<MenuItem value={0} key={0} primaryText="+1 USA" />);
countries.push(<MenuItem value={1} key={1} primaryText="+971 UAE" />);

const WHITE_DIV = {
  backgroundColor: "white",
  marginRight: 2,
  height: "inherit",
};

class App extends Component {

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      value: 0,
      selectedCountry: 0,
    };
  }

  handleChange = (event, index, value) => this.setState({ value });

  handleChangeCountry = (event, index, value) => this.setState({ selectedCountry: value });

  onCountryCodeChange = (data) => {
    console.log("Country code ", data.callingCode);
  };

  // doRequest(options) {
  //   return new Promise ((resolve, reject) => {
  //     let req = http.request(options);

  //     req.on('response', res => {
  //       resolve(res);
  //     });

  //     req.on('error', err => {
  //       reject(err);
  //     });
  //   }); 
  // }

  onSubmit(event) {
    const opts = {
      phoneNumber: "+16507961513",
      time: "13",
    };

    fetch('https://us-central1-ywake-4dedb.cloudfunctions.net/createUser/', {
      method: 'post',
      body: JSON.stringify(opts),
    })
    .then(response => response.json())
    .then(data => {
      console.log("RECEIVED: ", data);
    });
  }

  renderForm() {
    return <div style={{ marginTop: 100, height: 80, textAlign: "center", alignSelf: "center", display: "flex", flexDirection: "row" }}>

      <div style={WHITE_DIV}>
        <PhoneNumberTextField
          style={{ height: 80 }}
          preferredCountries={['US', 'GB']}
          defaultCountry={'US'}
          defaultValue={'+1 555-555-5555'}
          onChange={(data) => this.onCountryCodeChange(data)}
        />
      </div>

      <div style={WHITE_DIV}>
        <DropDownMenu
          underlineStyle={{ display: 'none' }}
          iconStyle={{ backgroundColor: "black" }}
          maxHeight={300}
          value={this.state.value}
          onChange={this.handleChange}
        >
          {items}
        </DropDownMenu>
      </div>

      <RaisedButton
        style={{ height: 56, width: 150 }}
        backgroundColor="#A78CD7"
        labelColor="#FFFFFF"
        label="Let's Go!"
        onClick={this.onSubmit}
      />
    </div>;
  }

  render() {
    return (
      <div className="hero" style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", zIndex: "-2" }}>
        <h1 style={{ fontSize: "2.3em", color: "white", width: "100%", textAlign: "center", marginTop: 230 }}>
          Discover your daily inspiration.
        </h1>
        <p style={{ fontSize: "1em", color: "white", width: "100%", textAlign: "center", marginTop: 180 }}>
          Sign up for a daily dose of inspiration, sent right to your phone!
        </p>
        {this.renderForm()}
        <div className="hero-overlay" style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: "-1" }} />
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
