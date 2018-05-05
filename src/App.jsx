import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import './App.css';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import PhoneNumberTextField from './country-code-dropdown/PhoneNumberTextField';
import { Col, Row } from 'fluid-react';
import DocumentTitle from 'react-document-title';
import { lightGray } from './colors';
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

class App extends Component {

  static propTypes = {
    browser: PropTypes.object,
  };

  static defaultProps = {
    browser: { lessThan: { large: false } },
  };

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      value: 0,
      isLoading: false,
      isValid: true,
      isDialogOpen: false,
      selectedCountry: 0,
      phoneNumber: '',
      time: 8,
    };
  }

  componentDidMount() {
    var timezoneOffset = new Date().getTimezoneOffset() / 60;
    this.timezoneOffset = timezoneOffset;
  }

  handleChange = (event) => this.setState({ time: event.target.value });

  handleChangeCountry = (event, index, value) => this.setState({ selectedCountry: value });

  onCountryCodeChange = (data) => {
    // console.log("Country code ", data.callingCode);
  };

  onKeyDown = (e) => {
    switch (e.keyCode) {
      case 13: // enter
        this.onSubmit(e);
        break;
      default:
        break;
    }
  };

  validatePhoneNumber(phoneNumber) {
    /*
    Phone number validation using google-libphonenumber
    */
    let valid = false;
    try {
      const phoneUtil = PhoneNumberUtil.getInstance();
      valid = phoneUtil.isValidNumber(phoneUtil.parse(phoneNumber));
    } catch(e) {
      valid = false;
    }

    return valid;
  }

  onPhoneNumberChange(countryCode, phoneNumber) {
    // const number = countryCode + phoneNumber;
    // const isValid = this.validatePhoneNumber(number);

    this.setState({ phoneNumber: countryCode + phoneNumber, isValid: true });
  }

  onSubmit(event) {
    // debugger;
    const { phoneNumber, time } = this.state;
    const number = phoneNumber.replace(/-/g, '');
    const theTime = time + this.timezoneOffset;
    debugger;
    const opts = { phoneNumber: number, time: theTime };
    const isValid = this.validatePhoneNumber(number);
    if (!isValid) {
      this.setState({
        isValid: false,
        isDialogOpen: true,
        dialogTitle: "Invalid Phone Number",
        dialogMessage: "Please enter a valid phone number",
      });
    } else {
      this.setState({ isLoading: true, isValid: true },
      () => {
        fetch('https://us-central1-ywake-4dedb.cloudfunctions.net/api/createUser/', {
          method: 'post',
          body: JSON.stringify(opts),
        })
        .then(response => response.json())
        .then(data => {
          this.setState({ isLoading: false });
          console.log("RECEIVED: ", data.status);
          if (data.status === 'success') {
            this.setState({
              isDialogOpen: true,
              dialogTitle: "Success",
              dialogMessage: "You've succesfully signed up! Enjoy!",
              phoneNumber: '',
            });
          } else {
            this.setState({
              isDialogOpen: true,
              dialogTitle: "Error",
              dialogMessage: data.error ? data.error : "Oops something went wrong",
              phoneNumber: '',
            });
          }
        });
      });
    }
  }

  renderForm() {
    const { browser } = this.props;
    const { isLoading, isValid } = this.state;

    return <div style={{ width: "100%" }} onKeyDown={this.onKeyDown}>
      <Row
        style={{ marginTop: browser.lessThan.large ? 60 : 100, height: 50, textAlign: "center", alignSelf: "center",
          display: "flex", alignItems: "center", flexDirection: "row", justifyContent: "center" }}
      >
        <Col
          md={11}
          lg={3} 
          style={{ backgroundColor: "white", height: "inherit", marginBottom: browser.lessThan.large ? 5 : 0 }}
        >
          <PhoneNumberTextField
            error={!isValid}
            preferredCountries={['US', 'GB']}
            placeholder={'555-555-5555'}
            onChange={this.onPhoneNumberChange}
          />
        </Col>

        <Col
          md={11}
          lg={1}
          style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            height: "inherit",
            borderRightStyle: "solid",
            borderRightWidth: 1,
            borderRightColor: lightGray,
            marginBottom: browser.lessThan.large ? 5 : 0 
          }}
        >
         {/* <DropDownMenu
            style={{ width: 150, height: 50, borderRadius: 2, paddingLeft: 0, paddingRight: 0 }}
            labelStyle={{ padding: 0 }}
            iconStyle={{ color: "black" }}
            iconButton={null}
            maxHeight={300}
            value={this.state.time}
            onChange={this.handleChange}
          >
            {items}
          </DropDownMenu> */}
          <FormControl>
            <Select
              native
              style={{ backgroundColor: "white" }}
              disableUnderline={true}
              value={this.state.time}
              onChange={this.handleChange}
              inputProps={{
                id: 'age-native-simple',
              }}
            >
              <option value="" />
              <option value={0}>12:00am</option>
              <option value={1}>1:00am</option>
              <option value={2}>2:00am</option>
              <option value={3}>3:00am</option>
              <option value={4}>4:00am</option>
              <option value={5}>5:00am</option>
              <option value={6}>6:00am</option>
              <option value={7}>7:00am</option>
              <option value={8}>8:00am</option>
              <option value={9}>9:00am</option>
              <option value={10}>10:00am</option>
              <option value={11}>11:00am</option>
              <option value={12}>12:00pm</option>
              <option value={13}>1:00pm</option>
              <option value={14}>2:00pm</option>
              <option value={15}>3:00pm</option>
              <option value={16}>4:00pm</option>
              <option value={17}>5:00pm</option>
              <option value={18}>6:00pm</option>
              <option value={19}>7:00pm</option>
              <option value={20}>8:00pm</option>
              <option value={21}>9:00pm</option>
              <option value={22}>10:00pm</option>
              <option value={23}>11:00pm</option>
            </Select>
          </FormControl>
        </Col>

        <Col
          md={11}
          lg={1}
        >
          <Button
            style={{ height: 50, width: "100%", backgroundColor: "#A78CD7", color: "white" }}
            disabled={isLoading}
            variant="raised"
            onClick={this.onSubmit}
          >
            {isLoading ?
              <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress
                  style={{ color: "white" }}
                  size={30}
                  thickness={3}
                />
              </div> : // Size 14 works pretty well
              <span>SUBMIT</span>
            }
          </Button>
        </Col>
      </Row>
    </div>;
  }

  renderDialog() {
    const { isDialogOpen, dialogTitle, dialogMessage } = this.state;

    return (
      <Dialog
        open={isDialogOpen}
        onClose={() => this.setState({ isDialogOpen: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => this.setState({ isDialogOpen: false })}
            color="primary"
            autoFocus
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { browser } = this.props;

    return (
      <div className="hero" style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", zIndex: "-3" }}>
        <Helmet>
          <meta name="description" content="Inspirational motivational daily quotes" />
          <meta name="keywords" content="inspirational quotes, life quotes, motivational quotes, quote of the day, encouraging quotes, famous quotes, inspirational quotations, positive quotes" />
          <meta name="google-site-verification" content="-0xiTHqkrvvl3UFVst-NYN_b46hWLFvRvt7h5duuFnc" />
        </Helmet>
        <h1 style={{ fontSize: "2.3em", fontStyle: "normal", color: "white", width: "100%", textAlign: "center", 
          marginTop: browser.lessThan.large ? 40 : 160 }}>
          Discover your daily inspiration.
        </h1>
        <p style={{ fontSize: "1em", color: "white", width: browser.lessThan.large ? "80%" : "100%",
         textAlign: "center", marginTop: browser.lessThan.large ? 70 : 180, alignSelf: "center" }}>
          Sign up for a daily dose of inspiration, sent right to your phone!
        </p>
        {this.renderForm()}
        {this.renderDialog()}
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
    return <DocumentTitle title="Ywake - Discover your Daily Inspiration">
      <App browser={this.props.browser} />
    </DocumentTitle>;
  }
}

export default connect(mapStateToProps)(MaterialApp);
