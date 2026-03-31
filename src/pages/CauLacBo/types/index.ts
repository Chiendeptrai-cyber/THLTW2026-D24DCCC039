// Club Types
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
