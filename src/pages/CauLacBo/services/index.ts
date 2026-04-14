import type { Club, RegistrationApplication, ActionHistory, ClubMember, ClubStatistics, ApplicationStatus } from '../types';

let clubs: Club[] = [
  {
    id: 'club-1',
    name: 'CLB Lập trình',
    avatar: 'https://via.placeholder.com/100?text=LT',
    foundedDate: '2020-01-15',
    description: '<p>Câu lạc bộ dành cho những bạn yêu thích <strong>lập trình</strong> và công nghệ thông tin.</p>',
    leader: 'Nguyễn Văn A',
    isActive: true,
    createdAt: '2020-01-15T00:00:00.000Z',
    updatedAt: '2020-01-15T00:00:00.000Z',
  },
  {
    id: 'club-2',
    name: 'CLB Tiếng Anh',
    avatar: 'https://via.placeholder.com/100?text=TA',
    foundedDate: '2019-05-20',
    description: '<p>Câu lạc bộ ngoại ngữ - <em>Tiếng Anh</em> giao tiếp và học thuật.</p>',
    leader: 'Trần Thị B',
    isActive: true,
    createdAt: '2019-05-20T00:00:00.000Z',
    updatedAt: '2019-05-20T00:00:00.000Z',
  },
  {
    id: 'club-3',
    name: 'CLB Âm nhạc',
    avatar: 'https://via.placeholder.com/100?text=AN',
    foundedDate: '2021-09-01',
    description: '<p>Câu lạc bộ dành cho những bạn đam mê <strong>âm nhạc</strong>, ca hát và nhạc cụ.</p>',
    leader: 'Lê Văn C',
    isActive: true,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
  },
  {
    id: 'club-4',
    name: 'CLB Thể thao',
    avatar: 'https://via.placeholder.com/100?text=TT',
    foundedDate: '2018-03-10',
    description: '<p>Câu lạc bộ thể thao, rèn luyện sức khỏe và tinh thần đồng đội.</p>',
    leader: 'Phạm Thị D',
    isActive: false,
    createdAt: '2018-03-10T00:00:00.000Z',
    updatedAt: '2018-03-10T00:00:00.000Z',
  },
];

