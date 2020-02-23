import React, { useState, useCallback, useRef, useEffect } from 'react'
import styled from 'styled-components';


const Tooltip = styled.div`
  position: relative;
  height: fit-content;
  width: fit-content;

  &::after {
    content: 'Your value: ${props => format(props.content)}';
    display: block;
    width: fit-content;
    white-space: nowrap;
    position: absolute;
    background-color: hotpink;
    background-image: linear-gradient(red, yellow, green);
    padding: 0.5em 1.2em;
    color: black;
    font-size: 12px;
    bottom: 5px;
    left: 0;
    border-radius: 5px;
    transform: scale(0);
    transition: transform ease-out 150ms;
    z-index: 1;
  }

  &:hover::after {
    transform: scale(1);
  }
`

const Input = styled.input`
  height: 20px;
  width: 100px;
  text-align: right;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`

// strips dollar sign and commas
const stripFormat = (number, fixed = 2) => {
    const splitNumber = number.split('.');
    splitNumber[0] = splitNumber[0].replace(/[^\d.-]/g, '');
    return Number(splitNumber.join('.')).toFixed(fixed);
};

// adds dollar signs and commas
const format = (number, fixed = 2) => {
    // TODO:
    // const isNegative = number < 0;
    const num = Number(number).toFixed(fixed);
    const splitNumber = num.toString().split('.');
    splitNumber[0] = splitNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return '$' + splitNumber.join('.')
    // return isNegative ? '($' + splitNumber.join('.') + ')' : '$' + splitNumber.join('.');
};

export default function DollarInput(props) {
    const { value, after, before, onValueChange } = props;
    const [stateValue, setValue] = useState(0);
    const inputRef = useRef();
  
    useEffect(() => {
      const valueCheck = value == null ? 0 : value;
      setValue(format(valueCheck, after || 2));
    }, [after, value]);
    
    const blur = useCallback(value => {
      setValue(format(value, after || 2));
      onValueChange(stripFormat(value, after || 2))
    }, [onValueChange, after]);
  
    const focus = useCallback(value => {
      setValue(stripFormat(value, after || 2));
    }, [after]);
  
    const selectTextToEdit = useCallback(() => {
      inputRef.current.select();
    }, []);
  
    const limit = useCallback(
      (value, before = 9, after = 2) => {
        // if the value isn't a number, and the value isn't an empty string, and the item at index 0 isn't '-'
        if ((!Number(value) && value !== "" && value[0] !== '-') || 
            // or if the length of value is greater than one and the current character is '-' 
            (value.length > 1 && value.charCodeAt(value.length - 1) === 45) ||
            // // or if there are more than one decimal return the state value
            (value.split('.').length-1 > 1)) return stateValue;

        const values = value.split(".");
        // fake that there are decimal values if there aren't any
        const decimalLength = values[1] ? values[1].length : 2;
        // if the numbers before or after the decimal are too large return the state value
        if (values[0].length > before || decimalLength > after) {            
          return stateValue;
        // else, return the new value
        } else return value;
      },
      [stateValue]
    );
  
    const valueHandler = useCallback(value => {
      setValue(limit(value, before || 9, after || 2));
    }, [limit, before, after]);
  
    return (
        <Tooltip content={stateValue}>
            <Input
            ref={inputRef}
            required={false}
            autocomplete={false}
            value={stateValue}
            onFocus={e => focus(e.target.value)}
            onBlur={e => blur(e.target.value)}
            onChange={e => valueHandler(e.target.value)}
            onClick={selectTextToEdit}
            />
        </Tooltip>
    );
}
