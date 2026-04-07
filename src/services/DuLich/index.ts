const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

/** Dữ liệu mẫu điểm đến */
const DEFAULT_DIEM_DEN: DuLich.DiemDen[] = [
  {
    id: '1',
    ten: 'Vịnh Hạ Long',
    moTa: 'Di sản thiên nhiên thế giới với hàng nghìn hòn đảo đá vôi, hang động kỳ vĩ và cảnh quan biển tuyệt đẹp.',
    hinhAnh: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    loai: 'bien',
    danhGia: 4.8,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 500000, luuTru: 1200000, diChuyen: 300000 },
    diaChi: 'Quảng Ninh',
  },
  {
    id: '2',
    ten: 'Sapa',
    moTa: 'Thị trấn vùng cao nổi tiếng với ruộng bậc thang, núi Fansipan và bản làng dân tộc thiểu số.',
    hinhAnh: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800',
    loai: 'nui',
    danhGia: 4.6,
    thoiGianThamQuan: 12,
    chiPhi: { anUong: 400000, luuTru: 800000, diChuyen: 250000 },
    diaChi: 'Lào Cai',
  },
  {
    id: '3',
    ten: 'Phố cổ Hội An',
    moTa: 'Di sản văn hóa thế giới với kiến trúc cổ, đèn lồng rực rỡ và ẩm thực phong phú.',
    hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    loai: 'thanhpho',
    danhGia: 4.7,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 350000, luuTru: 700000, diChuyen: 200000 },
    diaChi: 'Quảng Nam',
  },
  {
    id: '4',
    ten: 'Đà Lạt',
    moTa: 'Thành phố ngàn hoa, khí hậu mát mẻ quanh năm, nổi tiếng với thác nước và hồ.',
    hinhAnh: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800',
    loai: 'nui',
    danhGia: 4.5,
    thoiGianThamQuan: 10,
    chiPhi: { anUong: 400000, luuTru: 900000, diChuyen: 200000 },
    diaChi: 'Lâm Đồng',
  },
  {
    id: '5',
    ten: 'Phú Quốc',
    moTa: 'Đảo ngọc với bãi biển cát trắng, nước biển trong xanh và hệ sinh thái phong phú.',
    hinhAnh: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800',
    loai: 'bien',
    danhGia: 4.4,
    thoiGianThamQuan: 16,
    chiPhi: { anUong: 600000, luuTru: 1500000, diChuyen: 500000 },
    diaChi: 'Kiên Giang',
  },
  {
    id: '6',
    ten: 'Hà Nội',
    moTa: 'Thủ đô nghìn năm văn hiến với phố cổ, hồ Hoàn Kiếm và di tích lịch sử phong phú.',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    loai: 'thanhpho',
    danhGia: 4.3,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 300000, luuTru: 800000, diChuyen: 150000 },
    diaChi: 'Hà Nội',
  },
  {
    id: '7',
    ten: 'Nha Trang',
    moTa: 'Thành phố biển sôi động với Vinpearl Land, tháp Bà Ponagar và đảo Hòn Mun.',
    hinhAnh: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800',
    loai: 'bien',
    danhGia: 4.3,
    thoiGianThamQuan: 10,
    chiPhi: { anUong: 450000, luuTru: 1000000, diChuyen: 300000 },
    diaChi: 'Khánh Hòa',
  },
  {
    id: '8',
    ten: 'TP. Hồ Chí Minh',
    moTa: 'Thành phố năng động nhất Việt Nam với chợ Bến Thành, nhà thờ Đức Bà và hệ thống ẩm thực đa dạng.',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
    loai: 'thanhpho',
    danhGia: 4.2,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 350000, luuTru: 900000, diChuyen: 200000 },
    diaChi: 'TP. Hồ Chí Minh',
  },
  {
    id: '9',
    ten: 'Mũi Né',
    moTa: 'Bãi biển thơ mộng với đồi cát trắng, suối tiên hồng và làng chài truyền thống.',
    hinhAnh: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
    loai: 'bien',
    danhGia: 4.1,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 350000, luuTru: 800000, diChuyen: 200000 },
    diaChi: 'Bình Thuận',
  },
  {
    id: '10',
    ten: 'Bà Nà Hills',
    moTa: 'Khu du lịch trên đỉnh núi với Cầu Vàng nổi tiếng, cáp treo và làng Pháp.',
    hinhAnh: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800',
    loai: 'nui',
    danhGia: 4.5,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 500000, luuTru: 1200000, diChuyen: 350000 },
    diaChi: 'Đà Nẵng',
  },
];

