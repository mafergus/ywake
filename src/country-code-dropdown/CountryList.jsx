import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';

const NO_RESULTS_MESSAGE = 'No results available';
const PAGINATE_TEXT = 'Display additional results...';

export default class CountryList extends Component {

  static propTypes = {
    callingCodeDivider: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    handleMultiSelect: PropTypes.func.isRequired,
    filteredCountries: PropTypes.array.isRequired,
    multiSelect: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    paginate: PropTypes.number.isRequired,
    paginateCount: PropTypes.number.isRequired,
    maxHeight: PropTypes.number,
    setCountryDropDown: PropTypes.func.isRequired,
  };

  static defaultProps = {
    callingCodeDivider: <span style={{marginLeft: 4, marginRight: 4}}>/</span>,
    maxHeight: 300,
  };

  constructor() {
    super();
    this.missingFlags = { AQ: 'WW', BQ: 'NL', EH: 'WW-AFR', MF: 'FR', SH: 'GB' };
    this.state = {
      open: false,
      selectedCountry: {},
      intlPhoneNumber: '',
      phoneNumber: '',
      searchTerm: '',
      valid: false,
      filteredCountries: [],
      preferredCountries: [],
      paginateCount: 1,
      multiSelectOpen: false,
      multiSelectItem: {},
      lastPreferred: '',
      tabbedIndex: -1,
    };
  }

  getBgColor (index, selected) {
    const { tabbedIndex, hoverIndex } = this.state
    const hovered = index === hoverIndex
    const tabbed = index === tabbedIndex
    if (tabbed) {
      return '#EBEBEB'
    } else if (selected && hovered) {
      return '#BBDEF8'
    } else if (selected) {
      return '#E3F2FD'
    } else if (hovered) {
      return '#EBEBEB'
    }
  }

  renderListItem(country, index) {
    const { selectedCountry, searchTerm, lastPreferred, tabbedIndex } = this.state;
    const { callingCodeDivider } = this.props;
    const { name, alpha2, countryCallingCodes } = country;

    return <li
      id={alpha2}
      tabIndex={0}
      onMouseEnter={() => this.setState({ hoverIndex: index })}
      onMouseLeave={() => this.setState({ hoverIndex: NaN })}
      className={`dropdown-item${tabbedIndex === index + 1 ? ' tabbed' : ''}`}
      key={`${alpha2}-${index}`}
      style={{padding: 15, cursor: 'pointer', borderBottom: lastPreferred && lastPreferred.alpha2 === alpha2 && searchTerm === '' ? '1px solid #c1c1c1' : '', transition: this.bgColorTransitionStyle, backgroundColor: this.getBgColor(index, alpha2 === selectedCountry.alpha2)}}
      onClick={() => this.selectCountry(country, false, false, true)}>
      <h6 style={{margin: 0, display: "flex", alignItems: "center"}}>
        <FlagIcon style={{marginRight: 10}} code={this.missingFlags[alpha2] ? this.missingFlags[alpha2] : alpha2} size={30} />
        {name}&nbsp;
        {countryCallingCodes.map((code, index) => {
          return (
            <small className='text-muted' key={code}>
              {code}
              {index !== countryCallingCodes.length - 1 && <span key={`${code}-divider`}>{callingCodeDivider}</span>}
            </small>
          )
        })}
      </h6>
    </li>;
  }

  renderPagination(index, paginateCount) {
    return (
      <div
        className='dropdown-item'
        aria-hidden
        style={{padding: 15, cursor: 'pointer', transition: this.bgColorTransitionStyle}}
        key={`addit-results-${index}`}
        onClick={() => this.setState({ paginateCount: paginateCount + 1 })}>
        {PAGINATE_TEXT}
      </div>
    );
  }

  renderNoResults() {
    return <div style={{padding: 15, cursor: 'pointer', transition: this.bgColorTransitionStyle}} className='dropdown-item'>
      {NO_RESULTS_MESSAGE}
    </div>;
  }

  render() {
    const { paginateCount, multiSelectOpen, multiSelectItem } = this.state;
    const { open, filteredCountries, paginate, maxHeight, handleMultiSelect, setCountryDropDown } = this.props;

    return <ul
      aria-hidden
      tabIndex={-1}
      ref={dropdown => setCountryDropDown(dropdown)}
      className='dropdown-menu country-dropdown'
      style={{ display: 'block', zIndex: 101, overflowX: 'scroll', marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, maxHeight: open ? maxHeight : 0, boxShadow: open ? this.boxShadowStyle : null, borderWidth: open ? 1 : 0, padding: open ? '10px 0 10px 0' : 0, transition: 'all 0.2s ease', width: '100%', borderTop: 'none' }}>
      {filteredCountries && filteredCountries.length > 0 && filteredCountries.map((country, index) => {
        const paginateTo = paginate && parseInt(paginate, 10) * paginateCount;
        if (index <= paginateTo) {
          return this.renderListItem(country, index);
        }
        if (index - 1 === paginateTo) {
          return this.renderPagination(index, paginateCount);
        }
        return null;
      })}
      {filteredCountries && filteredCountries.length === 0 && this.renderNoResults()}
      <div
        ref={select => handleMultiSelect(select) }
        aria-hidden={!multiSelectOpen}
        className={`text-center calling-code-multi-select${multiSelectOpen ? ' open' : ''}`}
        style={{opacity: multiSelectOpen ? 1 : 0, zIndex: multiSelectOpen ? 'auto' : -1, transition: 'all 0.2s ease', backgroundColor: 'white', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%'}}>
        <button
          type='button'
          aria-hidden={!multiSelectOpen}
          aria-label='close'
          onClick={() => this.cancelMultiSelect()}
          style={{position: 'absolute', left: 10, bottom: 10}}
          className='btn btn-outline btn-outline-danger multi-select-back-btn'>
          Close
        </button>
        {Object.keys(multiSelectItem).length > 0 && multiSelectItem.countryCallingCodes.map((item) => {
          return (
            <button
              key={item}
              type='button'
              onClick={() => this.selectCountry(multiSelectItem, false, item, true)}
              style={{position: 'relative', top: '50%', transform: 'perspective(1px) translateY(-50%)', marginLeft: 8, verticalAlign: 'middle'}}
              className='btn btn-secondary'>
              {item}
            </button>
          )
        })}
      </div>
    </ul>;
  }
}