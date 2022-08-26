import React from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, minValue, maxValue, onChange }) => {
  const minLimit = ageRange[0].id;
  const maxLimit = ageRange.slice(-1)[0].id;
  const maxInputField = document.querySelector('#max');
  const minInputField = document.querySelector('#min');

  const minChanged = (e) => {
    const value = parseInt(e.target.value);
    const setValue = value >= maxValue ? maxValue - 1 : minLimit > value ? minLimit : value;

      onChange({
        min: value,
        max: maxValue
      }); 

    minInputField.addEventListener('focusout', () => {
      onChange({
        min: setValue,
        max: parseInt(maxInputField.value)
      });
    });
  }

  const maxChanged = (e) => {
    const value = parseInt(e.target.value);
    const setValue = value <= minValue ? minValue + 1 : value > maxLimit ? maxLimit + 1 : value;

      onChange({
        min: minValue,
        max: value,
     }); 

    maxInputField.addEventListener('focusout', () => {
      onChange({
        min: parseInt(minInputField.value),
        max: setValue,
      });
    });
  }

  return (
    <div>
      <div className="age-filter-container o-grid u-flex-wrap--no-wrap">
        <Input         
          id="min"
          name="min"
          handleChange={minChanged}
          label="från ålder"
          type="number"
          value={minValue}
          style={{width: "100%"}}
        />
        
        <Input         
          id="max"
          name="max"
          handleChange={maxChanged}
          label="till ålder"
          type="number"
          value={maxValue}
          style={{width: "100%"}}
        />
      </div>
    </div>

  );
};

export default AgeFilter;