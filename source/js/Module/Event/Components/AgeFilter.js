import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, onAgeRangeChange, minValue, maxValue, onChange }) => {
    
  const minLimit = 0;
  const maxLimit = 100;

  const minChanged = (e) => {
    const isMoreThenMax = parseInt(e.target.value) >= maxValue;
    const isLessThanMinLimit = minLimit > parseInt(e.target.value);

    const value = isMoreThenMax ? maxValue - 1 : isLessThanMinLimit ? minLimit : parseInt(e.target.value);

    onChange({
      min: value,
      max: maxValue,
    });
  }

  const maxChanged = (e) => {
    const isLessOrEqualsMin = parseInt(e.target.value) <= minValue;
    const isMoreThenMaxLimit = parseInt(e.target.value) > maxLimit;

    const value = isLessOrEqualsMin ? minValue + 1 : isMoreThenMaxLimit ? minValue +1 : parseInt(e.target.value);

    onChange({
      min: minValue,
      max: value,
    });
  }

  return (
    <div >

      {translation.selectAge}

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

  );
};

export default AgeFilter;