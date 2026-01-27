export type ModalImportProps = {
	/** Modal có hiện ko? */
	visible: boolean;

	/** Đóng modal hoặc làm gì đó */
	onCancel: () => void;

	/** Get data hoặc làm gì đó */
	onOk: () => void;

	/** Tên model kế thừa initModel */
	modelName: any;

	/** Ấn ra ngoài để đóng, mặc định KHÔNG */
	maskCloseableForm?: boolean;

	/** Data thêm vào mỗi record khi validate và execute import */
	extendData?: Record<string, string | number>;

	/** Hàm gọi API để get file import mẫu */
	getTemplate?: () => Promise<Blob>;

	/** Tên file Excel mẫu, mặc định `File biểu mẫu.xlsx` */
	titleTemplate?: string;
};
