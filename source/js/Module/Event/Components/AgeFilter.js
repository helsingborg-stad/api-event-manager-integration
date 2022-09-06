import React from "react";
import { Input } from "@helsingborg-stad/hbg-react";

const AgeFilter = ({ translation, minValue, maxValue, onChange, minLimit = 0, maxLimit = 99}) => {
  const tryGetFirstNonNullValue = (args = {}, callbacks = []) =>
    [...callbacks, () => ""].find((cb) => cb(args) !== null)(args);

  const getMinValue = ({ min, max }) =>
    tryGetFirstNonNullValue(
      {
        min,
        max,
        isEmpty: isNaN(min),
        isMoreThenMax: min >= max && !isNaN(max),
        isLessThanMinLimit: minLimit > min,
      },
      [
        ({ isEmpty }) => (isEmpty ? "" : null),
        ({ max, isMoreThenMax }) => (isMoreThenMax ? max - 1 : null),
        ({ isLessThanMinLimit }) => (isLessThanMinLimit ? minLimit : null),
        ({ min }) => min,
      ]
    );

  const getMaxValue = ({ min, max }) =>
    tryGetFirstNonNullValue(
      {
        min,
        max,
        isEmpty: isNaN(max),
        isLessOrEqualsMin: !isNaN(min) && max <= min,
        isMoreThenMaxLimit: max > maxLimit,
      },
      [
        ({ isEmpty }) => (isEmpty ? "" : null),
        ({ min, isLessOrEqualsMin }) => (isLessOrEqualsMin ? min + 1 : null),
        ({ isMoreThenMaxLimit }) => (isMoreThenMaxLimit ? maxLimit : null),
        ({ max }) => max,
      ]
    );

  const onChangeInputHandler =
    (isMin = true, onChangeCallback = (min, max) => {}) =>
    ({ target: { value } }) => {
      const isMax = !isMin;
      const [min, max] = [
        parseInt(isMin ? value : minValue),
        parseInt(isMax ? value : maxValue),
      ];

      onChangeCallback({ min, max });
    };

  return (
    <div>
      <div className="age-filter-container o-grid o-grid--form u-flex-wrap--no-wrap">
        <div className="o-grid-6">
          <Input
            id="min"
            name="min"
            handleChange={onChangeInputHandler(true, ({ min, max }) =>
              onChange({ min, max })
            )}
            onBlur={onChangeInputHandler(true, ({ min, max }) =>
              onChange({ min: getMinValue({ min, max }), max })
            )}
            label={translation.fromAge}
            type="number"
            value={minValue}
            style={{ width: "100%" }}
          />
        </div>
        <div className="o-grid-6">
          <Input
            id="max"
            name="max"
            handleChange={onChangeInputHandler(false, ({ min, max }) =>
              onChange({ min, max })
            )}
            onBlur={onChangeInputHandler(false, ({ min, max }) =>
              onChange({ min, max: getMaxValue({ min, max }) })
            )}
            label={translation.toAge}
            type="number"
            value={maxValue}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AgeFilter;
