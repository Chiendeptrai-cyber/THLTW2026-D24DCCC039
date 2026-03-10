import React, { useState } from 'react';
import { Button, Card, Col, Row, Table, Tag, Space, Statistic } from 'antd';
import {
	ScissorOutlined,
	FileOutlined,
	ThunderboltOutlined,
	CloseOutlined,
	CheckOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import styles from './style.less';

type Choice = 'keo' | 'bao' | 'bua';
type Result = 'win' | 'lose' | 'draw';

interface GameRecord {
	round: number;
	playerChoice: Choice;
	computerChoice: Choice;
	result: Result;
	timestamp: string;
}

const choiceNames: Record<Choice, string> = {
	keo: 'Kéo',
	bao: 'Bao',
	bua: 'Búa',
};

const choiceIcons: Record<Choice, React.ReactNode> = {
	keo: <ScissorOutlined />,
	bao: <FileOutlined />,
	bua: <ThunderboltOutlined />,
};

const OanTuTi: React.FC = () => {
	const [gameHistory, setGameHistory] = useState<GameRecord[]>([]);
	const [currentGame, setCurrentGame] = useState<{
		playerChoice?: Choice;
		computerChoice?: Choice;
		result?: Result;
	}>({});

	const getRandomChoice = (): Choice => {
		const choices: Choice[] = ['keo', 'bao', 'bua'];
		return choices[Math.floor(Math.random() * 3)];
	};

	const determineResult = (player: Choice, computer: Choice): Result => {
		if (player === computer) return 'draw';
		if (
			(player === 'keo' && computer === 'bao') ||
			(player === 'bao' && computer === 'bua') ||
			(player === 'bua' && computer === 'keo')
		) {
			return 'win';
		}
		return 'lose';
	};

	const playGame = (playerChoice: Choice) => {
		const computerChoice = getRandomChoice();
		const result = determineResult(playerChoice, computerChoice);

		const newRecord: GameRecord = {
			round: gameHistory.length + 1,
			playerChoice,
			computerChoice,
			result,
			timestamp: new Date().toLocaleTimeString('vi-VN'),
		};

		setCurrentGame({
			playerChoice,
			computerChoice,
			result,
		});

		setGameHistory([newRecord, ...gameHistory]);
	};

	const resetGame = () => {
		setCurrentGame({});
		setGameHistory([]);
	};

	// Calculate statistics
	const stats = {
		total: gameHistory.length,
		wins: gameHistory.filter((g) => g.result === 'win').length,
		losses: gameHistory.filter((g) => g.result === 'lose').length,
		draws: gameHistory.filter((g) => g.result === 'draw').length,
	};

	const columns = [
		{
			title: 'Ván',
			dataIndex: 'round',
			key: 'round',
			width: 60,
		},
		{
			title: 'Người chơi',
			dataIndex: 'playerChoice',
			key: 'playerChoice',
			render: (choice: Choice) => (
				<span>
					{choiceIcons[choice]} {choiceNames[choice]}
				</span>
			),
		},
		{
			title: 'Máy tính',
			dataIndex: 'computerChoice',
			key: 'computerChoice',
			render: (choice: Choice) => (
				<span>
					{choiceIcons[choice]} {choiceNames[choice]}
				</span>
			),
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			key: 'result',
			render: (result: Result) => {
				const config = {
					win: { icon: <CheckOutlined />, label: 'Thắng', color: 'success' },
					lose: { icon: <CloseOutlined />, label: 'Thua', color: 'error' },
					draw: { icon: <SwapOutlined />, label: 'Hòa', color: 'default' },
				};
				const { icon, label, color } = config[result];
				return (
					<Tag icon={icon} color={color}>
						{label}
					</Tag>
				);
			},
		},
		{
			title: 'Thời gian',
			dataIndex: 'timestamp',
			key: 'timestamp',
		},
	];

	return (
		<div className={styles.container}>
			<h1 style={{ textAlign: 'center', marginBottom: 30 }}>Trò chơi Oẳn Tù Tì</h1>

			{/* Game Controls */}
			<Card style={{ marginBottom: 30 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={8} style={{ textAlign: 'center' }}>
						<Button
							type={currentGame.playerChoice === 'keo' ? 'primary' : 'default'}
							size='large'
							onClick={() => playGame('keo')}
							block
						>
							<ScissorOutlined /> Kéo
						</Button>
					</Col>
					<Col xs={24} sm={8} style={{ textAlign: 'center' }}>
						<Button
							type={currentGame.playerChoice === 'bao' ? 'primary' : 'default'}
							size='large'
							onClick={() => playGame('bao')}
							block
						>
							<FileOutlined /> Bao
						</Button>
					</Col>
					<Col xs={24} sm={8} style={{ textAlign: 'center' }}>
						<Button
							type={currentGame.playerChoice === 'bua' ? 'primary' : 'default'}
							size='large'
							onClick={() => playGame('bua')}
							block
						>
							<ThunderboltOutlined /> Búa
						</Button>
					</Col>
				</Row>
			</Card>

			{/* Current Game Result */}
			{currentGame.playerChoice && (
				<Card style={{ marginBottom: 30, backgroundColor: '#f0f2f5' }}>
					<Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
						<Col xs={24} sm={8}>
							<h3>Bạn chọn:</h3>
							<div className={styles.choice}>
								<div className={styles.choiceIcon}>{choiceIcons[currentGame.playerChoice]}</div>
								<p>{choiceNames[currentGame.playerChoice]}</p>
							</div>
						</Col>
						<Col xs={24} sm={8}>
							<h3>Kết quả:</h3>
							<div className={styles.result}>
								{currentGame.result === 'win' && (
									<Tag icon={<CheckOutlined />} color='success' style={{ fontSize: 16, padding: 8 }}>
										THẮNG
									</Tag>
								)}
								{currentGame.result === 'lose' && (
									<Tag icon={<CloseOutlined />} color='error' style={{ fontSize: 16, padding: 8 }}>
										THUA
									</Tag>
								)}
								{currentGame.result === 'draw' && (
									<Tag icon={<SwapOutlined />} color='default' style={{ fontSize: 16, padding: 8 }}>
										HÒA
									</Tag>
								)}
							</div>
						</Col>
						<Col xs={24} sm={8}>
							<h3>Máy tính chọn:</h3>
							<div className={styles.choice}>
								<div className={styles.choiceIcon}>{choiceIcons[currentGame.computerChoice!]}</div>
								<p>{choiceNames[currentGame.computerChoice!]}</p>
							</div>
						</Col>
					</Row>
				</Card>
			)}

			{/* Statistics */}
			{stats.total > 0 && (
				<Card style={{ marginBottom: 30 }}>
					<Row gutter={[16, 16]}>
						<Col xs={12} sm={6}>
							<Statistic title='Tổng cộng' value={stats.total} />
						</Col>
						<Col xs={12} sm={6}>
							<Statistic title='Thắng' value={stats.wins} valueStyle={{ color: '#52c41a' }} />
						</Col>
						<Col xs={12} sm={6}>
							<Statistic title='Thua' value={stats.losses} valueStyle={{ color: '#f5222d' }} />
						</Col>
						<Col xs={12} sm={6}>
							<Statistic title='Hòa' value={stats.draws} valueStyle={{ color: '#1890ff' }} />
						</Col>
					</Row>
				</Card>
			)}

			{/* History Table */}
			{gameHistory.length > 0 && (
				<Card style={{ marginBottom: 30 }}>
					<h2>Lịch sử trò chơi</h2>
					<Table dataSource={gameHistory} columns={columns} pagination={{ pageSize: 10 }} rowKey='round' size='small' />
				</Card>
			)}

			{/* Reset Button */}
			{gameHistory.length > 0 && (
				<Row justify='center' style={{ marginBottom: 30 }}>
					<Col>
						<Button danger size='large' onClick={resetGame}>
							Xóa lịch sử
						</Button>
					</Col>
				</Row>
			)}
		</div>
	);
};

export default OanTuTi;
