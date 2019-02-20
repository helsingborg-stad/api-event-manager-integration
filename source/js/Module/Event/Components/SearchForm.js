import { Button } from 'hbg-react';

const SearchForm = ({ translation, searchString, searchSubmit }) => (
    <form onSubmit={searchSubmit}>
        <div className="grid sm-gutter">
            <div className="grid-xs-auto">
                <input type="text" onChange={searchString} placeholder={translation.search} />
            </div>
            <div className="grid-fit-content">
                <Button title={translation.search} color="primary" submit />
            </div>
        </div>
    </form>
);

export default SearchForm;
