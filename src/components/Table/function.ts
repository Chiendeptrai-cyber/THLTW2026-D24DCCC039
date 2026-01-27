import type { IColumn, TFilter } from './typing';

export const findFiltersInColumns = (columns: IColumn<unknown>[], filters?: TFilter<unknown>[]) => {
	if (!filters?.length) return [];
	return filters.filter((fil) => {
		const field = JSON.stringify(fil.field);
		return columns.some((col) => JSON.stringify(col.dataIndex) === field);
	});
};

// Hàm lưu dữ liệu tìm kiếm vào localStorage
export const updateSearchStorage = (dataIndex: string, value: string) => {
	const savedSearchValues = JSON.parse(localStorage.getItem('dataTimKiem') || '{}');
	const currentSearchValues = savedSearchValues[dataIndex] || [];

	// Thêm giá trị mới vào đầu danh sách, loại bỏ trùng lặp và giữ tối đa 10 giá trị
	const newValues = [value, ...currentSearchValues];
	const uniqueValues = [...new Set(newValues)].slice(0, 10);

	savedSearchValues[dataIndex] = uniqueValues;
	localStorage.setItem('dataTimKiem', JSON.stringify(savedSearchValues));
};
