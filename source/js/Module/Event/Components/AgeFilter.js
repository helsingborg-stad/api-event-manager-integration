import React from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, ageRange, minValue, maxValue, onChange }) => {
  const minLimit = ageRange[0].id;
  const maxLimit = ageRange.slice(-1)[0].id;
  
  const tryGetFirstNonNullValue = (args = {}, callbacks = []) => (
    [...callbacks, () => ''].find(cb => cb(args) !== null)(args)
  );

  const getMinValue = ({ min, max }) => (tryGetFirstNonNullValue(
    {
      min, 
      max, 
      isEmpty: isNaN(min),
      isMoreThenMax: min >= max && !isNaN(max), 
      isLessThanMinLimit: minLimit > min,
    }, 
    [
      ({isEmpty})                 => isEmpty ? '' : null,
      ({max, isMoreThenMax})      => isMoreThenMax ? max - 1 : null,
      ({isLessThanMinLimit})      => isLessThanMinLimit ? minLimit : null,
      ({min})                     => min,
    ]
  ));

  const getMaxValue = ({ min, max }) => (tryGetFirstNonNullValue(
    {
      min, 
      max, 
      isEmpty : isNaN(max),
      isLessOrEqualsMin: !isNaN(min) && max <= min, 
      isMoreThenMaxLimit: max > maxLimit,
    }, 
    [
      ({isEmpty})                 => isEmpty ? '' : null,
      ({min, isLessOrEqualsMin})  => isLessOrEqualsMin ? min + 1 : null,
      ({isMoreThenMaxLimit})      => isMoreThenMaxLimit ? maxLimit : null,
      ({max})                     => max,
    ]
  ));
  
  const onChangeInputHandler = (isMin = true, onBlur = false) => (({ target : { value }}) => {
    const isMax = !isMin;
    const [ min, max ] = [
      parseInt(isMin ? value : minValue),
      parseInt(isMax ? value : maxValue)
    ];

    onChange(onBlur 
      ? {
        min: isMin ? getMinValue({min, max}) : minValue,
        max: isMax ? getMaxValue({min, max}) : maxValue,
      }
      : {
        min: isMin ? min : minValue,
        max: isMax ? max : maxValue,
      }
    );
  });

  return (
    <div>
      <div className="age-filter-container o-grid u-flex-wrap--no-wrap">
        <Input         
          id="min"
          name="min"
          handleChange={onChangeInputHandler(true)}
          onBlur={onChangeInputHandler(true, true)}
          label="från ålder"
          type="number"
          value={minValue}
          style={{width: "100%"}}
        />
        
        <Input         
          id="max"
          name="max"
          handleChange={onChangeInputHandler(false)}
          onBlur={onChangeInputHandler(false, true)}
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