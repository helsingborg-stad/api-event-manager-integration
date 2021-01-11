import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { months, weekdaysLong, weekdaysShort } from '../../../Config/dateLocalization';

const DateFilter = ({ id, label, onDayChange, formatDate, value }) => (
  <div>
    <div id="" class="c-field c-field__text">
      <input 
        id={id}
        value={value}
        type="text" name="date_{id}" 
        data-invalid-message="You need to add a valid date!" 
        js-datepicker="1" 
        c-datepicker-min="6/29/1997" 
        c-datepicker-max="12/23/2020"
        c-datepicker-title="Välj ett datum" 
        c-datepicker-showresetbutton="1" 
        c-datepicker-showdaysoutofmonth="1" 
        c-datepicker-showclearbutton="1" 
        c-datepicker-hideonblur="1"
        c-datepicker-hideonselect="0"
        placeholder={label}
        formatDate={formatDate} /> 
        <label class="c-field__text--label">{label}</label>
        <div id="error_input__message" class="c-field__input-invalid-message">
          <i id="" class="c-icon c-icon--color- c-icon--size-sm material-icons" data-uid="5fe1f4c69cc23">error</i>
        </div>
      </div>







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
);

DateFilter.propTypes = {
  formatDate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDayChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default DateFilter;
