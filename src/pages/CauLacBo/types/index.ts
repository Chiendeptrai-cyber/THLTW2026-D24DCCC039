export interface Club {
  id: string;
  name: string;
  avatar?: string;
  foundedDate: string;
  description: string;
  leader: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ActionHistory {
  id: string;
  userId: string;
  userName: string;
  action: 'Approved' | 'Rejected';
  timestamp: string;
  reason?: string;
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
  clubName?: string;
  registrationReason: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  actionHistories: ActionHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ClubMember {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  specialty: string;
  clubId: string;
  joinedAt: string;
}

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