const STORAGE_KEYS = {
  DIEM_DEN: 'dulich_diemden',
  LICH_TRINH: 'dulich_lichtrinh',
};

/** Khởi tạo dữ liệu mẫu nếu chưa có */
const initData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DIEM_DEN)) {
    localStorage.setItem(STORAGE_KEYS.DIEM_DEN, JSON.stringify(DEFAULT_DIEM_DEN));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LICH_TRINH)) {
    localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify([]));
  }
};
initData();

// ============ ĐIỂM ĐẾN ============

export const getDiemDens = (): DuLich.DiemDen[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DIEM_DEN);
  return data ? JSON.parse(data) : [];
};

export const getDiemDenById = (id: string): DuLich.DiemDen | undefined => {
  return getDiemDens().find((d) => d.id === id);
};

export const themDiemDen = (diemDen: Omit<DuLich.DiemDen, 'id'>): DuLich.DiemDen => {
  const list = getDiemDens();
  const newItem: DuLich.DiemDen = { ...diemDen, id: generateId() };
  list.push(newItem);
  localStorage.setItem(STORAGE_KEYS.DIEM_DEN, JSON.stringify(list));
  return newItem;
};

export const suaDiemDen = (id: string, diemDen: Partial<DuLich.DiemDen>): DuLich.DiemDen | null => {
  const list = getDiemDens();
  const index = list.findIndex((d) => d.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...diemDen };
  localStorage.setItem(STORAGE_KEYS.DIEM_DEN, JSON.stringify(list));
  return list[index];
};

export const xoaDiemDen = (id: string): boolean => {
  const list = getDiemDens();
  const filtered = list.filter((d) => d.id !== id);
  if (filtered.length === list.length) return false;
  localStorage.setItem(STORAGE_KEYS.DIEM_DEN, JSON.stringify(filtered));
  return true;
};

// ============ LỊCH TRÌNH ============

export const getLichTrinhs = (): DuLich.LichTrinh[] => {
  const data = localStorage.getItem(STORAGE_KEYS.LICH_TRINH);
  return data ? JSON.parse(data) : [];
};

export const getLichTrinhById = (id: string): DuLich.LichTrinh | undefined => {
  return getLichTrinhs().find((l) => l.id === id);
};

export const themLichTrinh = (lichTrinh: Omit<DuLich.LichTrinh, 'id' | 'ngayTao'>): DuLich.LichTrinh => {
  const list = getLichTrinhs();
  const newItem: DuLich.LichTrinh = {
    ...lichTrinh,
    id: generateId(),
    ngayTao: new Date().toISOString(),
  };
  list.push(newItem);
  localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(list));
  return newItem;
};

export const suaLichTrinh = (id: string, lichTrinh: Partial<DuLich.LichTrinh>): DuLich.LichTrinh | null => {
  const list = getLichTrinhs();
  const index = list.findIndex((l) => l.id === id);
  if (index === -1) return null;
  list[index] = { ...list[index], ...lichTrinh };
  localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(list));
  return list[index];
};

export const xoaLichTrinh = (id: string): boolean => {
  const list = getLichTrinhs();
  const filtered = list.filter((l) => l.id !== id);
  if (filtered.length === list.length) return false;
  localStorage.setItem(STORAGE_KEYS.LICH_TRINH, JSON.stringify(filtered));
  return true;
};

// ============ THỐNG KÊ ============

