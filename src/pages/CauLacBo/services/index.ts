import type { Club, RegistrationApplication, ActionHistory, ClubMember, ClubStatistics, ApplicationStatus } from '../types';

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
];

let applications: RegistrationApplication[] = [];
let actionHistories: ActionHistory[] = [];

// Club Service
export const clubService = {
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
export const applicationService = {
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
export const memberService = {
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
export const statisticsService = {
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

// Action History Service
export const historyService = {
  // Get history for application
  getHistoryForApplication: async (applicationId: string) => {
    const app = applications.find((a) => a.id === applicationId);
    return Promise.resolve(app?.actionHistories || []);
  },
};
