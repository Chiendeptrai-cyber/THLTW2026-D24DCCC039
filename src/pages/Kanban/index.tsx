import { useEffect, useMemo, useState } from 'react';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';
import styles from './index.less';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

type TaskStatus = 'todo' | 'doing' | 'done';

type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
  status: TaskStatus;
  createdAt: string;
};

const STORAGE_KEY = 'kanban-task-data-v1';

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Lập kế hoạch học tập',
    description: 'Xác định các môn cần hoàn thành và thời hạn cho từng phần.',
    deadline: moment().add(2, 'days').format('YYYY-MM-DD'),
    priority: 'High',
    tags: ['Học tập'],
    status: 'todo',
    createdAt: moment().format('YYYY-MM-DD'),
  },
  {
    id: 'task-2',
    title: 'Thiết kế giao diện Kanban',
    description: 'Tạo đề bài cho giao diện kéo thả task bằng react-beautiful-dnd.',
    deadline: moment().add(1, 'days').format('YYYY-MM-DD'),
    priority: 'Medium',
    tags: ['UI', 'Kanban'],
    status: 'doing',
    createdAt: moment().subtract(1, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 'task-3',
    title: 'Nộp báo cáo',
    description: 'Hoàn thành báo cáo cá nhân và gửi cho giảng viên.',
    deadline: moment().subtract(1, 'days').format('YYYY-MM-DD'),
    priority: 'Low',
    tags: ['Báo cáo'],
    status: 'done',
    createdAt: moment().subtract(3, 'days').format('YYYY-MM-DD'),
  },
];

const statusLabels: Record<TaskStatus, { title: string; color: string }> = {
  todo: { title: 'Cần làm', color: 'volcano' },
  doing: { title: 'Đang làm', color: 'cyan' },
  done: { title: 'Hoàn thành', color: 'green' },
};

const priorityLabels: Record<Task['priority'], { label: string; color: string }> = {
  High: { label: 'Cao', color: 'red' },
  Medium: { label: 'Trung bình', color: 'gold' },
  Low: { label: 'Thấp', color: 'blue' },
};

const getSavedTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultTasks;
    const saved = JSON.parse(raw) as Task[];
    if (!Array.isArray(saved)) return defaultTasks;
    return saved;
  } catch {
    return defaultTasks;
  }
};

