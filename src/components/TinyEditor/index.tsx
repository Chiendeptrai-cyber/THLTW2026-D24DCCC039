import { EFileScope, uploadFile } from '@/services/uploadFile';
import { Editor } from '@tinymce/tinymce-react';
import './style.less';

const TinyEditor = (props: {
	value?: string;
	onChange?: (val: string) => void;
	/** Độ cao của editor sẽ tự động update theo nội dung đến 1 giá trị nhất định */
	height?: number;
	/** Chiều cao tối thiểu của editor */
	minHeight?: number;
	/** Ẩn hàng chức năng (File, View...) */
	hideMenubar?: boolean;
	/** DS chức năng rút gọn  */
	miniToolbar?: boolean;
	/** DS chức năng rút gọn tối đa (chỉ còn undo, redo, bold, italic...) */
	tinyToolbar?: boolean;
	disabled?: boolean;
	/** Cố định toolbar nếu nội dung soạn thảo quá dài, phải dùng thanh cuộn.
	 * Khi dùng nhiều editor trên 1 màn bắt buộc phải tắt option này đi */
	stickyToolbar?: boolean;
}) => {
	const {
		value,
		onChange,
		height = 500,
		hideMenubar,
		miniToolbar,
		disabled,
		minHeight = 50,
		tinyToolbar,
		stickyToolbar = true,
	} = props;

	const triggerChange = (changedValue: string) => {
		if (onChange) {
			onChange(changedValue);
		}
	};

	const imageHandler = (callback: any) => {
		const input = document.createElement('input');
		// Tạo input file và click luôn
		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();
		// eslint-disable-next-line func-names
		input.onchange = async function () {
			const file = input.files?.[0] ?? '';

			// Up ảnh lên và lấy url
			const response = await uploadFile({
				file,
				scope: EFileScope.PUBLIC,
			});
			// Chèn ảnh vào dưới dạng url
			callback(response?.data?.data?.url ?? '', {
				alt: 'image',
				uid: response?.data?.data,
				name: response?.data?.data?.file?.name,
				status: 'done',
				// response?.data?.data,
			});
		};
	};

	return (
		<>
			<Editor
				// apiKey='ihu6rlypska4k9h96g5x752rocpj133f20q41afy85shcrc5'
				tinymceScriptSrc='/tinymce/tinymce.min.js'
				// apiKey='vrh3rpim05kai51zg4tcenfbzwhl243use11yolfq6d9ufvw'
				value={value}
				disabled={disabled}
				init={{
					license_key: 'gpl',
					language_url: '/lang/vi_VN.js',
					language: 'vi_VN',
					max_height: height,
					autoresize_bottom_margin: minHeight,
					menubar: hideMenubar || disabled ? false : 'file edit view format table insert tools',
					plugins: [
						// 'advlist',
						'autolink',
						'lists',
						'link',
						'image',
						'charmap',
						// 'anchor',
						'searchreplace',
						'visualblocks',
						'code',
						// 'fullscreen',
						// 'insertdatetime',
						'media',
						'table',
						// 'preview',
						// 'help',
						'wordcount',
						// 'print',
						// 'paste',
						// 'importcss',
						// 'autosave',
						// 'save',
						'directionality',
						// 'visualchars',
						// 'template',
						// 'codesample',
						// 'hr',
						// 'pagebreak',
						'nonbreaking',
						// 'toc',
						// 'imagetools',
						// 'textpattern',
						// 'noneditable',
						'quickbars',
						'emoticons',
						// "editimage",
						'autoresize',
					],
					toolbar: disabled
						? ''
						: tinyToolbar
						? 'undo redo | bold italic | forecolor backcolor | emoticons'
						: miniToolbar
						? 'undo redo | fontfamily fontsize | bold italic underline | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | numlist bullist | emoticons'
						: // Full toolbar
						  'undo redo | styles fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor removeformat | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | table image media link | charmap emoticons | fullscreen preview print',
					toolbar_sticky: stickyToolbar,
					autosave_ask_before_unload: true,
					image_advtab: true,
					image_caption: true,
					quickbars_selection_toolbar: tinyToolbar
						? ''
						: 'bold italic | forecolor backcolor | quicklink h2 h3 blockquote',
					quickbars_insert_toolbar: false,
					noneditable_noneditable_class: 'mceNonEditable',
					toolbar_mode: 'sliding',
					contextmenu: tinyToolbar ? '' : 'link image imagetools table',
					file_picker_callback: imageHandler,
					paste_data_images: !tinyToolbar,
					smart_paste: true,
					content_style: `
            body {
              background: #fff;
							line-height: 1.5715;
							color: rgba(0, 0, 0, .85);
							font-size: 14px;
							padding: 0;
							margin: 8px
            }
          `,
					default_font_stack: [
						'-apple-system',
						'BlinkMacSystemFont',
						'Segoe UI',
						'Roboto',
						'Helvetica Neue',
						'Arial',
						'Noto Sans',
						'sans-serif',
						'Apple Color Emoji',
						'Segoe UI Emoji',
						'Segoe UI Symbol',
						'Noto Color Emoji',
					],
					font_family_formats: `Mặc định=-apple-system,segoe ui,roboto,arial; 
						Arial=arial,helvetica,sans-serif; 
						Arial Black=arial black,avant garde; 
						Times New Roman=times new roman,times; 
						Comic Sans MS=comic sans ms,sans-serif; 
						Noto Sans=noto sans; 
						Monospace=monospace;
						Courier New=courier new,courier; 
						Helvetica=helvetica; 
						Tahoma=tahoma,arial,helvetica,sans-serif; 
						Verdana=verdana,geneva;`,
					font_size_formats: '8px 10px 12px 14px 18px 24px',
				}}
				onEditorChange={triggerChange}
			/>
			<input id='my-file' type='file' name='my-file' style={{ display: 'none' }} />
		</>
	);
};

export default TinyEditor;
