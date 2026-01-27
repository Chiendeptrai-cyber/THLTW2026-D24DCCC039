export type ModalExportProps = {
	/** Modal có hiện không */
	visible: boolean;

	/** Tắt modal đi */
	onCancel: () => void;

	/** Tên model kế thừa initModel */
	modelName: any;

	/** Ấn ra ngoài để đóng, mặc định KHÔNG */
	maskCloseableForm?: boolean;

	/** Tên file tải về */
	fileName: string;

	/** Condition truyền lên để lấy dữ liệu */
	condition?: Record<string, any>;

	/** Filter truyền lên để lấy dữ liệu */
	filters?: TFilter<any>[];

	/** Other query truyền lên để lấy dữ liệu */
	otherQuery?: Record<string, any>;
};
