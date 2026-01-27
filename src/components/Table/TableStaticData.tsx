import { MenuOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Drawer, Input, Modal, Table, Tooltip, type InputRef } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import type { SortEnd, SortableContainerProps } from 'react-sortable-hoc';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import ButtonExtend from './ButtonExtend';
import { updateSearchStorage } from './function';
import './style.less';
import type { IColumn, TDataOption, TableStaticProps } from './typing';

const TableStaticData = (props: TableStaticProps) => {
	const { Form, showEdit, setShowEdit, addStt, data, children, hasCreate, hasTotal, rowSortable } = props;
	const [searchText, setSearchText] = useState<string>('');
	const [searchedColumn, setSearchedColumn] = useState();
	const [total, setTotal] = useState<number>();
	const searchInputRef = useRef<InputRef>(null);

	useEffect(() => {
		setTotal(data?.length);
		setSearchText('');
		setSearchedColumn(undefined);
	}, [data?.length]);

	const handleSearch = (confirm: any, dataIndex: any) => {
		confirm();
		setSearchedColumn(dataIndex);
	};

	const getColumnSearchProps = (dataIndex: any, columnTitle: any, render: any): Partial<IColumn<unknown>> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
			const searchOptions = (JSON.parse(localStorage.getItem('dataTimKiem') || '{}')[dataIndex] || []).map(
				(value: string) => ({ value, label: value }),
			);

			return (
				<div className='column-search-box' onKeyDown={(e) => e.stopPropagation()}>
					<AutoComplete
						options={searchOptions}
						onSelect={(value: string) => {
							setSelectedKeys([value]);
							handleSearch(confirm, dataIndex);
						}}
					>
						<Input.Search
							placeholder={`Tìm ${columnTitle}`}
							allowClear
							enterButton
							value={selectedKeys[0]}
							onChange={(e) => {
								if (e.type === 'click') {
									setSelectedKeys([]);
									confirm();
								} else {
									setSelectedKeys(e.target.value ? [e.target.value] : []);
								}
							}}
							onSearch={(value) => {
								if (value) updateSearchStorage(dataIndex, value);
								handleSearch(confirm, dataIndex);
							}}
							ref={searchInputRef}
						/>
					</AutoComplete>
				</div>
			);
		},
		filterIcon: (filtered: boolean) => <SearchOutlined className={filtered ? 'text-primary' : undefined} />,
		onFilter: (value: any, record: any) =>
			typeof dataIndex === 'string'
				? record[dataIndex]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
				: typeof dataIndex === 'object'
				? record[dataIndex[0]][dataIndex?.[1]]?.toString()?.toLowerCase()?.includes(value.toLowerCase())
				: '',
		onFilterDropdownVisibleChange: (vis) => vis && setTimeout(() => searchInputRef?.current?.select(), 100),
		render: (text: any, record: any) =>
			render ? (
				render(text, record)
			) : searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const getFilterColumnProps = (dataIndex: any, filterData?: any[]): Partial<IColumn<unknown>> => {
		return {
			filters: filterData?.map((item: string | TDataOption) =>
				typeof item === 'string'
					? { key: item, value: item, text: item }
					: { key: item.value, value: item.value, text: item.label },
			),
			onFilter: (value: any, record: any) => record[dataIndex]?.indexOf(value) === 0,
			filterSearch: true,
		};
	};

	const columns = props.columns
		?.filter((item) => !item.hide)
		?.map((item) => ({
			...item,
			...(item?.filterType === 'string'
				? getColumnSearchProps(item.dataIndex, item.title, item.render)
				: item?.filterType === 'select'
				? getFilterColumnProps(item.dataIndex, item.filterData)
				: undefined),
			...(item?.sortable && {
				sorter: (a: any, b: any) => {
					const aValue = _.get(a, item?.dataIndex ?? '', undefined);
					const bValue = _.get(b, item?.dataIndex ?? '', undefined);
					return item.customSort ? item.customSort(aValue, bValue) : aValue > bValue ? 1 : -1;
				},
			}),
			// Xử lý các cột children tương tự cột chính
			children: item.children?.map((child) => ({
				...child,
				...(child?.filterType === 'string'
					? getColumnSearchProps(child.dataIndex, item.title, item.render)
					: child?.filterType === 'select'
					? getFilterColumnProps(child.dataIndex, child.filterData)
					: undefined),
				...(child?.sortable && {
					sorter: (a: any, b: any) =>
						child.customSort
							? child.customSort(a[child.dataIndex as string], b[child.dataIndex as string])
							: a[child.dataIndex as string] > b[child.dataIndex as string]
							? 1
							: -1,
				}),
			})),
		}));

	if (addStt)
		columns.unshift({
			title: 'TT',
			dataIndex: 'index',
			align: 'center',
			width: 40,
			children: undefined,
		});

	//#region Get Drag Sortable column
	const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

	const SortableItem = SortableElement((props1: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props1} />);
	const SortableBody = SortableContainer((props1: React.HTMLAttributes<HTMLTableSectionElement>) => (
		<tbody {...props1} />
	));

	if (rowSortable)
		columns.unshift({
			title: '',
			width: 30,
			align: 'center',
			children: undefined,
			render: () => <DragHandle />,
		});

	const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
		if (oldIndex !== newIndex) {
			const record = props.data?.[oldIndex];
			if (props.onSortEnd) props.onSortEnd(record, newIndex);
		}
	};

	const DraggableContainer = (props1: SortableContainerProps) => (
		<SortableBody useDragHandle disableAutoscroll helperClass='row-dragging' onSortEnd={onSortEnd} {...props1} />
	);

	const DraggableBodyRow: React.FC<any> = ({ className, style, ...restProps }) => {
		// function findIndex base on Table rowKey props and should always be a right array index
		const index = restProps['data-row-key'];
		return <SortableItem index={index ?? 0} {...restProps} />;
	};
	//#endregion

	return (
		<div className='table-base'>
			<div className='header'>
				{children}
				<div className='action'>
					{hasCreate && (
						<ButtonExtend
							onClick={() => {
								if (setShowEdit) setShowEdit(true);
							}}
							icon={<PlusOutlined />}
							type='primary'
							style={{ marginBottom: 8 }}
							size={props?.size ?? 'middle'}
							tooltip='Thêm mới dữ liệu'
						>
							Thêm mới
						</ButtonExtend>
					)}
				</div>

				<div className='extra'>
					{hasTotal ? (
						<Tooltip title='Tổng số dữ liệu'>
							<div className={classNames({ total: true, small: props?.size === 'small' })}>
								Tổng số:
								<span>{total || props.data?.length || 0}</span>
							</div>
						</Tooltip>
					) : null}
				</div>
			</div>

			<Table
				title={props?.title ? () => props.title : false}
				columns={columns}
				dataSource={(props?.data ?? []).map((item, index) => ({
					...item,
					index: index + 1,
					key: index,
					children:
						!props.hideChildrenRows && item?.children && Array.isArray(item.children) && item.children.length
							? item.children
							: undefined,
				}))}
				onChange={(pagination, filters, sorter, extra) => {
					setTotal(extra.currentDataSource.length ?? pagination.total);
				}}
				loading={props?.loading}
				size={props.size}
				scroll={{ x: _.sum(columns.map((item) => item.width ?? 80)) }}
				bordered
				components={
					rowSortable
						? {
								body: {
									wrapper: DraggableContainer,
									row: DraggableBodyRow,
								},
						  }
						: undefined
				}
				{...props?.otherProps}
			/>
			{Form && (
				<>
					{props?.formType === 'Drawer' ? (
						<Drawer
							width={props?.widthDrawer}
							onClose={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
							visible={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</Drawer>
					) : (
						<Modal
							width={props?.widthDrawer}
							onCancel={() => {
								if (setShowEdit) setShowEdit(false);
							}}
							destroyOnClose
							footer={false}
							bodyStyle={{ padding: 0 }}
							visible={showEdit}
						>
							<Form
								onCancel={() => {
									if (setShowEdit) setShowEdit(false);
								}}
								{...props.formProps}
							/>
						</Modal>
					)}
				</>
			)}
		</div>
	);
};

export default TableStaticData;