const saveTasksToStorage = (tasks: Task[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const KanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'ascend' | 'descend' | null>('ascend');
  const [visible, setVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = getSavedTasks();
    setTasks(saved);
  }, []);

  const updateTasks = (nextTasks: Task[]) => {
    setTasks(nextTasks);
    saveTasksToStorage(nextTasks);
  };

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter((task) => task.status === 'todo'),
      doing: tasks.filter((task) => task.status === 'doing'),
      done: tasks.filter((task) => task.status === 'done'),
    };
  }, [tasks]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    const overdue = tasks.filter(
      (task) => task.status !== 'done' && moment(task.deadline).isBefore(moment(), 'day'),
    ).length;
    return { total, done, overdue };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const matchedSearch = task.title.toLowerCase().includes(searchText.toLowerCase());
      const matchedStatus = !statusFilter || task.status === statusFilter;
      return matchedSearch && matchedStatus;
    });

    if (!sortDirection) {
      return filtered;
    }

    return [...filtered].sort((a, b) => {
      const aTime = moment(a.deadline).valueOf();
      const bTime = moment(b.deadline).valueOf();
      return sortDirection === 'ascend' ? aTime - bTime : bTime - aTime;
    });
  }, [tasks, searchText, statusFilter, sortDirection]);

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({
        ...task,
        deadline: moment(task.deadline),
      });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleSaveTask = async () => {
    const values = await form.validateFields();
    const task: Task = {
      id: editingTask?.id || `task-${Date.now()}`,
      title: values.title.trim(),
      description: values.description?.trim() || '',
      deadline: values.deadline.format('YYYY-MM-DD'),
      priority: values.priority,
      tags: values.tags || [],
      status: values.status,
      createdAt: editingTask?.createdAt || moment().format('YYYY-MM-DD'),
    };

    const nextTasks = editingTask
      ? tasks.map((item) => (item.id === editingTask.id ? task : item))
      : [task, ...tasks];

    updateTasks(nextTasks);
    message.success(editingTask ? 'Cập nhật task thành công' : 'Thêm task thành công');
    closeModal();
  };

  const handleDeleteTask = (taskId: string) => {
    const nextTasks = tasks.filter((task) => task.id !== taskId);
    updateTasks(nextTasks);
    message.success('Xóa task thành công');
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;
    if (sourceStatus === destStatus && source.index === destination.index) return;

    const sourceList = Array.from(groupedTasks[sourceStatus]);
    const destList = Array.from(groupedTasks[destStatus]);
    const [moved] = sourceList.splice(source.index, 1);
    moved.status = destStatus;
    destList.splice(destination.index, 0, moved);

    const nextTasks = tasks
      .filter((item) => item.status !== sourceStatus && item.status !== destStatus)
      .concat(sourceList)
      .concat(destList);

    updateTasks(nextTasks);
  };

  const columns = [
    {
      title: 'Tên task',
      dataIndex: 'title',
      key: 'title',
      render: (value: string, record: Task) => (
        <div>
          <Text strong>{value}</Text>
          <div>
            <Tag color={priorityLabels[record.priority].color}>
              {priorityLabels[record.priority].label}
            </Tag>
            {record.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
      ),
      sorter: (a: Task, b: Task) => a.title.localeCompare(b.title),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (value: string) => moment(value).format('DD/MM/YYYY'),
      sorter: (a: Task, b: Task) => moment(a.deadline).valueOf() - moment(b.deadline).valueOf(),
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value: TaskStatus) => (
        <Tag color={statusLabels[value].color}>{statusLabels[value].title}</Tag>
      ),
      filters: [
        { text: 'Cần làm', value: 'todo' },
        { text: 'Đang làm', value: 'doing' },
        { text: 'Hoàn thành', value: 'done' },
      ],
      onFilter: (value: string, record: Task) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Task) => (
        <Space size="small">
          <Button type="link" onClick={() => openModal(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDeleteTask(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.kanbanPage}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Title level={3}>Quản lý công việc cá nhân</Title>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Tổng task" value={stats.total} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Đã hoàn thành" value={stats.done} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Quá hạn" value={stats.overdue} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Kanban Board" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            Thêm task
          </Button>}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={styles.board}>
                {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
                  <div className={styles.column} key={status}>
                    <div className={styles.columnHeader}>
                      <Title level={5}>{statusLabels[status].title}</Title>
                      <Text type="secondary">{groupedTasks[status].length} task</Text>
                    </div>
                    <Droppable droppableId={status}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={styles.droppableArea}>
                          {groupedTasks[status].map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(draggableProvided, snapshot) => (
                                <div
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  className={styles.taskCard}
                                  style={{
                                    ...draggableProvided.draggableProps.style,
                                    boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : undefined,
                                  }}
                                >
                                  <div className={styles.taskCardHeader}>
                                    <Text strong>{task.title}</Text>
                                    <Tag color={priorityLabels[task.priority].color}>
                                      {priorityLabels[task.priority].label}
                                    </Tag>
                                  </div>
                                  <Text type="secondary">{task.description || 'Không có mô tả'}</Text>
                                  <div className={styles.taskCardMeta}>
                                    <Tag color="blue">{moment(task.deadline).format('DD/MM/YYYY')}</Tag>
                                    {task.tags.map((tag) => (
                                      <Tag key={tag}>{tag}</Tag>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </Card>
        </Col>

        <Col span={24}>
          <Card title="Danh sách task">
            <Space wrap style={{ marginBottom: 16 }}>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm theo tên task"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{ width: 260 }}
              />
              <Select
                placeholder="Lọc trạng thái"
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                allowClear
                style={{ width: 180 }}
              >
                <Option value="todo">Cần làm</Option>
                <Option value="doing">Đang làm</Option>
                <Option value="done">Hoàn thành</Option>
              </Select>
              <Select
                placeholder="Sắp xếp deadline"
                value={sortDirection}
                onChange={(value) => setSortDirection(value)}
                style={{ width: 180 }}
              >
                <Option value="ascend">Tăng dần</Option>
                <Option value="descend">Giảm dần</Option>
              </Select>
            </Space>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={filteredTasks}
              pagination={{ pageSize: 8 }}
              rowClassName={(record) =>
                moment(record.deadline).isBefore(moment(), 'day') && record.status !== 'done'
                  ? styles.overdueRow
                  : ''
              }
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingTask ? 'Chỉnh sửa task' : 'Thêm task mới'}
        visible={visible}
        onCancel={closeModal}
        onOk={handleSaveTask}
        okText="Lưu"
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="title"
            label="Tên task"
            rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}
          >
            <Input placeholder="Nhập tên task" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả ngắn gọn về task" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="deadline"
                label="Deadline"
                rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Mức độ ưu tiên"
                rules={[{ required: true, message: 'Vui lòng chọn mức độ ưu tiên' }]}
                initialValue="Medium"
              >
                <Select>
                  <Option value="High">Cao</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="Low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="Tag">
            <Select mode="tags" placeholder="Nhập tag và nhấn Enter" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            initialValue="todo"
          >
            <Select>
              <Option value="todo">Cần làm</Option>
              <Option value="doing">Đang làm</Option>
              <Option value="done">Hoàn thành</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanPage;
