import { Editor, type EditorProps } from '@monaco-editor/react';
import './style.less';

type Props = Omit<EditorProps, 'defaultLanguage' | 'language'>;

const JsonEditor = ({ height = 230, ...props }: Props) => {
	return (
		<div className='monaco-wrapper'>
			<Editor {...props} language='json' height={height} />
		</div>
	);
};

export default JsonEditor;
