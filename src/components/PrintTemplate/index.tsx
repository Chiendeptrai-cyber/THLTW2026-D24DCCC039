import { coQuanChuQuan, unitName } from '@/services/base/constant';
import { Col, Row } from 'antd';
import moment from 'moment';
import React from 'react';
import './style.less';

/**
 * PRINT TEMPLATE
 * Có 2 class chính: `to-print` & `no-print`
 * Children có thể được hiện luôn trên web, ko cần `to-print`
 */
const PrintTemplate = React.forwardRef(
	(
		props: {
			children: React.ReactNode;
			title?: string;
			subTitle?: React.ReactNode;
			footer?: React.ReactNode;
			hideTieuNgu?: boolean;

			/** Tên Phòng ban hiển thị dưới tên trường */
			tenPhongBan?: string;
		},
		ref: any,
	) => {
		const { children, title, subTitle, footer, hideTieuNgu, tenPhongBan } = props;

		// const componentRef = useRef(null);

		// 	const reactToPrintContent = useCallback(() => componentRef.current, [componentRef.current]);

		// 	const reactToPrintTrigger = useCallback(
		// 		() => (
		// 			<Button icon={<PrinterOutlined />} disabled={!danhSach.length}>
		// 				<span className='extend'>In bảng điểm</span>
		// 			</Button>
		// 		),
		// 		[danhSach.length],
		// 	);

		// BUTTON PRINT
		// <ReactToPrint
		// 	content={reactToPrintContent}
		// 	documentTitle='Kết quả học tập học phần'
		// 	trigger={reactToPrintTrigger}
		// 	removeAfterPrint
		// />;

		// PRINT CONTENT
		// <PrintTemplate ref={componentRef}></PrintTemplate>

		return (
			<div className='print-section' ref={ref}>
				<div className='to-print'>
					{!hideTieuNgu ? (
						<Row gutter={[5, 5]}>
							<Col span={12} style={{ textAlign: 'center' }}>
								{!!tenPhongBan ? (
									<>
										<div>{unitName.toUpperCase()}</div>
										<span className='tieu-ngu'>{tenPhongBan.toUpperCase()}</span>
									</>
								) : (
									<>
										<div>{coQuanChuQuan.toUpperCase()}</div>
										<span className='tieu-ngu'>{unitName.toUpperCase()}</span>
									</>
								)}
							</Col>
							<Col span={12} style={{ textAlign: 'center' }}>
								<div className='quoc-hieu'>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
								<span className='tieu-ngu'>Độc lập - Tự do - Hạnh phúc</span>
							</Col>

							<Col span={12} style={{ textAlign: 'center' }}>
								Số: ....................
							</Col>
							<Col span={12} className='date'>
								...................., {moment().format('ngà\\y DD t\\háng MM nă\\m YYYY')}
							</Col>
						</Row>
					) : null}

					<div className='title'>{title}</div>
					<div className='sub-title'>{subTitle}</div>
				</div>

				{children}

				<div className='to-print' style={{ marginTop: 8 }}>
					{footer ?? (
						<Row gutter={[5, 5]}>
							<Col span={12} push={12} style={{ textAlign: 'center' }}>
								<b>CÁN BỘ LẬP DANH SÁCH</b>
							</Col>
						</Row>
					)}
				</div>
			</div>
		);
	},
);

export default PrintTemplate;