export const getThongKe = (): DuLich.ThongKe => {
  const lichTrinhs = getLichTrinhs();
  const diemDens = getDiemDens();

  // Lịch trình theo tháng
  const thangMap: Record<string, number> = {};
  lichTrinhs.forEach((lt) => {
    const thang = lt.ngayTao.substring(0, 7); // YYYY-MM
    thangMap[thang] = (thangMap[thang] || 0) + 1;
  });

  // Tạo 6 tháng gần nhất
  const now = new Date();
  const lichTrinhTheoThang: DuLich.ThongKe['lichTrinhTheoThang'] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    lichTrinhTheoThang.push({ thang: `T${d.getMonth() + 1}/${d.getFullYear()}`, soLuong: thangMap[key] || 0 });
  }

  // Địa điểm phổ biến
  const diaDiemCount: Record<string, number> = {};
  lichTrinhs.forEach((lt) => {
    lt.ngays?.forEach((ngay) => {
      ngay.diemDens?.forEach((dd) => {
        const diemDen = diemDens.find((d) => d.id === dd.diemDenId);
        if (diemDen) {
          diaDiemCount[diemDen.ten] = (diaDiemCount[diemDen.ten] || 0) + 1;
        }
      });
    });
  });
  const diaDiemPhoBien = Object.entries(diaDiemCount)
    .map(([ten, soLuot]) => ({ ten, soLuot }))
    .sort((a, b) => b.soLuot - a.soLuot)
    .slice(0, 5);

  // Nếu chưa có data thì tạo mẫu
  if (diaDiemPhoBien.length === 0) {
    diemDens.slice(0, 5).forEach((dd, i) => {
      diaDiemPhoBien.push({ ten: dd.ten, soLuot: 10 - i * 2 });
    });
  }

  // Doanh thu theo tháng (tổng chi phí các lịch trình)
  const doanhThuMap: Record<string, number> = {};
  lichTrinhs.forEach((lt) => {
    const thang = lt.ngayTao.substring(0, 7);
    let tongChi = 0;
    lt.ngays?.forEach((ngay) => {
      ngay.diemDens?.forEach((dd) => {
        const diemDen = diemDens.find((d) => d.id === dd.diemDenId);
        if (diemDen) {
          tongChi += diemDen.chiPhi.anUong + diemDen.chiPhi.luuTru + diemDen.chiPhi.diChuyen;
        }
      });
    });
    doanhThuMap[thang] = (doanhThuMap[thang] || 0) + tongChi;
  });

  const doanhThu: DuLich.ThongKe['doanhThu'] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    doanhThu.push({ thang: `T${d.getMonth() + 1}/${d.getFullYear()}`, soTien: doanhThuMap[key] || 0 });
  }

  // Chi phí theo hạng mục
  let tongAnUong = 0;
  let tongLuuTru = 0;
  let tongDiChuyen = 0;
  lichTrinhs.forEach((lt) => {
    lt.ngays?.forEach((ngay) => {
      ngay.diemDens?.forEach((dd) => {
        const diemDen = diemDens.find((d) => d.id === dd.diemDenId);
        if (diemDen) {
          tongAnUong += diemDen.chiPhi.anUong;
          tongLuuTru += diemDen.chiPhi.luuTru;
          tongDiChuyen += diemDen.chiPhi.diChuyen;
        }
      });
    });
  });

  // Nếu chưa có data thì tạo mẫu
  if (tongAnUong === 0 && tongLuuTru === 0 && tongDiChuyen === 0) {
    tongAnUong = 5000000;
    tongLuuTru = 12000000;
    tongDiChuyen = 3500000;
  }

  const chiPhiTheoHangMuc = [
    { hangMuc: 'Ăn uống', soTien: tongAnUong },
    { hangMuc: 'Lưu trú', soTien: tongLuuTru },
    { hangMuc: 'Di chuyển', soTien: tongDiChuyen },
  ];

  return { lichTrinhTheoThang, diaDiemPhoBien, doanhThu, chiPhiTheoHangMuc };
};

/** Tính chi phí lịch trình */
export const tinhChiPhiLichTrinh = (lichTrinh: DuLich.LichTrinh) => {
  const diemDens = getDiemDens();
  let tongAnUong = 0;
  let tongLuuTru = 0;
  let tongDiChuyen = 0;
  let tongThoiGian = 0;

  lichTrinh.ngays?.forEach((ngay) => {
    ngay.diemDens?.forEach((dd) => {
      const diemDen = diemDens.find((d) => d.id === dd.diemDenId);
      if (diemDen) {
        tongAnUong += diemDen.chiPhi.anUong;
        tongLuuTru += diemDen.chiPhi.luuTru;
        tongDiChuyen += diemDen.chiPhi.diChuyen;
        tongThoiGian += diemDen.thoiGianThamQuan;
      }
    });
  });

  return {
    tongAnUong,
    tongLuuTru,
    tongDiChuyen,
    tongChi: tongAnUong + tongLuuTru + tongDiChuyen,
    tongThoiGian,
    vuotNganSach: tongAnUong + tongLuuTru + tongDiChuyen > lichTrinh.nganSachDuKien,
    soTienVuot: tongAnUong + tongLuuTru + tongDiChuyen - lichTrinh.nganSachDuKien,
  };
};