let applications: RegistrationApplication[] = [
  {
    id: 'app-1',
    fullName: 'Phạm Văn E',
    email: 'phamvane@email.com',
    phone: '0901234567',
    gender: 'Nam',
    address: 'Hà Nội',
    specialty: 'Lập trình Web',
    clubId: 'club-1',
    registrationReason: 'Yêu thích lập trình và muốn học hỏi từ các anh chị senior',
    status: 'Pending',
    actionHistories: [],
    createdAt: '2025-04-01T08:00:00.000Z',
    updatedAt: '2025-04-01T08:00:00.000Z',
  },
  {
    id: 'app-2',
    fullName: 'Đặng Thị F',
    email: 'dangthif@email.com',
    phone: '0912345678',
    gender: 'Nữ',
    address: 'TP. Hồ Chí Minh',
    specialty: 'Ngoại ngữ',
    clubId: 'club-2',
    registrationReason: 'Muốn cải thiện kỹ năng tiếng Anh giao tiếp',
    status: 'Approved',
    actionHistories: [
      { id: 'history-1', userId: 'admin-1', userName: 'Admin', action: 'Approved', timestamp: '2025-04-02T10:30:00.000Z', applicationId: 'app-2' },
    ],
    createdAt: '2025-03-28T09:00:00.000Z',
    updatedAt: '2025-04-02T10:30:00.000Z',
  },
  {
    id: 'app-3',
    fullName: 'Hoàng Văn G',
    email: 'hoangvang@email.com',
    phone: '0923456789',
    gender: 'Nam',
    address: 'Đà Nẵng',
    specialty: 'Guitar, Piano',
    clubId: 'club-3',
    registrationReason: 'Đam mê âm nhạc từ nhỏ, muốn phát triển thêm',
    status: 'Rejected',
    rejectionReason: 'Chưa đủ điều kiện về thời gian tham gia',
    actionHistories: [
      { id: 'history-2', userId: 'admin-1', userName: 'Admin', action: 'Rejected', timestamp: '2025-04-03T14:00:00.000Z', reason: 'Chưa đủ điều kiện về thời gian tham gia', applicationId: 'app-3' },
    ],
    createdAt: '2025-03-30T11:00:00.000Z',
    updatedAt: '2025-04-03T14:00:00.000Z',
  },
  {
    id: 'app-4',
    fullName: 'Nguyễn Thị H',
    email: 'nguyenthih@email.com',
    phone: '0934567890',
    gender: 'Nữ',
    address: 'Hải Phòng',
    specialty: 'Bóng rổ',
    clubId: 'club-4',
    registrationReason: 'Muốn rèn luyện thể thao cùng các bạn',
    status: 'Pending',
    actionHistories: [],
    createdAt: '2025-04-04T07:30:00.000Z',
    updatedAt: '2025-04-04T07:30:00.000Z',
  },
  {
    id: 'app-5',
    fullName: 'Trần Văn I',
    email: 'tranvani@email.com',
    phone: '0945678901',
    gender: 'Nam',
    address: 'Huế',
    specialty: 'React, NodeJS',
    clubId: 'club-1',
    registrationReason: 'Muốn nâng cao kỹ năng lập trình fullstack',
    status: 'Approved',
    actionHistories: [
      { id: 'history-3', userId: 'admin-1', userName: 'Admin', action: 'Approved', timestamp: '2025-04-05T09:00:00.000Z', applicationId: 'app-5' },
    ],
    createdAt: '2025-04-03T15:00:00.000Z',
    updatedAt: '2025-04-05T09:00:00.000Z',
  },
  {
    id: 'app-6',
    fullName: 'Lê Thị K',
    email: 'lethik@email.com',
    phone: '0956789012',
    gender: 'Nữ',
    address: 'Cần Thơ',
    specialty: 'IELTS, TOEIC',
    clubId: 'club-2',
    registrationReason: 'Chuẩn bị thi IELTS, muốn luyện tập cùng nhóm',
    status: 'Pending',
    actionHistories: [],
    createdAt: '2025-04-06T10:00:00.000Z',
    updatedAt: '2025-04-06T10:00:00.000Z',
  },
];

