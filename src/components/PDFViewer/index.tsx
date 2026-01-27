import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import ReactToPrint from 'react-to-print';
import styles from './styles.less';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = (props: { data: any; pagination?: boolean; scale?: number }) => {
	const [numPages, setNumPages] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	// const [scale, setScale] = useState<number>(1);
	const docRef = useRef<any>();
	const [loadingText] = useState('Đang tải tài liệu. Vui lòng chờ trong giây lát...');

	const onDocumentLoadSuccess = (data: { numPages: number }) => {
		setPageNumber(1);
		setNumPages(data.numPages);
	};

	return (
		<div style={{ textAlign: 'center' }}>
			<div>
				<ReactToPrint
					trigger={() => {
						return (
							<button style={{ display: 'none' }} id='printButton'>
								Print
							</button>
						);
					}}
					content={() => docRef.current}
				/>
			</div>
			<div ref={docRef} style={{ textAlign: 'center', marginBottom: 12 }}>
				<Document
					onLoadSuccess={onDocumentLoadSuccess}
					onLoadError={() => setNumPages(0)}
					file={props.data}
					noData={<div style={{ padding: '32px 0' }}>{loadingText}</div>}
					loading={<div style={{ padding: '32px 0' }}>{loadingText}</div>}
					error={loadingText}
				>
					<Page pageNumber={pageNumber} scale={props.scale ?? 1.8} loading='Đang tải...' />
				</Document>
			</div>

			<div>
				{props.pagination && (
					<Button disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)} className={styles.prev}>
						<ArrowLeftOutlined /> Trước
					</Button>
				)}
				<div>
					<span>
						Trang {pageNumber} trên tổng số {numPages}
					</span>
				</div>

				{/* <div>
              <span>Phóng to: {scale}</span>
              <Slider
                min={1}
                max={2}
                value={scale}
                step={0.1}
                onChange={(page) => setScale(page)}
              />
            </div> */}
				{props.pagination && (
					<Button
						disabled={numPages <= pageNumber}
						onClick={() => setPageNumber(pageNumber + 1)}
						className={styles.next}
					>
						Sau <ArrowRightOutlined />
					</Button>
				)}
			</div>
		</div>
	);
};

export default PDFViewer;
