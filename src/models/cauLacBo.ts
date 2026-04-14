import { clubService, applicationService, memberService, statisticsService } from '@/pages/CauLacBo/services';
import type { Club, RegistrationApplication, ClubMember, ClubStatistics, ActionHistory, ApplicationStatus } from '@/pages/CauLacBo/types';

export type { Club, RegistrationApplication, ClubMember, ClubStatistics, ActionHistory, ApplicationStatus };

export interface CauLacBoState {
  clubs: Club[];
  applications: RegistrationApplication[];
  members: ClubMember[];
  statistics: ClubStatistics | null;
  loading: boolean;
}

export default {
  namespace: 'cauLacBo',
  state: {
    clubs: [],
    applications: [],
    members: [],
    statistics: null,
    loading: false,
  } as CauLacBoState,

  effects: {
    *getClubs(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      const data: Club[] = yield call(clubService.getClubs);
      yield put({ type: 'save', payload: { clubs: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *createClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(clubService.createClub, payload);
      const data: Club[] = yield call(clubService.getClubs);
      yield put({ type: 'save', payload: { clubs: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *updateClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(clubService.updateClub, payload.id, payload.updates);
      const data: Club[] = yield call(clubService.getClubs);
      yield put({ type: 'save', payload: { clubs: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *deleteClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(clubService.deleteClub, payload);
      const data: Club[] = yield call(clubService.getClubs);
      yield put({ type: 'save', payload: { clubs: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *getApplications(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *createApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.createApplication, payload);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *updateApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.updateApplication, payload.id, payload.updates);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *deleteApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.deleteApplication, payload);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *approveApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.approveApplication, payload.id, payload.adminName);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *rejectApplication({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.rejectApplication, payload.id, payload.reason, payload.adminName);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *batchApprove({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.batchApprove, payload.ids, payload.adminName);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *batchReject({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(applicationService.batchReject, payload.ids, payload.reason, payload.adminName);
      const data: RegistrationApplication[] = yield call(applicationService.getApplications);
      yield put({ type: 'save', payload: { applications: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *getMembersByClub({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      const data: ClubMember[] = yield call(memberService.getMembersByClub, payload);
      yield put({ type: 'save', payload: { members: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *getAllMembers(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      const data: ClubMember[] = yield call(memberService.getAllMembers);
      yield put({ type: 'save', payload: { members: data } });
      yield put({ type: 'setLoading', payload: false });
    },

    *changeClubForMembers({ payload }: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      yield call(memberService.changeClubForMembers, payload.memberIds, payload.newClubId);
      yield put({ type: 'setLoading', payload: false });
    },

    *getStatistics(_: any, { call, put }: any) {
      yield put({ type: 'setLoading', payload: true });
      const data: ClubStatistics = yield call(statisticsService.getStatistics);
      yield put({ type: 'save', payload: { statistics: data } });
      yield put({ type: 'setLoading', payload: false });
    },
  },

  reducers: {
    save(state: CauLacBoState, { payload }: any) {
      return { ...state, ...payload };
    },
    setLoading(state: CauLacBoState, { payload }: any) {
      return { ...state, loading: payload };
    },
  },
};

