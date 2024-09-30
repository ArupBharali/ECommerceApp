import { useEffect } from 'react';
import { useTable, usePagination, useSortBy, useFilters } from 'react-table';
import {Table, Input } from 'antd';
import PropTypes from 'prop-types';

const { Search } = Input;

const ReactTable = ({ columns, data, pageIndex, pageSize, setPageSize, gotoPage, onPageSizeChange, columnFilters, setColumnFilters }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                pageIndex,
                pageSize,
            },
        },
        useFilters, // Use filtering
        useSortBy, // Use sorting
        usePagination // Use pagination
        );

    const handleFilterChange = (value, columnId) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnId]: value
        }));
        console.log('columnFilters', columnFilters,'value',value,'columnId',columnId);
    };

    useEffect(() => {
        console.log('Updated columnFilters:', columnFilters);
    }, [columnFilters]);

    const handleSorter = (a, b, columnId) => {
        // Handle string comparison
        if (typeof a[columnId] === 'string') {
            return a[columnId].localeCompare(b[columnId]);
        }
        // Handle numerical comparison
        return a[columnId] - b[columnId];
    };

    const tableColumns = headerGroups[0].headers.map(column => ({
        title: (
            <div>
                <div>{column.render('Header')}</div>
                {column.canFilter ? (
                    <Search
                        placeholder={`Search ${column.render('Header')}`}
                        onSearch={value => handleFilterChange(value, column.id)}
                        style={{ width: '100%' }}
                    />
                ) : null}
            </div>
        ),
        dataIndex: column.id,
        key: column.id,
        sortDirections: ['ascend', 'descend'], // Sorting directions
        sorter: column.canSort ? (a, b) => handleSorter(a, b, column.id) : false,// Sorting logic here
        filterMultiple: false,
        filteredValue: columnFilters[column.id] || null
    }));

    return (
        <Table
            {...getTableProps()}
            dataSource={data}
            pagination={false} // Disable default pagination
            columns={tableColumns}
            rowKey="productId"
            scroll={{ x: 'max-content' }}
        >
            <Table.Header>
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                    <Table.Row {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                        {headerGroup.headers.map((column, columnIndex) => (
                            <Table.HeaderCell {...column.getHeaderProps(column.getSortByToggleProps())} key={columnIndex}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                </span>
                            </Table.HeaderCell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>

            <Table.Body {...getTableBodyProps()}>
                {page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                        <Table.Row {...row.getRowProps()} key={rowIndex}>
                            {row.cells.map((cell, cellIndex) => (
                                <Table.Cell {...cell.getCellProps()} key={cellIndex}>
                                    {cell.render('Cell')}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table>
    );
};


// Add prop-types validation
ReactTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired, // Columns should be an array of objects
    data: PropTypes.arrayOf(PropTypes.object).isRequired,    // Data should be an array of objects
    pageIndex: PropTypes.number.isRequired,                  // Page index should be a number
    pageSize: PropTypes.number.isRequired,                   // Page size should be a number
    setPageSize: PropTypes.func.isRequired,                  // Function to set page size
    gotoPage: PropTypes.func.isRequired,                     // Function to go to a specific page
    onPageSizeChange: PropTypes.func.isRequired,             // Function to handle page size change
    columnFilters: PropTypes.object.isRequired,              // Column filters should be an object
    setColumnFilters: PropTypes.func.isRequired,             // Function to set column filters
};

export default ReactTable;












