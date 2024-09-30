import { useState, useEffect } from 'react';
import { Table, Input, Spin, Row, Col, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const { Search } = Input;

const AntTable = ({
	columns,
	data,
	totalRecords,
	pageNumber,
	pageSize,
	setPageSize,
	gotoPage,
	onPageSizeChange,
	columnFilters,
	setColumnFilters,
	loading
}) => {
	const [filteredData, setFilteredData] = useState(data);
	const [sortedInfo, setSortedInfo] = useState({});
	const [searchActive, setSearchActive] = useState(false);

	//useEffect(() => {
	//	setFilteredData(data);
	//}, [data]);

	//const handleSearch = (value, columnId) => {
	//	console.log('Antd table handleSearch called');
	//	setColumnFilters(prev => ({
	//		...prev,
	//		[columnId]: value
	//	}));
	//	setSearchActive(true); // Set search active
	//	console.log('handleSearch', { value, columnId, columnFilters });
	//};

	//useEffect(() => {
	//	console.log('Updated columnFilters:', columnFilters);
	//}, [columnFilters]);

	const handleTableChange = (pagination, filters, sorter) => {
		console.log('Antd table handleTableChange called');
		console.log('Antd table handleTableChange', 'sorter.columnKey', sorter.columnKey, 'sorter.order', sorter.order);
		//setSortedInfo(sorter);
		setPageSize(pagination.pageSize);
		gotoPage(pagination.current);
		//setColumnFilters(filters);
		//setSearchActive(false); // Reset search active on sort
	};

	//const tableColumns = columns.map(column => ({
	//	...column, // Spread the existing column properties
	//	dataIndex: column.dataIndex,
	//	key: column.key,
	//}));

	//return (
	//	<div>

	//		<Table
	//			columns={tableColumns}
	//			dataSource={filteredData}
	//			pagination={{
	//				current: pageNumber,
	//				pageSize: pageSize,
	//				total: totalRecords,
	//				onChange: (page, pageSize) => handleTableChange(
	//					{ current: page, pageSize },
	//					columnFilters,
	//					sortedInfo
	//				)
	//			}}
	//			loading={loading}
	//			onChange={handleTableChange}
	//			scroll={{ x: 'max-content' }}
	//			rowKey="id"
	//		/>
	//	</div>
	//);


	const renderMatchedText = (text, searchTerm) => {
		if (!searchTerm) return text; // Return text as is if there's no search term
		const parts = text.split(new RegExp(`(${searchTerm})`, 'gi')); // Split by the search term, case insensitive
		return parts.map((part, index) =>
			part.toLowerCase() === searchTerm.toLowerCase() ? (
				<strong key={index}>{part}</strong> // Bold the matched part
			) : (
				part // Return the non-matching part as is
			)
		);
	};



	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');

	// Search filter function
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button
					onClick={() => handleReset(clearFilters)}
					size="small"
					style={{ width: 90 }}
				>
					Reset
				</Button>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
				: '',
		//render: (text) => 
		//	searchedColumn === dataIndex ? (
		//		<span>{renderMatchedText(text, searchText)}</span> // Call the helper function
		//	) : (
		//		text // Return the text as is
		//	)
		
	});

	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};

	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText('');
	};

	const handleChange = (pagination, filters, sorter) => {
		setSortedInfo(sorter);
	};

	// Extend columns with search and sorting props
	const extendedColumns = columns.map(col => {
		return {
			...col,
			...getColumnSearchProps(col.dataIndex),
			dataIndex: col.dataIndex,
			key: col.key,
			sorter: col.sortable
				? (a, b) => {
					if (typeof a[col.dataIndex] === 'string') {
						return a[col.dataIndex].localeCompare(b[col.dataIndex]);
					}
					return a[col.dataIndex] - b[col.dataIndex];
				}
				: false,
			sortOrder: sortedInfo.columnKey === col.dataIndex && sortedInfo.order,
		};
	});

	return (
		<div>
			<p> pagination pending,
				Action buttons not appearing,
				sorting pending,
				server side filtering pending,
				editable cells with drop down feature pending,
				editable row pending,
				searching and sorting not happening together for each column, both operations are needed,
			</p>
		<Table
			columns={extendedColumns}
			dataSource={data}
			loading={loading}
			rowKey="id"
			onChange={handleChange}
			scroll={{ x: 'max-content' }}
			pagination={{
				current: pageNumber,
				pageSize: pageSize,
				total: totalRecords,
				onChange: (page, pageSize) => handleTableChange(
					{ current: page, pageSize },
					columnFilters,
					sortedInfo
				)
			}}
	/>
		</div>
	);
};

// Add prop-types validation
AntTable.propTypes = {
	columns: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		dataIndex: PropTypes.string.isRequired,
		key: PropTypes.string.isRequired,
		sortable: PropTypes.bool,
		searchable: PropTypes.bool,
	})).isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	totalRecords: PropTypes.number.isRequired,
	pageNumber: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	setPageSize: PropTypes.func.isRequired,
	gotoPage: PropTypes.func.isRequired,
	onPageSizeChange: PropTypes.func.isRequired,
	columnFilters: PropTypes.object.isRequired,
	setColumnFilters: PropTypes.func.isRequired,
	loading: PropTypes.bool,
};

export default AntTable;
