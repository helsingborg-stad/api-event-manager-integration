import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, onAgeRangeChange, minValue, maxValue, onChange }) => {
    
  const minChanged = (e) => {
    onChange({
      min: e.target.value,
      max: maxValue,
    });
  }

  const maxChanged = (e) => {
    onChange({
      min: minValue,
      max: e.target.value,
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