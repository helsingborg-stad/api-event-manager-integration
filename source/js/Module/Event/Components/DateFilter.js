import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { months, weekdaysLong, weekdaysShort } from '../../../Config/dateLocalization';

const DateFilter = ({ id, label, onDayChange, formatDate, value }) => (
  <div>
    <label htmlFor={id} className="text-sm sr-only">
      <strong>{label}</strong>
    </label>

    <div className="input-group">
      <span className="input-group-addon">{label}</span>
      <DayPickerInput
        id={id}
        value={value}
        classNames={{
          container: 'DayPickerInput form-control',
          overlayWrapper: 'DayPickerInput-OverlayWrapper',
          overlay: 'DayPickerInput-Overlay',
        }}
        onDayChange={day => onDayChange(day)}
        placeholder={label}
        formatDate={formatDate}
        inputProps={{
          readOnly: true,
          type: 'text',
          className: 'form-control',
        }}
        dayPickerProps={{
          fromMonth: new Date(),
          months: months.se,
          weekdaysLong: weekdaysLong.se,
          weekdaysShort: weekdaysShort.se,
          firstDayOfWeek: 1,
        }}
      />
    </div>
  </div>
);

DateFilter.propTypes = {
  formatDate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDayChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default DateFilter;
