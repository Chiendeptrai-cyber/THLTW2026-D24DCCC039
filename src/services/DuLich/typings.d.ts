declare module DuLich {
  /** Loại hình điểm đến */
  type LoaiDiemDen = 'bien' | 'nui' | 'thanhpho';

  /** Điểm đến */
  interface DiemDen {
    id: string;
    ten: string;
    moTa: string;
    hinhAnh: string;
    loai: LoaiDiemDen;
    danhGia: number; // 1-5
    thoiGianThamQuan: number; // giờ
    chiPhi: {
      anUong: number;
      luuTru: number;
      diChuyen: number;
    };
    diaChi: string;
    toaDo?: { lat: number; lng: number };
  }

  /** Một điểm đến trong lịch trình */
  interface DiemDenTrongNgay {
    id: string;
    diemDenId: string;
    thuTu: number;
  }

  /** Ngày trong lịch trình */
  interface NgayLichTrinh {
    ngay: number; // Ngày thứ mấy (1, 2, 3...)
    diemDens: DiemDenTrongNgay[];
  }

  /** Lịch trình du lịch */
  interface LichTrinh {
    id: string;
    ten: string;
    ngayTao: string;
    nganSachDuKien: number;
    ngays: NgayLichTrinh[];
  }

  /** Thống kê */
  interface ThongKe {
    lichTrinhTheoThang: { thang: string; soLuong: number }[];
    diaDiemPhoBien: { ten: string; soLuot: number }[];
    doanhThu: { thang: string; soTien: number }[];
    chiPhiTheoHangMuc: { hangMuc: string; soTien: number }[];
  }
}
