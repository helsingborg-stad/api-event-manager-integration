import React from "react";
import { useState, useEffect } from "react";

const AgeFilter = ({ translation, ageRange, onAgeChange }) => {
  const [toggleState, setToggleState] = useState(false);

  const initialMin = 0;
  const initialMax = 100;

  const minAge = ageRange;
  const maxAge = ageRange;

  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const toggleAge = () => {
    setToggleState(!toggleState);
  };

  const minChanged = (value) => {
    setMinValue(value)
  }
  const maxChanged = (value) => {
    setMaxValue(value)
  }

  useEffect(() => {
    onChange({min: minValue, max: maxValue})
  }, [minValue, maxValue])

  const onChange = ({min, max}) => {
    const buildAgeRange = range(min, max);

    onAgeChange(buildAgeRange);
  }

  return (
    <div>
      <button
        className="c-button c-button__filled c-button__filled--default c-button--md"
        onClick={toggleAge}
      >
        <span className="c-button__label-text">{translation.selectAge}</span>
        <span className="c-button__label-icon">
          <i id="down-arrow" class="c-icon c-icon--size-md material-icons">
            keyboard_arrow_down
          </i>
        </span>
        <span className="c-button__label-icon">
          <i id="up-arrow" class="c-icon c-icon--size-md material-icons hide">
            keyboard_arrow_up
          </i>
        </span>
      </button>

      <div className="age-filter-container u-position--absolute u-level-top">
        <div className="age-input">
          <label for="min"></label>
          <input id="min" onChange={minChanged} value={minValue}></input>
          <span>—</span>
          <label for="max"></label>
          <input id="max" onChange={maxChanged} value={maxValue}></input>
        </div>  
      </div>
    </div>

  );
};

export default AgeFilter;