import DayPickerInput from 'react-day-picker/DayPickerInput';
import { Button, Dropdown } from 'hbg-react';
import { months, weekdaysLong, weekdaysShort } from '../../../Config/dateLocalization.js';

const Filters = ({
    translation,
    updateSearchString,
    onSubmit,
    fromDateChange,
    toDateChange,
    formatDate,
    categories,
    onCategoryChange,
}) => (
    <form onSubmit={onSubmit}>
        <div className="grid">
            <div className="grid-sm-12 grid-md-auto">
                <label htmlFor="filter-keyword" className="text-sm sr-only">
                    <strong>{translation.search}</strong>
                </label>

                <div className="input-group">
                    <span className="input-group-addon">
                        <i className="fa fa-search" />
                    </span>
                    <input
                        type="text"
                        id="filter-keyword"
                        className="form-control"
                        onChange={updateSearchString}
                        placeholder={translation.search}
                    />
                </div>
            </div>

            <div className="grid-sm-12 grid-md-auto">
                <label htmlFor="filter-date-from" className="text-sm sr-only">
                    <strong>{translation.datePublished}</strong>
                </label>
                <div className="input-group">
                    <span className="input-group-addon">{translation.from}:</span>
                    <DayPickerInput
                        onDayChange={day => fromDateChange(day)}
                        placeholder={translation.fromDate}
                        formatDate={formatDate}
                        inputProps={{
                            readOnly: true,
                            type: 'text',
                        }}
                        dayPickerProps={{
                            fromMonth: new Date(),
                            months: months.se,
                            weekdaysLong: weekdaysLong.se,
                            weekdaysShort: weekdaysShort.se,
                            firstDayOfWeek: 1,
                        }}
                    />

                    <span className="input-group-addon">{translation.to}:</span>
                    <DayPickerInput
                        onDayChange={day => toDateChange(day)}
                        placeholder={translation.toDate}
                        formatDate={formatDate}
                        inputProps={{
                            readOnly: true,
                            type: 'text',
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

            <div className="grid-sm-12 grid-md-fit-content">
                <label htmlFor="filter-period" className="text-sm sr-only">
                    {translation.categories}
                </label>

                <Dropdown title={translation.categories} toggleClass="btn">
                    {categories.map(item => (
                        <label key={item.id} className="checkbox u-px-1">
                            <input
                                type="checkbox"
                                name="filter[categories][]"
                                value={item.id}
                                onChange={e => onCategoryChange(e, item.id)}
                                checked={item.checked}
                            />{' '}
                            {item.title}
                        </label>
                    ))}
                </Dropdown>
            </div>

            <div className="grid-sm-12 grid-md-fit-content">
                <Button title={translation.search} color="primary" submit />
            </div>
        </div>
    </form>
);

export default Filters;
