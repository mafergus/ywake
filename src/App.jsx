import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import PhoneNumberTextField from './country-code-dropdown/PhoneNumberTextField';
import { Col, Row } from 'fluid-react';
import DocumentTitle from 'react-document-title';
import { lightGray } from './colors';
import { Android } from './Icons';
import { connect } from "react-redux";

const items = [];
items.push(<MenuItem value={0} key={0} primaryText={`12:00am`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i} key={i} primaryText={`${i}:00am`} />);
}
items.push(<MenuItem value={12} key={12} primaryText={`12:00pm`} />);
for (let i=1; i < 12; i++) {
  items.push(<MenuItem value={i+12} key={i+12} primaryText={`${i}:00pm`} />);
}

const countries = [];
countries.push(<MenuItem value={0} key={0} primaryText="+1 USA" />);
countries.push(<MenuItem value={1} key={1} primaryText="+971 UAE" />);

class App extends Component {

  static propTypes = {
    browser: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      value: 0,
      selectedCountry: 0,
      phoneNumber: 0,
      time: 0,
    };
  }

  handleChange = (event, index, value) => this.setState({ time: value });

  handleChangeCountry = (event, index, value) => this.setState({ selectedCountry: value });

  onCountryCodeChange = (data) => {
    // console.log("Country code ", data.callingCode);
  };

  onPhoneNumberChange(countryCode, phoneNumber) {
    this.setState({ phoneNumber: countryCode + phoneNumber });
  }

  onSubmit(event) {
    const { phoneNumber, time } = this.state;
    const opts = { phoneNumber, time };

    fetch('https://us-central1-ywake-4dedb.cloudfunctions.net/createUser/', {
      method: 'post',
      body: JSON.stringify(opts),
    })
    .then(response => response.json())
    .then(data => {
      alert(data.status);
      console.log("RECEIVED: ", data.status);
    });
  }

  renderForm() {
    const { browser } = this.props;

    return <div style={{ width: "100%" }}>
      <Row
        style={{ marginTop: 100, height: 50, textAlign: "center", alignSelf: "center",
          display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center" }}
      >
        <Col
          md={11}
          lg={3} 
          style={{ backgroundColor: "white", height: "inherit", marginBottom: browser.lessThan.large ? 5 : 0 }}
        >
          <PhoneNumberTextField
            preferredCountries={['US', 'GB']}
            defaultValue={'+1 555-555-5555'}
            onChange={this.onPhoneNumberChange}
          />
        </Col>

        <Col
          md={11}
          lg={1}
          style={{ backgroundColor: "white", height: "inherit", borderRightStyle: "solid",
            borderRightWidth: 1, borderRightColor: lightGray, marginBottom: browser.lessThan.large ? 5 : 0 }}
        >
          <DropDownMenu
            style={{ width: 150, height: 50, borderRadius: 2 }}
            iconStyle={{ color: "black" }}
            iconButton={Android}
            maxHeight={300}
            value={this.state.time}
            onChange={this.handleChange}
          >
            {items}
          </DropDownMenu>
        </Col>

        <Col
          md={11}
          lg={1}
        >
          <RaisedButton
            style={{ height: 50, width: "100%" }}
            backgroundColor="#A78CD7"
            labelColor="#FFFFFF"
            label="SUBMIT"
            onClick={this.onSubmit}
          />
        </Col>
      </Row>
    </div>;
  }

  render() {
    const { browser } = this.props;

    return (
      <div className="hero" style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", zIndex: "-2" }}>
        <h1 style={{ fontSize: "2.3em", fontStyle: "normal", color: "white", width: "100%", textAlign: "center", marginTop: 160 }}>
          Discover your daily inspiration.
        </h1>
        <p style={{ fontSize: "1em", color: "white", width: browser.lessThan.large ? "80%" : "100%",
         textAlign: "center", marginTop: 180, alignSelf: "center" }}>
          Sign up for a daily dose of inspiration, sent right to your phone!
        </p>
        {this.renderForm()}
        <div
          className="hero-overlay"
          style={{ height: "100%", width: "100%", position: "absolute", backgroundColor: "rgba(0, 0, 0, 0.45)", zIndex: "-1" }}
        />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    browser: state.browser,
  };
}

class MaterialApp extends Component {
  render() {
    return <DocumentTitle title="Ywake">
      <MuiThemeProvider>
        <App browser={this.props.browser} />
      </MuiThemeProvider>
    </DocumentTitle>;
  }
}

export default connect(mapStateToProps)(MaterialApp);
