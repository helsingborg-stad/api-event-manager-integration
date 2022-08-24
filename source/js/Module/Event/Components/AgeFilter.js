import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, onAgeRangeChange, minValue, maxValue, onChange }) => {
    
  const minLimit = ageRange[0].id;
  const maxLimit = ageRange.slice(-1).id;

  const minChanged = (e) => {
    const value = parseInt(e.target.value);
    const isMoreThenMax = value >= maxValue;
    const isLessThanMinLimit = minLimit > value;
    
    onChange({
      min: isMoreThenMax ? maxValue - 1 : isLessThanMinLimit ? minLimit : value,
      max: maxValue,
    });
  }

  const maxChanged = (e) => {
    const value = parseInt(e.target.value);
    const isLessOrEqualsMin = value <= minValue;
    const isMoreThenMaxLimit = value > maxLimit;

    onChange({
      min: minValue,
      max: isLessOrEqualsMin ? minValue + 1 : isMoreThenMaxLimit ? minValue +1 : value,
    });
  }

  return (
    <div>
      {/* <span>{translation.selectAge}</span> */}
      <div className="age-filter-container ">
        <Input         
          id="min"
          name="min"
          handleChange={minChanged}
          label="min"
          type="number"
          value={minValue}
        />

        <Input         
          id="max"
          name="max"
          handleChange={maxChanged}
          label="max"
          type="number"
          value={maxValue}
        />
      </div>
    </div>

  );
};

export default AgeFilter;