import { useState } from 'react';
import * as duLichService from '@/services/DuLich';

export default () => {
  const [diemDens, setDiemDens] = useState<DuLich.DiemDen[]>([]);
  const [lichTrinhs, setLichTrinhs] = useState<DuLich.LichTrinh[]>([]);
  const [lichTrinhHienTai, setLichTrinhHienTai] = useState<DuLich.LichTrinh | undefined>();
  const [thongKe, setThongKe] = useState<DuLich.ThongKe | undefined>();
  const [loading, setLoading] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [diemDenEdit, setDiemDenEdit] = useState<DuLich.DiemDen | undefined>();
  const [visibleLichTrinh, setVisibleLichTrinh] = useState(false);

  // Điểm đến
  const getDiemDens = () => {
    setLoading(true);
    const data = duLichService.getDiemDens();
    setDiemDens(data);
    setLoading(false);
  };

  const themDiemDen = (dd: Omit<DuLich.DiemDen, 'id'>) => {
    duLichService.themDiemDen(dd);
    getDiemDens();
  };

  const suaDiemDen = (id: string, dd: Partial<DuLich.DiemDen>) => {
    duLichService.suaDiemDen(id, dd);
    getDiemDens();
  };

  const xoaDiemDen = (id: string) => {
    duLichService.xoaDiemDen(id);
    getDiemDens();
  };

  // Lịch trình
  const getLichTrinhs = () => {
    setLoading(true);
    const data = duLichService.getLichTrinhs();
    setLichTrinhs(data);
    setLoading(false);
  };

  const themLichTrinh = (lt: Omit<DuLich.LichTrinh, 'id' | 'ngayTao'>) => {
    const newLt = duLichService.themLichTrinh(lt);
    getLichTrinhs();
    return newLt;
  };

  const suaLichTrinh = (id: string, lt: Partial<DuLich.LichTrinh>) => {
    duLichService.suaLichTrinh(id, lt);
    getLichTrinhs();
  };

  const xoaLichTrinh = (id: string) => {
    duLichService.xoaLichTrinh(id);
    getLichTrinhs();
  };

  // Thống kê
  const getThongKe = () => {
    const data = duLichService.getThongKe();
    setThongKe(data);
  };

  return {
    diemDens,
    setDiemDens,
    lichTrinhs,
    setLichTrinhs,
    lichTrinhHienTai,
    setLichTrinhHienTai,
    thongKe,
    loading,
    visibleForm,
    setVisibleForm,
    isEdit,
    setIsEdit,
    diemDenEdit,
    setDiemDenEdit,
    visibleLichTrinh,
    setVisibleLichTrinh,
    getDiemDens,
    themDiemDen,
    suaDiemDen,
    xoaDiemDen,
    getLichTrinhs,
    themLichTrinh,
    suaLichTrinh,
    xoaLichTrinh,
    getThongKe,
  };
};
