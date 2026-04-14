import type { FC } from 'react';

export interface Club {
  id: string;
  name: string;
  avatar?: string;
  foundedDate: string;
  description: string; // HTML
  leader: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Registration Application Types
export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ActionHistory {
  id: string;
  userId: string;
  userName: string;
  action: 'Approved' | 'Rejected'; // or other actions
  timestamp: string;
  reason?: string; // for rejection reason
  applicationId: string;
}

export interface RegistrationApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Nam' | 'Nữ' | string;
  address: string;
  specialty: string;
  clubId: string;
  clubName?: string; // for display
  registrationReason: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  actionHistories: ActionHistory[];
  createdAt: string;
  updatedAt: string;
}

// Club Member Types
export interface ClubMember {
  id: string;
  applicationId: string; // reference to application
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  specialty: string;
  clubId: string;
  joinedAt: string;
}

// Statistics Types
export interface ClubStatistics {
  totalClubs: number;
  totalApplications: {
    pending: number;
    approved: number;
    rejected: number;
  };
  applicationsByClub: {
    clubName: string;
    clubId: string;
    pending: number;
    approved: number;
    rejected: number;
  }[];
}

// Mock data
let clubs: Club[] = [
  {
    id: 'club-1',
    name: 'CLB Lập trình',
    avatar: 'https://via.placeholder.com/100?text=Programming',
    foundedDate: '2020-01-15',
    description: '<p>Câu lạc bộ dành cho những bạn yêu thích lập trình</p>',
    leader: 'Thiên Phố',
    isActive: true,
    createdAt: '2020-01-15',
    updatedAt: '2020-01-15',
  },
  {
    id: 'club-2',
    name: 'CLB Tiếng Anh',
    avatar: 'https://via.placeholder.com/100?text=English',
    foundedDate: '2019-05-20',
    description: '<p>Câu lạc bộ ngoại ngữ - Tiếng Anh</p>',
    leader: 'Hải Âu',
    isActive: true,
    createdAt: '2019-05-20',
    updatedAt: '2019-05-20',
  },
];

