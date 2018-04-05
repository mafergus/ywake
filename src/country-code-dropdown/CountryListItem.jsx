import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import { MISSING_FLAGS } from './Constants';
import FlagIcon from '../FlagIcon';

export default class CountryListItem extends Component {

  static propTypes = {
    callingCodeDivider: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]).isRequired,
    country: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    index: PropTypes.number.isRequired,
    isHovered: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    onClick: null,
  };
  
  constructor() {
    super();
    autoBind(this);

    this.state = {
      hoverIndex: NaN,
    };
  }

  getBgColor() {
    const { isHovered, isSelected } = this.props;
    const tabbed = false;
    if (tabbed) {
      return '#EBEBEB'
    } else if (isSelected && isHovered) {
      return '#BBDEF8'
    } else if (isSelected) {
      return '#E3F2FD'
    } else if (isHovered) {
      return '#EBEBEB'
    }
  }

  render() {
    const { selectedCountry, searchTerm, lastPreferred, tabbedIndex, hoverIndex } = this.state;
    const { callingCodeDivider, country, index, isSelected, onClick } = this.props;
    const { name, alpha2, countryCallingCodes } = country;

    return <li
      id={alpha2}
      tabIndex={0}
      onMouseEnter={() => this.setState({ hoverIndex: index })}
      onMouseLeave={() => this.setState({ hoverIndex: NaN })}
      key={`${alpha2}-${index}`}
      style={{ padding: 15, cursor: 'pointer',
        borderBottom: lastPreferred && lastPreferred.alpha2 === alpha2 && searchTerm === '' ? '1px solid #c1c1c1' : '',
        transition: this.bgColorTransitionStyle,
        backgroundColor: this.getBgColor() }}
      onClick={() => onClick(country, false, false, true)}>
      <h6 style={{margin: 0, display: "flex", alignItems: "center"}}>
        <FlagIcon style={{ marginRight: 10 }} code={MISSING_FLAGS[alpha2] ? MISSING_FLAGS[alpha2] : alpha2} size={30} />
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
}