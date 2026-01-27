import { type ApexOptions } from 'apexcharts';

export * from './ColumnChart';
export * from './DonutChart';
export * from './LineChart';

export type DataChartType = {
	title?: string;
	xAxis: string[];
	/**
	 * Dùng cho trường hợp nhiều column
	 */
	yAxis: number[][];
	yLabel: string[];
	height?: number;
	width?: number;
	type?: 'bar' | 'area';
	colors?: string[];
	formatY?: (val: number) => string;
	showTotal?: boolean;

	otherOptions?: ApexOptions;
};
