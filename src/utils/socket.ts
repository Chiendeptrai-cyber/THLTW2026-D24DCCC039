import { io } from 'socket.io-client';

const token = localStorage.getItem('token');

const url = 'https://dhs.aisenote.com/'; //dev
//const url = 'https://dhs.ptit.edu.vn/';//pro
// const namespace = 'socket.io'

const socket = io(url, {
	path: '/socket.io',
	transports: ['websocket'],
	reconnectionAttempts: 30,
	reconnectionDelay: 3000,
	reconnection: true,
	auth: (cb) => cb({ token }),
});

socket.connect();

// DEBUG
socket.on('connect', () => {
	console.log('Socket connected ' + socket.id);
});
socket.io.on('error', (err) => {
	console.error('Socket error:', err);
});
socket.io.on('reconnect', (attempt) => {
	console.log('Socket reconnect:', attempt);
});
socket.io.on('close', (reason) => {
	console.log('Socket closed, reason:', reason);
});

export enum ESocketType {
	DINH_CHI = 'DINH_CHI',
	TRANG_THAI_THI = 'TRANG_THAI_THI',
	XEM_PHONG_THI = 'xem-phong-thi',
}

export default socket;
