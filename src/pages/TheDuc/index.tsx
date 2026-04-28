import { useMemo, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Timeline,
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  Drawer,
  Typography,
  Popconfirm,
  message,
  Segmented,
  Tabs,
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ColumnChart from '@/components/Chart/ColumnChart';
import LineChart from '@/components/Chart/LineChart';
import moment from 'moment';
import './style.less';

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const workoutTypes = ['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'];
const goalStatuses = ['All', 'In progress', 'Achieved', 'Cancelled'];
const muscleGroups = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const initialWorkouts = [
  {
    id: 'w1',
    date: '2026-04-27',
    type: 'Cardio',
    duration: 45,
    calories: 380,
    note: 'Chạy bộ ngoài trời',
    status: 'Completed',
  },
  {
    id: 'w2',
    date: '2026-04-26',
    type: 'Strength',
    duration: 60,
    calories: 520,
    note: 'Tập ngực và tay sau',
    status: 'Completed',
  },
  {
    id: 'w3',
    date: '2026-04-24',
    type: 'Yoga',
    duration: 30,
    calories: 160,
    note: 'Tập giãn cơ',
    status: 'Missed',
  },
  {
    id: 'w4',
    date: '2026-04-22',
    type: 'HIIT',
    duration: 35,
    calories: 420,
    note: 'Circuit bodyweight',
    status: 'Completed',
  },
  {
    id: 'w5',
    date: '2026-04-20',
    type: 'Other',
    duration: 25,
    calories: 180,
    note: 'Đi bộ thư giãn',
    status: 'Completed',
  },
];

const initialHealthLogs = [
  {
    id: 'h1',
    date: '2026-04-27',
    weight: 72,
    height: 175,
    restingHeartRate: 64,
    sleepHours: 7.5,
  },
  {
    id: 'h2',
    date: '2026-04-20',
    weight: 73.2,
    height: 175,
    restingHeartRate: 66,
    sleepHours: 7,
  },
  {
    id: 'h3',
    date: '2026-04-15',
    weight: 74.1,
    height: 175,
    restingHeartRate: 68,
    sleepHours: 6.8,
  },
  {
    id: 'h4',
    date: '2026-04-10',
    weight: 75.0,
    height: 175,
    restingHeartRate: 70,
    sleepHours: 6.5,
  },
];

const initialGoals = [
  {
    id: 'g1',
    name: 'Giảm 3kg trong tháng',
    category: 'Giảm cân',
    targetValue: 3,
    currentValue: 1.4,
    deadline: '2026-05-15',
    status: 'In progress',
  },
  {
    id: 'g2',
    name: 'Tăng cơ tay',
    category: 'Tăng cơ',
    targetValue: 8,
    currentValue: 5,
    deadline: '2026-06-01',
    status: 'In progress',
  },
  {
    id: 'g3',
    name: 'Cải thiện sức bền',
    category: 'Cải thiện sức bền',
    targetValue: 30,
    currentValue: 30,
    deadline: '2026-04-30',
    status: 'Achieved',
  },
  {
    id: 'g4',
    name: 'Tập thiền 15 phút mỗi ngày',
    category: 'Khác',
    targetValue: 30,
    currentValue: 12,
    deadline: '2026-05-31',
    status: 'Cancelled',
  },
];

const initialExercises = [
  {
    id: 'e1',
    name: 'Push-up',
    muscleGroup: 'Chest',
    difficulty: 'Medium',
    description: 'Bài tập chống đẩy giúp tăng sức mạnh ngực và tay sau.',
    caloriesPerHour: 420,
  },
  {
    id: 'e2',
    name: 'Squat',
    muscleGroup: 'Legs',
    difficulty: 'Medium',
    description: 'Squat là bài tập cơ bản cho đùi, mông và lõi.',
    caloriesPerHour: 500,
  },
  {
    id: 'e3',
    name: 'Plank',
    muscleGroup: 'Core',
    difficulty: 'Easy',
    description: 'Tăng cường cơ lõi và cải thiện tư thế.',
    caloriesPerHour: 250,
  },
  {
    id: 'e4',
    name: 'Burpee',
    muscleGroup: 'Full Body',
    difficulty: 'Hard',
    description: 'Bài tập toàn thân kết hợp cardio và sức mạnh.',
    caloriesPerHour: 700,
  },
  {
    id: 'e5',
    name: 'Dumbbell Row',
    muscleGroup: 'Back',
    difficulty: 'Medium',
    description: 'Tập lưng và bắp tay với tạ đơn.',
    caloriesPerHour: 460,
  },
  {
    id: 'e6',
    name: 'Shoulder Press',
    muscleGroup: 'Shoulders',
    difficulty: 'Hard',
    description: 'Tăng sức mạnh vai và cải thiện ổn định phần thân trên.',
    caloriesPerHour: 520,
  },
];

const getBmi = (weight: number, height: number) => {
  if (!weight || !height) return 0;
  return Number((weight / ((height / 100) * (height / 100))).toFixed(1));
};

const getBmiTag = (bmi: number) => {
  if (bmi < 18.5) {
    return { text: 'Thiếu cân', color: 'blue' };
  }
  if (bmi < 25) {
    return { text: 'Bình thường', color: 'green' };
  }
  if (bmi < 30) {
    return { text: 'Thừa cân', color: 'gold' };
  }
  return { text: 'Béo phì', color: 'red' };
};

const getStatusTagColor = (status: string) => {
  if (status === 'Completed') return 'green';
  if (status === 'Missed') return 'volcano';
  if (status === 'Achieved') return 'green';
  if (status === 'Cancelled') return 'red';
  return 'blue';
};

const TheDuc = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'health' | 'goals' | 'library'>('dashboard');
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [healthLogs, setHealthLogs] = useState(initialHealthLogs);
  const [goals, setGoals] = useState(initialGoals);
  const [exercises, setExercises] = useState(initialExercises);

  const [workoutSearch, setWorkoutSearch] = useState('');
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState('All');
  const [workoutRange, setWorkoutRange] = useState<any>(null);

  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [workoutEditing, setWorkoutEditing] = useState<any>(null);
  const [workoutForm] = Form.useForm();

  const [healthModalVisible, setHealthModalVisible] = useState(false);
  const [healthEditing, setHealthEditing] = useState<any>(null);
  const [healthForm] = Form.useForm();

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [exerciseEditing, setExerciseEditing] = useState<any>(null);
  const [exerciseForm] = Form.useForm();
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseGroupFilter, setExerciseGroupFilter] = useState('All');
  const [exerciseDifficultyFilter, setExerciseDifficultyFilter] = useState('All');
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [goalDrawerVisible, setGoalDrawerVisible] = useState(false);
  const [goalForm] = Form.useForm();
  const [goalStatusFilter, setGoalStatusFilter] = useState('All');

  const sortedWorkouts = useMemo(
    () => [...workouts].sort((a, b) => moment(b.date).diff(moment(a.date))),
    [workouts],
  );

  const filteredWorkouts = useMemo(() => {
    return sortedWorkouts.filter((item) => {
      const matchesSearch = item.type.toLowerCase().includes(workoutSearch.toLowerCase());
      const matchesType = workoutTypeFilter === 'All' || item.type === workoutTypeFilter;
      const matchesRange =
        !workoutRange ||
        (moment(item.date).isSameOrAfter(workoutRange[0], 'day') &&
          moment(item.date).isSameOrBefore(workoutRange[1], 'day'));
      return matchesSearch && matchesType && matchesRange;
    });
  }, [sortedWorkouts, workoutSearch, workoutTypeFilter, workoutRange]);

  const sortedHealthLogs = useMemo(
    () => [...healthLogs].sort((a, b) => moment(a.date).diff(moment(b.date))),
    [healthLogs],
  );

  const filteredExercises = useMemo(() => {
    return exercises.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(exerciseSearch.toLowerCase());
      const matchesGroup = exerciseGroupFilter === 'All' || item.muscleGroup === exerciseGroupFilter;
      const matchesDifficulty = exerciseDifficultyFilter === 'All' || item.difficulty === exerciseDifficultyFilter;
      return matchesSearch && matchesGroup && matchesDifficulty;
    });
  }, [exercises, exerciseSearch, exerciseGroupFilter, exerciseDifficultyFilter]);

  const dashboardTotalSessions = workouts.length;
  const dashboardTotalCalories = workouts.reduce((sum, item) => sum + item.calories, 0);
  const dashboardStreak = useMemo(() => {
    const completedDays = [...workouts]
      .filter((item) => item.status === 'Completed')
      .sort((a, b) => moment(b.date).diff(moment(a.date)));
    if (!completedDays.length) return 0;
    let streak = 0;
    let previous = moment(completedDays[0].date);
    if (!previous.isSame(moment(), 'day') && !previous.isSame(moment().subtract(1, 'day'), 'day')) {
      // start streak from most recent completed workout only if it's today or yesterday
      streak = 1;
    } else {
      streak = 1;
    }
    for (let i = 1; i < completedDays.length; i += 1) {
      const current = moment(completedDays[i].date);
      if (previous.diff(current, 'days') === 1) {
        streak += 1;
        previous = current;
      } else {
        break;
      }
    }
    return streak;
  }, [workouts]);
  const dashboardCompletion = workouts.length ? Math.round((workouts.filter((item) => item.status === 'Completed').length / workouts.length) * 100) : 0;

  const weeklySessionData = useMemo(() => {
    const counts = [0, 0, 0, 0];
    workouts.forEach((workout) => {
      const day = moment(workout.date);
      const week = Math.min(4, Math.ceil(day.date() / 7));
      counts[week - 1] += 1;
    });
    return counts;
  }, [workouts]);

  const weightHistoryData = useMemo(() => {
    const labels = sortedHealthLogs.map((item) => moment(item.date).format('DD/MM'));
    const values = sortedHealthLogs.map((item) => item.weight);
    return { labels, values };
  }, [sortedHealthLogs]);

  const recentWorkouts = useMemo(() => {
    return sortedWorkouts.slice(0, 5);
  }, [sortedWorkouts]);

  const submitWorkout = (values: any) => {
    const payload = {
      ...values,
      id: workoutEditing?.id || `w${Date.now()}`,
      date: values.date.format('YYYY-MM-DD'),
      duration: Number(values.duration),
      calories: Number(values.calories),
      status: values.status,
    };
    if (workoutEditing) {
      setWorkouts((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      message.success('Đã cập nhật buổi tập');
    } else {
      setWorkouts((prev) => [payload, ...prev]);
      message.success('Đã thêm buổi tập mới');
    }
    setWorkoutModalVisible(false);
    setWorkoutEditing(null);
    workoutForm.resetFields();
  };

  const submitHealthLog = (values: any) => {
    const payload = {
      ...values,
      id: healthEditing?.id || `h${Date.now()}`,
      date: values.date.format('YYYY-MM-DD'),
      weight: Number(values.weight),
      height: Number(values.height),
      restingHeartRate: Number(values.restingHeartRate),
      sleepHours: Number(values.sleepHours),
    };
    if (healthEditing) {
      setHealthLogs((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      message.success('Đã cập nhật chỉ số sức khỏe');
    } else {
      setHealthLogs((prev) => [payload, ...prev]);
      message.success('Đã thêm chỉ số sức khỏe');
    }
    setHealthModalVisible(false);
    setHealthEditing(null);
    healthForm.resetFields();
  };

  const submitExercise = (values: any) => {
    const payload = {
      ...values,
      id: exerciseEditing?.id || `e${Date.now()}`,
      caloriesPerHour: Number(values.caloriesPerHour),
    };
    if (exerciseEditing) {
      setExercises((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      message.success('Đã cập nhật bài tập');
    } else {
      setExercises((prev) => [payload, ...prev]);
      message.success('Đã thêm bài tập mới');
    }
    setExerciseModalVisible(false);
    setExerciseEditing(null);
    exerciseForm.resetFields();
  };

  const submitGoal = (values: any) => {
    const payload = {
      id: `g${Date.now()}`,
      ...values,
      targetValue: Number(values.targetValue),
      currentValue: Number(values.currentValue),
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: values.status,
    };
    setGoals((prev) => [payload, ...prev]);
    message.success('Đã thêm mục tiêu mới');
    setGoalDrawerVisible(false);
    goalForm.resetFields();
  };

  const goalCards = useMemo(() => {
    return goals.filter((goal) => goalStatusFilter === 'All' || goal.status === goalStatusFilter);
  }, [goals, goalStatusFilter]);

  const columnsWorkouts = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
      width: 140,
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'duration',
      key: 'duration',
      width: 140,
    },
    {
      title: 'Calo đốt',
      dataIndex: 'calories',
      key: 'calories',
      width: 120,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => <Tag color={status === 'Completed' ? 'green' : 'volcano'}>{status}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 220,
      render: (record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setWorkoutEditing(record);
              setWorkoutModalVisible(true);
              workoutForm.setFieldsValue({
                ...record,
                date: moment(record.date),
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa buổi tập này?"
            onConfirm={() => {
              setWorkouts((prev) => prev.filter((item) => item.id !== record.id));
              message.success('Đã xóa buổi tập');
            }}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsHealth = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Cân nặng (kg)',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
    },
    {
      title: 'Chiều cao (cm)',
      dataIndex: 'height',
      key: 'height',
      width: 120,
    },
    {
      title: 'BMI',
      key: 'bmi',
      width: 120,
      render: (record: any) => {
        const bmi = getBmi(record.weight, record.height);
        return (
          <Space direction="vertical">
            <Text strong>{bmi}</Text>
            <Tag color={getBmiTag(bmi).color}>{getBmiTag(bmi).text}</Tag>
          </Space>
        );
      },
    },
    {
      title: 'Nhịp tim lúc nghỉ (bpm)',
      dataIndex: 'restingHeartRate',
      key: 'restingHeartRate',
      width: 180,
    },
    {
      title: 'Giờ ngủ',
      dataIndex: 'sleepHours',
      key: 'sleepHours',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      render: (record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setHealthEditing(record);
              setHealthModalVisible(true);
              healthForm.setFieldsValue({
                ...record,
                date: moment(record.date),
              });
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa chỉ số sức khỏe này?"
            onConfirm={() => {
              setHealthLogs((prev) => prev.filter((item) => item.id !== record.id));
              message.success('Đã xóa chỉ số sức khỏe');
            }}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columnsLibrary = [
    {
      title: 'Tên bài tập',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: 'Nhóm cơ',
      dataIndex: 'muscleGroup',
      key: 'muscleGroup',
      width: 140,
    },
    {
      title: 'Mức độ',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 120,
      render: (value: string) => {
        const color = value === 'Easy' ? 'green' : value === 'Medium' ? 'gold' : 'red';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    {
      title: 'Calo/giờ',
      dataIndex: 'caloriesPerHour',
      key: 'caloriesPerHour',
      width: 120,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 220,
      render: (record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setCurrentExercise(record);
              setDetailModalVisible(true);
            }}
          >
            Xem
          </Button>
          <Button
            type="link"
            onClick={() => {
              setExerciseEditing(record);
              setExerciseModalVisible(true);
              exerciseForm.setFieldsValue(record);
            }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa bài tập này?"
            onConfirm={() => {
              setExercises((prev) => prev.filter((item) => item.id !== record.id));
              message.success('Đã xóa bài tập');
            }}
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="fitness-page">
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as any)}
          items={[
            { key: 'dashboard', label: 'Dashboard', children: null },
            { key: 'workout', label: 'Nhật ký tập luyện', children: null },
            { key: 'health', label: 'Nhật ký chỉ số', children: null },
            { key: 'goals', label: 'Quản lý mục tiêu', children: null },
            { key: 'library', label: 'Thư viện bài tập', children: null },
          ]}
        />
      </Card>

      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <Row gutter={[16, 16]} className="dashboard-cards">
            <Col xs={24} sm={12} xl={6}>
              <Card>
                <Statistic title="Buổi tập trong tháng" value={dashboardTotalSessions} />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card>
                <Statistic title="Tổng calo đã đốt" value={dashboardTotalCalories} suffix="kcal" />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card>
                <Statistic title="Ngày tập liên tiếp" value={dashboardStreak} />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card>
                <Statistic title="Mục tiêu hoàn thành" value={`${dashboardCompletion}%`} />
                <Progress percent={dashboardCompletion} status="active" />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="dashboard-charts">
            <Col xs={24} lg={14}>
              <Card title="Buổi tập theo tuần">
                <ColumnChart
                  title="Buổi tập mỗi tuần"
                  xAxis={['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']}
                  yAxis={[weeklySessionData]}
                  yLabel={['Số buổi']}
                  colors={['#1890ff']}
                  height={320}
                />
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card title="Cân nặng theo thời gian">
                <LineChart
                  title="Cân nặng"
                  xAxis={weightHistoryData.labels}
                  yAxis={[weightHistoryData.values]}
                  yLabel={['Cân nặng (kg)']}
                  colors={['#52c41a']}
                  height={320}
                />
              </Card>
            </Col>
          </Row>

          <Card title="5 buổi tập gần nhất" className="timeline-card">
            <Timeline mode="left">
              {recentWorkouts.map((item) => (
                <Timeline.Item key={item.id} color={item.status === 'Completed' ? 'green' : 'red'}>
                  <div>
                    <Text strong>{moment(item.date).format('DD/MM/YYYY')}</Text>
                  </div>
                  <div>{item.type} • {item.duration} phút • {item.calories} kcal</div>
                  <div>{item.note}</div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </div>
      )}

      {activeTab === 'workout' && (
        <div className="section-content">
          <div className="section-toolbar">
            <Space wrap>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm theo loại bài tập"
                value={workoutSearch}
                onChange={(e) => setWorkoutSearch(e.target.value)}
                style={{ minWidth: 220 }}
              />
              <Select
                value={workoutTypeFilter}
                onChange={(value) => setWorkoutTypeFilter(value)}
                style={{ width: 180 }}
                options={[{ label: 'Tất cả', value: 'All' }, ...workoutTypes.map((type) => ({ label: type, value: type }))]}
              />
              <RangePicker onChange={(dates) => setWorkoutRange(dates)} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setWorkoutEditing(null);
                workoutForm.resetFields();
                setWorkoutModalVisible(true);
              }}>
                Thêm buổi tập
              </Button>
            </Space>
          </div>
          <Table
            rowKey="id"
            dataSource={filteredWorkouts}
            columns={columnsWorkouts}
            pagination={{ pageSize: 6 }}
          />
        </div>
      )}

      {activeTab === 'health' && (
        <div className="section-content">
          <div className="section-toolbar">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setHealthEditing(null);
              healthForm.resetFields();
              setHealthModalVisible(true);
            }}>
              Thêm chỉ số sức khỏe
            </Button>
          </div>
          <Table rowKey="id" dataSource={sortedHealthLogs} columns={columnsHealth} pagination={{ pageSize: 8 }} />
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="section-content">
          <div className="section-toolbar">
            <Space align="center" wrap>
              <Segmented options={goalStatuses} value={goalStatusFilter} onChange={(value) => setGoalStatusFilter(value as string)} />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setGoalDrawerVisible(true)}>
                Thêm mục tiêu
              </Button>
            </Space>
          </div>
          <Row gutter={[16, 16]}>
            {goalCards.map((goal) => {
              const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
              return (
                <Col xs={24} sm={12} xl={8} key={goal.id}>
                  <Card className="goal-card" title={goal.name} extra={
                    <Popconfirm
                      title="Xác nhận xóa mục tiêu này?"
                      onConfirm={() => setGoals((prev) => prev.filter((item) => item.id !== goal.id))}
                    >
                      <Button type="link" danger>
                        Xóa
                      </Button>
                    </Popconfirm>
                  }>
                    <Paragraph>
                      <Text strong>Loại:</Text> {goal.category}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Giá trị mục tiêu:</Text> {goal.targetValue}
                    </Paragraph>
                    <Paragraph className="goal-inline-update">
                      <Text strong>Giá trị hiện tại:</Text>{' '}
                      <InputNumber
                        min={0}
                        value={goal.currentValue}
                        onChange={(value) => {
                          setGoals((prev) => prev.map((item) => item.id === goal.id ? { ...item, currentValue: Number(value) } : item));
                        }}
                      />
                    </Paragraph>
                    <Progress percent={progress} status={goal.status === 'Cancelled' ? 'exception' : 'active'} />
                    <Paragraph>
                      <Text strong>Deadline:</Text> {moment(goal.deadline).format('DD/MM/YYYY')}
                    </Paragraph>
                    <Tag color={getStatusTagColor(goal.status)}>{goal.status}</Tag>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="section-content">
          <div className="section-toolbar">
            <Space wrap>
              <Input
                prefix={<SearchOutlined />}
                placeholder="Tìm kiếm bài tập"
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                style={{ minWidth: 240 }}
              />
              <Select
                value={exerciseGroupFilter}
                onChange={(value) => setExerciseGroupFilter(value)}
                style={{ width: 180 }}
                options={[{ label: 'Tất cả nhóm cơ', value: 'All' }, ...muscleGroups.map((group) => ({ label: group, value: group }))]}
              />
              <Select
                value={exerciseDifficultyFilter}
                onChange={(value) => setExerciseDifficultyFilter(value)}
                style={{ width: 160 }}
                options={[{ label: 'Tất cả', value: 'All' }, ...difficulties.map((level) => ({ label: level, value: level }))]}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setExerciseEditing(null);
                exerciseForm.resetFields();
                setExerciseModalVisible(true);
              }}>
                Thêm bài tập
              </Button>
            </Space>
          </div>
          <Row gutter={[16, 16]}>
            {filteredExercises.map((item) => (
              <Col xs={24} sm={12} lg={8} key={item.id}>
                <Card
                  hoverable
                  className="exercise-card"
                  title={item.name}
                  onClick={() => {
                    setCurrentExercise(item);
                    setDetailModalVisible(true);
                  }}
                  actions={[
                    <span
                      key="view"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentExercise(item);
                        setDetailModalVisible(true);
                      }}
                    >
                      Xem
                    </span>,
                    <span
                      key="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExerciseEditing(item);
                        exerciseForm.setFieldsValue(item);
                        setExerciseModalVisible(true);
                      }}
                    >
                      Sửa
                    </span>,
                    <Popconfirm
                      key="delete"
                      title="Xác nhận xóa bài tập này?"
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        setExercises((prev) => prev.filter((exercise) => exercise.id !== item.id));
                        message.success('Đã xóa bài tập');
                      }}
                    >
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        Xóa
                      </span>
                    </Popconfirm>,
                  ]}
                >
                  <Paragraph>
                    <Text strong>Nhóm cơ:</Text> {item.muscleGroup}
                  </Paragraph>
                  <Paragraph>
                    <Tag color={item.difficulty === 'Easy' ? 'green' : item.difficulty === 'Medium' ? 'gold' : 'red'}>
                      {item.difficulty === 'Easy' ? 'Dễ' : item.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}
                    </Tag>
                  </Paragraph>
                  <Paragraph ellipsis={{ rows: 2, tooltip: item.description }}>{item.description}</Paragraph>
                  <Paragraph>
                    <Text strong>Calo/giờ:</Text> {item.caloriesPerHour}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <Modal
        title={workoutEditing ? 'Sửa buổi tập' : 'Thêm buổi tập'}
        visible={workoutModalVisible}
        footer={null}
        onCancel={() => {
          setWorkoutModalVisible(false);
          setWorkoutEditing(null);
        }}
      >
        <Form form={workoutForm} layout="vertical" onFinish={submitWorkout} preserve={false}>
          <Form.Item name="date" label="Ngày tập" rules={[{ required: true, message: 'Vui lòng chọn ngày tập' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true, message: 'Vui lòng chọn loại bài tập' }]}> 
            <Select options={workoutTypes.map((type) => ({ label: type, value: type }))} />
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}> 
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="calories" label="Calo" rules={[{ required: true, message: 'Vui lòng nhập calo' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú"> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
            <Select options={[{ label: 'Completed', value: 'Completed' }, { label: 'Missed', value: 'Missed' }]} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setWorkoutModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={healthEditing ? 'Sửa chỉ số sức khỏe' : 'Thêm chỉ số sức khỏe'}
        visible={healthModalVisible}
        footer={null}
        onCancel={() => {
          setHealthModalVisible(false);
          setHealthEditing(null);
        }}
      >
        <Form form={healthForm} layout="vertical" onFinish={submitHealthLog} preserve={false}>
          <Form.Item name="date" label="Ngày" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="restingHeartRate" label="Nhịp tim lúc nghỉ (bpm)" rules={[{ required: true, message: 'Vui lòng nhập nhịp tim' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sleepHours" label="Giờ ngủ" rules={[{ required: true, message: 'Vui lòng nhập giờ ngủ' }]}> 
            <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setHealthModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={exerciseEditing ? 'Sửa bài tập' : 'Thêm bài tập'}
        visible={exerciseModalVisible}
        footer={null}
        onCancel={() => {
          setExerciseModalVisible(false);
          setExerciseEditing(null);
        }}
      >
        <Form form={exerciseForm} layout="vertical" onFinish={submitExercise} preserve={false}>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true, message: 'Vui lòng nhập tên bài tập' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ' }]}> 
            <Select options={muscleGroups.map((group) => ({ label: group, value: group }))} />
          </Form.Item>
          <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true, message: 'Vui lòng chọn mức độ' }]}> 
            <Select options={difficulties.map((level) => ({ label: level, value: level }))} />
          </Form.Item>
          <Form.Item name="caloriesPerHour" label="Calo đốt trung bình/giờ" rules={[{ required: true, message: 'Vui lòng nhập calo' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setExerciseModalVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Drawer title="Thêm mục tiêu mới" width={520} placement="right" onClose={() => setGoalDrawerVisible(false)} open={goalDrawerVisible}>
        <Form form={goalForm} layout="vertical" onFinish={submitGoal}>
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập tên mục tiêu' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Loại" rules={[{ required: true, message: 'Vui lòng chọn loại mục tiêu' }]}> 
            <Select options={[
              { label: 'Giảm cân', value: 'Giảm cân' },
              { label: 'Tăng cơ', value: 'Tăng cơ' },
              { label: 'Cải thiện sức bền', value: 'Cải thiện sức bền' },
              { label: 'Khác', value: 'Khác' },
            ]} />
          </Form.Item>
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập giá trị mục tiêu' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="currentValue" label="Giá trị hiện tại" rules={[{ required: true, message: 'Vui lòng nhập giá trị hiện tại' }]}> 
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}> 
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
            <Select options={[
              { label: 'Đang thực hiện', value: 'In progress' },
              { label: 'Đã đạt', value: 'Achieved' },
              { label: 'Đã hủy', value: 'Cancelled' },
            ]} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
              <Button onClick={() => setGoalDrawerVisible(false)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={currentExercise ? currentExercise.name : 'Chi tiết bài tập'}
        visible={detailModalVisible}
        footer={<Button onClick={() => setDetailModalVisible(false)}>Đóng</Button>}
        onCancel={() => setDetailModalVisible(false)}
      >
        {currentExercise && (
          <div>
            <Paragraph>
              <Text strong>Nhóm cơ:</Text> {currentExercise.muscleGroup}
            </Paragraph>
            <Paragraph>
              <Text strong>Mức độ:</Text> {currentExercise.difficulty}
            </Paragraph>
            <Paragraph>
              <Text strong>Calo đốt trung bình/giờ:</Text> {currentExercise.caloriesPerHour}
            </Paragraph>
            <Paragraph>
              <Text strong>Hướng dẫn:</Text>
            </Paragraph>
            <Paragraph>{currentExercise.description}</Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TheDuc;
