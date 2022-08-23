import React from "react";
import { useState, useEffect } from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, onAgeChange, minValue, maxValue, onChange }) => {  
  const minChanged = (value) => {
    onChange({
      min: value,
      max: maxValue,
    });
  }

  const maxChanged = (value) => {
    onChange({
      min: minValue,
      max: value,
    });
  }

  return (
    <div>
      <Input         
        id="min"
        handleChange={minChanged}
        label="min"
        type="number"
        value={minValue}
      />

      <Input         
        id="max"
        handleChange={maxChanged}
        label="max"
        type="number"
        value={maxValue}
      />
    </div>

  );
};

export default AgeFilter;