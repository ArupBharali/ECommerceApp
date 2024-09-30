import { Pagination } from 'antd';
import PropTypes from 'prop-types';

const PaginationControl = ({ pageNumber, pageSize, total, onPageChange, onPageSizeChange }) => {
    return (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Pagination
                current={pageNumber}
                pageSize={pageSize}
                total={total}
                onChange={(page, size) => {
                    onPageChange(page);
                    onPageSizeChange(size);
                }}
                showSizeChanger
                scrollToFirstRowOnChange={false} 
                pageSizeOptions={[10, 20, 30, 40, 50]}
            />
        </div>
    );
};

// Add prop-types validation
PaginationControl.propTypes = {
    pageNumber: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func.isRequired,
};

export default PaginationControl;