export const clubService = {
  getClubs: async (): Promise<Club[]> => [...clubs],

  getClubById: async (id: string): Promise<Club | undefined> => clubs.find((c) => c.id === id),

  createClub: async (club: Omit<Club, 'id' | 'createdAt' | 'updatedAt'>): Promise<Club> => {
    const newClub: Club = { ...club, id: `club-${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    clubs.push(newClub);
    return newClub;
  },

  updateClub: async (id: string, updates: Partial<Club>): Promise<Club> => {
    const idx = clubs.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Club not found');
    clubs[idx] = { ...clubs[idx], ...updates, updatedAt: new Date().toISOString() };
    return clubs[idx];
  },

  deleteClub: async (id: string): Promise<void> => {
    clubs = clubs.filter((c) => c.id !== id);
  },
};

export const applicationService = {
  getApplications: async (): Promise<RegistrationApplication[]> => [...applications],

  getApplicationsByClub: async (clubId: string): Promise<RegistrationApplication[]> => applications.filter((a) => a.clubId === clubId),

  createApplication: async (data: Omit<RegistrationApplication, 'id' | 'createdAt' | 'updatedAt' | 'actionHistories' | 'status'>): Promise<RegistrationApplication> => {
    const newApp: RegistrationApplication = {
      ...data,
      id: `app-${Date.now()}`,
      status: 'Pending',
      actionHistories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    applications.push(newApp);
    return newApp;
  },

  updateApplication: async (id: string, updates: Partial<RegistrationApplication>): Promise<RegistrationApplication> => {
    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Application not found');
    applications[idx] = { ...applications[idx], ...updates, updatedAt: new Date().toISOString() };
    return applications[idx];
  },

  deleteApplication: async (id: string): Promise<void> => {
    applications = applications.filter((a) => a.id !== id);
  },

  approveApplication: async (id: string, adminName: string = 'Admin'): Promise<RegistrationApplication> => {
    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Application not found');
    const history: ActionHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: 'admin-1',
      userName: adminName,
      action: 'Approved',
      timestamp: new Date().toISOString(),
      applicationId: id,
    };
    applications[idx].actionHistories.push(history);
    applications[idx].status = 'Approved';
    applications[idx].updatedAt = new Date().toISOString();
    return { ...applications[idx] };
  },

  rejectApplication: async (id: string, reason: string, adminName: string = 'Admin'): Promise<RegistrationApplication> => {
    const idx = applications.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Application not found');
    const history: ActionHistory = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: 'admin-1',
      userName: adminName,
      action: 'Rejected',
      timestamp: new Date().toISOString(),
      reason,
      applicationId: id,
    };
    applications[idx].actionHistories.push(history);
    applications[idx].status = 'Rejected';
    applications[idx].rejectionReason = reason;
    applications[idx].updatedAt = new Date().toISOString();
    return { ...applications[idx] };
  },

  batchApprove: async (ids: string[], adminName: string = 'Admin'): Promise<RegistrationApplication[]> => {
    const results: RegistrationApplication[] = [];
    for (const id of ids) {
      const app = await applicationService.approveApplication(id, adminName);
      results.push(app);
    }
    return results;
  },

  batchReject: async (ids: string[], reason: string, adminName: string = 'Admin'): Promise<RegistrationApplication[]> => {
    const results: RegistrationApplication[] = [];
    for (const id of ids) {
      const app = await applicationService.rejectApplication(id, reason, adminName);
      results.push(app);
    }
    return results;
  },
};

export const memberService = {
  getMembersByClub: async (clubId: string): Promise<ClubMember[]> => {
    return applications
      .filter((a) => a.clubId === clubId && a.status === 'Approved')
      .map((a) => ({
        id: `member-${a.id}`,
        applicationId: a.id,
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        gender: a.gender,
        address: a.address,
        specialty: a.specialty,
        clubId: a.clubId,
        joinedAt: a.updatedAt,
      }));
  },

  getAllMembers: async (): Promise<ClubMember[]> => {
    return applications
      .filter((a) => a.status === 'Approved')
      .map((a) => ({
        id: `member-${a.id}`,
        applicationId: a.id,
        fullName: a.fullName,
        email: a.email,
        phone: a.phone,
        gender: a.gender,
        address: a.address,
        specialty: a.specialty,
        clubId: a.clubId,
        joinedAt: a.updatedAt,
      }));
  },

  changeClubForMembers: async (memberIds: string[], newClubId: string): Promise<void> => {
    const appIds = memberIds.map((id) => id.replace('member-', ''));
    for (const appId of appIds) {
      const idx = applications.findIndex((a) => a.id === appId);
      if (idx !== -1) {
        applications[idx].clubId = newClubId;
        applications[idx].updatedAt = new Date().toISOString();
      }
    }
  },
};

export const statisticsService = {
  getStatistics: async (): Promise<ClubStatistics> => ({
    totalClubs: clubs.length,
    totalApplications: {
      pending: applications.filter((a) => a.status === 'Pending').length,
      approved: applications.filter((a) => a.status === 'Approved').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
    },
    applicationsByClub: clubs.map((club) => {
      const clubApps = applications.filter((a) => a.clubId === club.id);
      return {
        clubName: club.name,
        clubId: club.id,
        pending: clubApps.filter((a) => a.status === 'Pending').length,
        approved: clubApps.filter((a) => a.status === 'Approved').length,
        rejected: clubApps.filter((a) => a.status === 'Rejected').length,
      };
    }),
  }),
};
