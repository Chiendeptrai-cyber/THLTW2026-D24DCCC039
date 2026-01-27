import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const TodoItem = (props: { record: TodoList.TodoItem; index: number }) => {
	const { getDataTodo, setVisible, setTodoItem, setIsEdit } = useModel('todolist');
	const { record, index } = props;

	const color = record.color;

	return (
		<>
			<div style={{ height: 3, width: 220, backgroundColor: color }} />
			<div
				style={{
					position: 'relative',
					padding: 16,
					borderRadius: '0px 0px 10px 10px',
					width: 220,
					height: 150,
					backgroundColor: '#fff',
				}}
			>
				<div
					style={{
						width: 60,
						height: 20,
						backgroundColor: color,
						fontSize: 14,
						textAlign: 'center',
						borderRadius: 3,
						color: '#fff',
					}}
				>
					{record.category}
				</div>
				<div style={{ marginTop: 10, fontSize: 16 }}>{record.content}</div>
				<div style={{ position: 'absolute', bottom: 10, right: 10 }}>
					<FormOutlined
						onClick={() => {
							setVisible(true);
							setTodoItem(record);
							setIsEdit(true);
						}}
						style={{ color: color }}
					/>
					<DeleteOutlined
						onClick={() => {
							const dataLocal: any = JSON.parse(localStorage.getItem('todolist') as any);
							const newData = dataLocal.filter((item: any) => item.content !== record.content);
							localStorage.setItem('todolist', JSON.stringify(newData));
							getDataTodo();
						}}
						style={{ color: color, marginLeft: 8 }}
					/>
				</div>
			</div>
		</>
	);
};

export default TodoItem;
