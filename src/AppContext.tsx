import React, { createContext, useContext, useState } from 'react';

export interface AuthorInfo {
  id: string;
  name: string;
  dob: string;
  workplace: string;
  title: string;
  degree: string;
  contribution: string;
}

export interface AppState {
  // Đơn yêu cầu
  coXo: string;
  coXoDiaChi: string;
  tenSangKien: string;
  linhVuc: string;
  ngayApDung: string;
  moTaBanChat: string;
  thongTinBaoMat: string;
  dieuKienApDung: string;
  loiIchTacGia: string;
  loiIchToChuc: string;
  authors: AuthorInfo[];
  
  // Báo cáo SKKN
  lyDoNghienCuu: string;
  noiDungGiaiPhap: string;
  tinhMoi: string;
  tinhHieuQua: string;
  phamViApDung: string;
  ketLuan: string;

  // Biểu đồ / Số liệu
  chartData: Array<{ name: string; htt: number; ht: number; cht: number }>;
  chartType: 'bar' | 'pie' | 'line';
}

const initialState: AppState = {
  coXo: '',
  coXoDiaChi: '',
  tenSangKien: '',
  linhVuc: '',
  ngayApDung: '',
  moTaBanChat: '',
  thongTinBaoMat: '',
  dieuKienApDung: '',
  loiIchTacGia: '',
  loiIchToChuc: '',
  authors: [{ id: '1', name: '', dob: '', workplace: '', title: '', degree: '', contribution: '100%' }],
  lyDoNghienCuu: '',
  noiDungGiaiPhap: '',
  tinhMoi: '',
  tinhHieuQua: '',
  phamViApDung: '',
  ketLuan: '',
  chartData: [
    { name: 'Trước áp dụng', htt: 8, ht: 15, cht: 12 },
    { name: 'Sau áp dụng', htt: 18, ht: 15, cht: 2 }
  ],
  chartType: 'bar'
};

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateState: (updates: Partial<AppState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ state, setState, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
