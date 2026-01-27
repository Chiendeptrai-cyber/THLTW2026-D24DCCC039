import { Button, Form, Input, Select } from 'antd';
import { useModel } from 'umi';

const FormTodoList = () => {
	const { data, todoItem, isEdit, setVisible, getDataTodo } = useModel('todolist');
	const colors = ['#7498d8', '#f1d9a4', '#67c759', '#f29092'];

	const getRandomInt = (min: number, max: number) => {
		const minTemp = Math.ceil(min);
		const maxTemp = Math.floor(max);
		return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + min;
	};

	return (
		<Form
			labelCol={{ span: 24 }}
			onFinish={(values) => {
				const payload = {
					...values,
					color: colors[getRandomInt(0, 3)],
				};
				const index = data.findIndex((item: any) => item.content === todoItem?.content);
				const dataTemp: TodoList.TodoItem[] = [...data];
				dataTemp.splice(index, 1, payload);
				const dataLocal = isEdit ? dataTemp : [payload, ...data];
				localStorage.setItem('todolist', JSON.stringify(dataLocal));
				setVisible(false);
				getDataTodo();
			}}
		>
			<Form.Item
				initialValue={todoItem?.content}
				label='Content'
				name='content'
				rules={[{ required: true, message: 'Please input your content!' }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				initialValue={todoItem?.category}
				label='Category'
				name='category'
				rules={[{ required: true, message: 'Please input your category!' }]}
			>
				<Select
					options={[
						{ value: 'Python', label: 'Python' },
						{ value: 'React', label: 'React' },
						{
							value: 'JS',
							label: 'JS',
						},
					]}
				/>
			</Form.Item>
			<div className='form-footer'>
				<Button htmlType='submit' type='primary'>
					{isEdit ? 'Chỉnh sửa' : 'Thêm mới'}
				</Button>
				<Button onClick={() => setVisible(false)}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormTodoList;
