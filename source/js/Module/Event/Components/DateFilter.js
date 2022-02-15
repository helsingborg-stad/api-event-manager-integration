
import PropTypes from 'prop-types';
import { Input } from '@helsingborg-stad/hbg-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DayPicker from 'react-day-picker';
import { months, weekdaysLong, weekdaysShort } from '../../../Config/dateLocalization';
import 'react-day-picker/lib/style.css';
class DateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDayPicker: false
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleClickOutside = (e) => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.setState({...this.state, showDayPicker: false})
  }  

  render() {
    const {showDayPicker} = this.state;
    const { id, label, onDayChange, value } = this.props;
    return (
      <div ref={node => this.node = node}>
          <Input
            className="form-control"
            id={id}
            label={label}
            type="text"
            value={value}
            onFocus={() => {
              this.setState({...this.state, showDayPicker: true})
            }}
          />

          {
            showDayPicker && (
                <DayPicker
                  fromMonth={new Date()}
                  months={months.se}
                  weekdaysLong={weekdaysLong.se}
                  weekdaysShort={weekdaysShort.se}
                  firstDayOfWeek={1}
                  onDayClick={day => {
                    this.setState({...this.state, showDayPicker: false})
                    onDayChange(day)
                  }}
              />
            )
          }
      </div>
    )
  }
}

DateFilter.propTypes = {
  formatDate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onDayChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default DateFilter;