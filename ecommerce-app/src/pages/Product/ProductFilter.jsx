import { useState } from 'react';
import PropTypes from 'prop-types';

const ProductFilter = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleSearch = () => {
        onSearch({ query, minPrice, maxPrice });
    };

    return (
        <div className="row m-2">
            <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

// Add prop-types validation
ProductFilter.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default ProductFilter;
