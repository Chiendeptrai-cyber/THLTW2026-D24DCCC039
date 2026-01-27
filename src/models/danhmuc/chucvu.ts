import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<ChucVu.IRecord>('chuc-vu');

  return {
    ...objInit,
  };
};
