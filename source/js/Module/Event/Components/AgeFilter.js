import React from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, minValue, maxValue, onChange }) => {
  const minLimit = ageRange[0].id;
  const maxLimit = ageRange.slice(-1)[0].id;
  
  const minChanged = (e) => {
    const inputField = e.target;
    const value = parseInt(e.target.value);
    const isMoreThenMax = value >= maxValue;
    const isLessThanMinLimit = minLimit > value;

      onChange({
        min: value,
        max: maxValue
      }); 

    inputField.addEventListener('focusout', () => {
      onChange({
        min: isMoreThenMax ? maxValue - 1 : isLessThanMinLimit ? minLimit : value,
      });
    });
  }

  const maxChanged = (e) => {
    const inputField = e.target;
    const value = parseInt(e.target.value);
    const isLessOrEqualsMin = value <= minValue;
    const isMoreThenMaxLimit = value > maxLimit;

      onChange({
        min: minValue,
        max: value,
     }); 

    inputField.addEventListener('focusout', () => {
      onChange({
        min: minValue,
        max: isLessOrEqualsMin ? minValue + 1 : isMoreThenMaxLimit ? maxLimit + 1 : value,
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