let applications: RegistrationApplication[] = [
  {
    id: 'app-1',
    fullName: 'Phạm Văn C',
    email: 'phamvanccc@email.com',
    phone: '0123456789',
    gender: 'Nam',
    address: 'Hà Nội',
    specialty: 'Lập trình Web',
    clubId: 'club-1',
    registrationReason: 'Yêu thích lập trình và muốn học hỏi từ các senior',
    status: 'Pending',
    actionHistories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    fullName: 'Đặng Thị D',
    email: 'dangthid@email.com',
    phone: '0987654321',
    gender: 'Nữ',
    address: 'TP.HCM',
    specialty: 'Ngoại ngữ',
    clubId: 'club-2',
    registrationReason: 'Muốn cải thiện kỹ năng tiếng Anh',
    status: 'Approved',
    actionHistories: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Club Service
const clubService = {
  // Get all clubs
  getClubs: async () => {
    return Promise.resolve(clubs);
  },

  // Get club by id
  getClubById: async (id: string) => {
    return Promise.resolve(clubs.find((c) => c.id === id));
  },

  // Create club
  createClub: async (club: Omit<Club, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClub: Club = {
      ...club,
      id: `club-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    clubs.push(newClub);
    return Promise.resolve(newClub);
  },

  // Update club
  updateClub: async (id: string, updates: Partial<Club>) => {
    const index = clubs.findIndex((c) => c.id === id);
    if (index !== -1) {
      clubs[index] = {
        ...clubs[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(clubs[index]);
    }
    return Promise.reject(new Error('Club not found'));
  },

  // Delete club
  deleteClub: async (id: string) => {
    clubs = clubs.filter((c) => c.id !== id);
    return Promise.resolve();
  },
};

// Registration Application Service
const applicationService = {
  // Get all applications
  getApplications: async () => {
    return Promise.resolve(applications);
  },

  // Get applications by status
  getApplicationsByStatus: async (status: ApplicationStatus) => {
    return Promise.resolve(applications.filter((a) => a.status === status));
  },

  // Get applications by club
  getApplicationsByClub: async (clubId: string) => {
    return Promise.resolve(applications.filter((a) => a.clubId === clubId));
  },

  // Create application
  createApplication: async (application: Omit<RegistrationApplication, 'id' | 'createdAt' | 'updatedAt' | 'actionHistories'>) => {
    const newApplication: RegistrationApplication = {
      ...application,
      id: `app-${Date.now()}`,
      actionHistories: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    applications.push(newApplication);
    return Promise.resolve(newApplication);
  },

  // Update application
  updateApplication: async (id: string, updates: Partial<RegistrationApplication>) => {
    const index = applications.findIndex((a) => a.id === id);
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      return Promise.resolve(applications[index]);
    }
    return Promise.reject(new Error('Application not found'));
  },

  // Delete application
  deleteApplication: async (id: string) => {
    applications = applications.filter((a) => a.id !== id);
    return Promise.resolve();
  },

  // Approve application
  approveApplication: async (id: string, adminName: string = 'Admin') => {
    const index = applications.findIndex((a) => a.id === id);
    if (index !== -1) {
      const history: ActionHistory = {
        id: `history-${Date.now()}`,
        userId: 'admin-1',
        userName: adminName,
        action: 'Approved',
        timestamp: new Date().toISOString(),
        applicationId: id,
      };
      applications[index].actionHistories.push(history);
      applications[index].status = 'Approved';
      applications[index].updatedAt = new Date().toISOString();
      return Promise.resolve(applications[index]);
    }
    return Promise.reject(new Error('Application not found'));
  },

  // Reject application
  rejectApplication: async (id: string, reason: string, adminName: string = 'Admin') => {
    const index = applications.findIndex((a) => a.id === id);
    if (index !== -1) {
      const history: ActionHistory = {
        id: `history-${Date.now()}`,
        userId: 'admin-1',
        userName: adminName,
        action: 'Rejected',
        timestamp: new Date().toISOString(),
        reason,
        applicationId: id,
      };
      applications[index].actionHistories.push(history);
      applications[index].status = 'Rejected';
      applications[index].rejectionReason = reason;
      applications[index].updatedAt = new Date().toISOString();
      return Promise.resolve(applications[index]);
    }
    return Promise.reject(new Error('Application not found'));
  },

  // Batch approve
  batchApproveApplications: async (ids: string[], adminName: string = 'Admin') => {
    const results: RegistrationApplication[] = [];
    for (const id of ids) {
      const app = await applicationService.approveApplication(id, adminName);
      results.push(app);
    }
    return Promise.resolve(results);
  },

  // Batch reject
  batchRejectApplications: async (ids: string[], reason: string, adminName: string = 'Admin') => {
    const results: RegistrationApplication[] = [];
    for (const id of ids) {
      const app = await applicationService.rejectApplication(id, reason, adminName);
      results.push(app);
    }
    return Promise.resolve(results);
  },
};

// Club Member Service
const memberService = {
  // Get members by club
  getMembersByClub: async (clubId: string) => {
    const clubMembers: ClubMember[] = applications
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
    return Promise.resolve(clubMembers);
  },

  // Get all members
  getAllMembers: async () => {
    const allMembers: ClubMember[] = applications
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
    return Promise.resolve(allMembers);
  },

  // Change club for members
  changeClubForMembers: async (memberIds: string[], newClubId: string) => {
    const applicationIds = memberIds.map((id) => id.replace('member-', ''));
    for (const appId of applicationIds) {
      const index = applications.findIndex((a) => a.id === appId);
      if (index !== -1) {
        applications[index].clubId = newClubId;
        applications[index].updatedAt = new Date().toISOString();
      }
    }
    return Promise.resolve();
  },
};

// Statistics Service
const statisticsService = {
  // Get statistics
  getStatistics: async (): Promise<ClubStatistics> => {
    const totalClubs = clubs.length;
    const totalApplications = {
      pending: applications.filter((a) => a.status === 'Pending').length,
      approved: applications.filter((a) => a.status === 'Approved').length,
      rejected: applications.filter((a) => a.status === 'Rejected').length,
    };

    const applicationsByClub = clubs.map((club) => {
      const clubApps = applications.filter((a) => a.clubId === club.id);
      return {
        clubName: club.name,
        clubId: club.id,
        pending: clubApps.filter((a) => a.status === 'Pending').length,
        approved: clubApps.filter((a) => a.status === 'Approved').length,
        rejected: clubApps.filter((a) => a.status === 'Rejected').length,
      };
    });

    return Promise.resolve({
      totalClubs,
      totalApplications,
      applicationsByClub,
    });
  },
};

export interface CauLacBoState {
  clubs: Club[];
  applications: RegistrationApplication[];
  members: ClubMember[];
  statistics: ClubStatistics | null;
  loading: boolean;
  error: string | null;
}

export default {
  namespace: 'cauLacBo',
  state: {
    clubs: [],
    applications: [],
    members: [],
    statistics: null,
    loading: false,
    error: null,
  } as CauLacBoState,

  effects: {
    // Club Effects
    *getClubs(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const clubsList = yield call(clubService.getClubs);
        yield put({ type: 'setClubs', payload: clubsList });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *createClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const newClub = yield call(clubService.createClub, payload);
        yield put({ type: 'addClub', payload: newClub });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *updateClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, updates } = payload;
        const updated = yield call(clubService.updateClub, id, updates);
        yield put({ type: 'updateClubState', payload: updated });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *deleteClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        yield call(clubService.deleteClub, payload);
        yield put({ type: 'removeClub', payload });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Application Effects
    *getApplications(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const appList = yield call(applicationService.getApplications);
        yield put({ type: 'setApplications', payload: appList });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *createApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const newApp = yield call(applicationService.createApplication, payload);
        yield put({ type: 'addApplication', payload: newApp });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *updateApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, updates } = payload;
        const updated = yield call(applicationService.updateApplication, id, updates);
        yield put({ type: 'updateApplicationState', payload: updated });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *deleteApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        yield call(applicationService.deleteApplication, payload);
        yield put({ type: 'removeApplication', payload });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *approveApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, adminName } = payload;
        const updated = yield call(applicationService.approveApplication, id, adminName);
        yield put({ type: 'updateApplicationState', payload: updated });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *rejectApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { id, reason, adminName } = payload;
        const updated = yield call(applicationService.rejectApplication, id, reason, adminName);
        yield put({ type: 'updateApplicationState', payload: updated });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *batchApproveApplications({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { ids, adminName } = payload;
        const updated = yield call(applicationService.batchApproveApplications, ids, adminName);
        for (const app of updated) {
          yield put({ type: 'updateApplicationState', payload: app });
        }
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *batchRejectApplications({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { ids, reason, adminName } = payload;
        const updated = yield call(applicationService.batchRejectApplications, ids, reason, adminName);
        for (const app of updated) {
          yield put({ type: 'updateApplicationState', payload: app });
        }
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Member Effects
    *getMembersByClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const memberList = yield call(memberService.getMembersByClub, payload);
        yield put({ type: 'setMembers', payload: memberList });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *getAllMembers(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const memberList = yield call(memberService.getAllMembers);
        yield put({ type: 'setMembers', payload: memberList });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },

    *changeClubForMembers({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const { memberIds, newClubId } = payload;
        yield call(memberService.changeClubForMembers, memberIds, newClubId);
        yield put({ type: 'setLoading', payload: false });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
        yield put({ type: 'setLoading', payload: false });
      }
    },

    // Statistics Effects
    *getStatistics(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const stats = yield call(statisticsService.getStatistics);
        yield put({ type: 'setStatistics', payload: stats });
      } catch (error: any) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
  },

  reducers: {
    setClubs(state: any, { payload }: any) {
      return { ...state, clubs: payload };
    },
    addClub(state: any, { payload }: any) {
      return { ...state, clubs: [...state.clubs, payload] };
    },
    updateClubState(state: any, { payload }: any) {
      return {
        ...state,
        clubs: state.clubs.map((c: Club) => (c.id === payload.id ? payload : c)),
      };
    },
    removeClub(state: any, { payload }: any) {
      return { ...state, clubs: state.clubs.filter((c: Club) => c.id !== payload) };
    },

    setApplications(state: any, { payload }: any) {
      return { ...state, applications: payload };
    },
    addApplication(state: any, { payload }: any) {
      return { ...state, applications: [...state.applications, payload] };
    },
    updateApplicationState(state: any, { payload }: any) {
      return {
        ...state,
        applications: state.applications.map((a: RegistrationApplication) => (a.id === payload.id ? payload : a)),
      };
    },
    removeApplication(state: any, { payload }: any) {
      return { ...state, applications: state.applications.filter((a: RegistrationApplication) => a.id !== payload) };
    },

    setMembers(state: any, { payload }: any) {
      return { ...state, members: payload };
    },

    setStatistics(state: any, { payload }: any) {
      return { ...state, statistics: payload };
    },

    setLoading(state: any, { payload }: any) {
      return { ...state, loading: payload };
    },

    setError(state: any, { payload }: any) {
      return { ...state, error: payload };
    },
  },
};

