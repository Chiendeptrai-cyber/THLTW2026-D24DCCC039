export type CourseStatus = 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  status: CourseStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const instructors = [
  'Thiên Lý',
  'Hải Âu',
  'Mộc Nhi',
  'Linh Hồ',
];

export const statusOptions: CourseStatus[] = ['Đang mở', 'Đã kết thúc', 'Tạm dừng'];
