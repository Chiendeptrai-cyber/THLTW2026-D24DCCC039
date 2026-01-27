import { Button, Col, Modal, Row } from 'antd';
import { useModel } from 'umi';
import TodoItem from './TodoItem';
import FormTodoList from './Form';
import { useEffect } from 'react';

const TodoList: React.FC = () => {
	const { data, setIsEdit, setTodoItem, setVisible, visible, getDataTodo } = useModel('todolist');
	useEffect(() => {
		getDataTodo();
	}, []);

	return (
		<div>
			<div style={{ textAlign: 'center' }}>
				<h1>Todo List</h1>
				<Button
					onClick={() => {
						setIsEdit(false);
						setTodoItem(undefined);
						setVisible(true);
					}}
					type='primary'
				>
					Create Task
				</Button>
			</div>
			<Row gutter={[10, 10]} style={{ marginTop: 20 }}>
				{data?.map((item, index) => {
					return (
						<Col md={8} xxl={6} key={index}>
							<TodoItem record={item} index={index} />
						</Col>
					);
				})}
			</Row>
			<Modal destroyOnClose visible={visible} footer={null} onCancel={() => setVisible(false)}>
				<FormTodoList />
			</Modal>
		</div>
	);
};
export default TodoList;
