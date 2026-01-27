import { blobToBase64, getNameFile } from '@/utils/utils';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Image, Upload, message, type UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';
import type { UploadFile as UpFile } from 'antd/es/upload/interface';
import { type SizeType } from 'antd/lib/config-provider/SizeContext';
import { useEffect, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import './UploadAvatar.less';

type TResizeProps = {
	/** Chiều rộng tối đa của hình ảnh sau khi resize */
	maxWidth?: number;
	/** Chiều cao tối đa của hình ảnh sau khi resize */
	maxHeight?: number;
	/** Định dạng của hình ảnh mới */
	compressFormat?: 'jpeg' | 'png' | 'webp';
	/** Chất lượng của hình ảnh mới */
	quality?: number;
	/** Độ xoay theo chiều kim đồng hồ áp dụng cho hình ảnh được tải lên */
	rotation?: number;
	/** Loại đầu ra của hình ảnh mới */
	outputType?: 'base64' | 'blob' | 'file';
	/** Chiều rộng tối thiểu của hình ảnh mới */
	minWidth?: number;
	/** Chiều cao tối thiểu của hình ảnh mới */
	minHeight?: number;
};

type TFile = UpFile & { resized?: boolean; remote?: boolean };

const UploadFile = (props: {
	fileList?: any;
	value?: string | string[] | null | { fileList: UpFile[]; [key: string]: any };
	onChange?: (val: { fileList: any[] | null }) => void;
	maxCount?: number;
	drag?: boolean;
	accept?: string;
	buttonDescription?: string;
	buttonSize?: SizeType;
	otherProps?: UploadProps;
	isAvatar?: boolean;
	isAvatarSmall?: boolean;
	disabled?: boolean;
	/** Sử dụng khi `isAvatar` hoặc `isAvatarSmall`. */
	resize?: boolean | TResizeProps;
	maxFileSize?: number;
}) => {
	const {
		value,
		onChange,
		otherProps,
		drag,
		buttonSize,
		buttonDescription,
		accept,
		isAvatar,
		isAvatarSmall,
		maxFileSize = 5,
	} = props;
	const limit = props.maxCount || 1;
	const disabled = props.disabled || props.otherProps?.disabled || false;
	const [fileList, setFileList] = useState<any[]>();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const resize: TResizeProps | undefined = typeof props.resize === 'boolean' ? {} : props.resize;

	useEffect(() => {
		let files: any[] = [];
		// Single URL
		if (typeof value === 'string') {
			files = [{ url: value, remote: true, name: getNameFile(value) }];
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Array of URLs
		else if (Array.isArray(value)) {
			files = value.map((url) => ({ url, remote: true, name: getNameFile(url) }));
			setFileList(files);
			// Callback về Form để Form Item có fileList => Phục vụ check rules fileRequired
			if (onChange) onChange({ fileList: files });
		}
		// Object of antd file upload
		else {
			files = props.fileList || (value && value.fileList) || [];
			setFileList(files);
		}
	}, [value, props.fileList]);

	/** Resize Hình ảnh */
	const resizeImages = (files: TFile[]): TFile[] => {
		let res = files;
		try {
			res = files?.map((file) => {
				const type = file.type?.split('/'); // image/jpeg
				if (type?.[0] === 'image' && !file.resized) {
					file.resized = true;
					Resizer.imageFileResizer(
						file.originFileObj as any,
						resize?.maxWidth ?? 1024,
						resize?.maxHeight ?? 1024,
						resize?.compressFormat ?? type?.[1] ?? 'webp',
						resize?.quality ?? 90,
						resize?.rotation ?? 0,
						(blob: any) => {
							// temp = [{ url: URL.createObjectURL(blob), remote: true, name: getNameFile(URL.createObjectURL(blob)) }];
							// console.log('🚀 ~ useEffect ~ temp:', temp);
							file.originFileObj = blob;
						},
						resize?.outputType ?? 'file',
						resize?.minWidth,
						resize?.minHeight,
					);
				}
				return file;
			});
		} catch (err) {
			console.log(err);
		}
		return res;
	};

	const handleChange = (val: any) => {
		let files = val.fileList as TFile[];
		const findLargeFile = files?.some((file) => file.size && file.size / 1024 / 1024 > maxFileSize);
		if (findLargeFile) {
			message.error(`Dung lượng tập tin không được quá ${maxFileSize}Mb`);
			return;
		}

		const findWrongTypeFile = files?.some((file) => {
			const arrFileName = file.name.split('.');
			return file?.remote !== true && !otherProps?.accept?.includes(arrFileName?.[arrFileName.length - 1]);
		});
		if (findWrongTypeFile && otherProps?.accept) {
			message.error('Định dạng tập tin không cho phép');
			return;
		}

		if (files.length > limit) files.splice(0, files.length - limit);
		if (!!props.resize) files = resizeImages(files);
		setFileList(files);
		if (onChange) onChange({ fileList: files });
	};

	/** Xem trước ảnh */
	const handlePreviewImage = async (file: UpFile) => {
		if (!file.url && !file.preview) file.preview = await blobToBase64(file.originFileObj as RcFile);

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const Extra = () =>
		disabled ? null : (
			<small style={{ color: '#999' }}>
				<i>
					Tối đa {limit} mục, dung lượng mỗi file không được quá {maxFileSize}Mb
				</i>
			</small>
		);

	// DRAGGER
	if (drag)
		return (
			<Upload.Dragger
				disabled={disabled}
				customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={limit > 1}
				accept={accept}
				{...otherProps}
			>
				{!disabled ? (
					<>
						<p className='ant-upload-drag-icon'>
							<UploadOutlined />
						</p>
						<p className='ant-upload-text'>Nhấn chuột hoặc kéo thả tài liệu để tải lên</p>
						<p className='ant-upload-hint'>{buttonDescription}</p>
						<Extra />
					</>
				) : null}
			</Upload.Dragger>
		);
	else if (isAvatar || isAvatarSmall)
		return (
			<>
				<Upload
					disabled={disabled}
					customRequest={({ onSuccess }) => setTimeout(() => onSuccess && onSuccess('ok'), 0)}
					listType='picture-card'
					className={`avatar-uploader ${isAvatarSmall ? 'avatar-small' : undefined}`}
					fileList={fileList}
					onChange={handleChange}
					style={{ width: '100%' }}
					multiple={false}
					accept='image/*'
					onPreview={handlePreviewImage}
					{...otherProps}
				>
					{!disabled && !fileList?.length ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexDirection: 'column',
							}}
						>
							<PlusOutlined />
							<div className='ant-upload-text'>{buttonDescription || 'Thêm ảnh đại diện'}</div>
						</div>
					) : null}
				</Upload>
				<Extra />

				<Image
					style={{ display: 'none' }}
					preview={{
						visible: previewOpen,
						src: previewImage,
						onVisibleChange: (val) => setPreviewOpen(val),
					}}
				/>
			</>
		);

	// UPLOAD BUTTON
	return (
		<>
			<Upload
				disabled={disabled}
				customRequest={({ onSuccess }) => {
					setTimeout(() => onSuccess && onSuccess('ok'), 0);
				}}
				fileList={fileList}
				onChange={handleChange}
				style={{ width: '100%' }}
				multiple={limit > 1}
				accept={accept}
				{...otherProps}
			>
				{!disabled ? (
					<Button size={buttonSize || 'small'} icon={<UploadOutlined />}>
						{buttonDescription || 'Chọn tệp'}
					</Button>
				) : null}
			</Upload>
			<Extra />
		</>
	);
};

export default UploadFile;
