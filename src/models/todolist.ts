import { useState } from 'react';

export default () => {
	const [data, setData] = useState<TodoList.TodoItem[]>([]);
	const [todoItem, setTodoItem] = useState<TodoList.TodoItem>();
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [visible, setVisible] = useState<boolean>(false);
	const getDataTodo = async () => {
		const dataLocal: any = JSON.parse(localStorage.getItem('todolist') as any) || [];
		setData(dataLocal);
	};

	return {
		data,
		setData,
		getDataTodo,
		todoItem,
		setTodoItem,
		isEdit,
		setIsEdit,
		visible,
		setVisible,
	};
};
