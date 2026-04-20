import React from 'react';
import { useAppContext } from '../AppContext';

export const BaoCaoForm: React.FC = () => {
  const { state, updateState } = useAppContext();

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase">Báo Cáo Sáng Kiến (Nội Dung Chính)</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-indigo-700 mb-1">I. Đặt Vấn Đề (Lý do chọn đề tài)</label>
          <p className="text-xs text-gray-500 mb-2">Phân tích thực trạng, khó khăn khi dạy theo CT 2018 và lý do dẫn đến sáng kiến này.</p>
          <textarea 
            rows={5}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={state.lyDoNghienCuu}
            onChange={(e) => updateState({ lyDoNghienCuu: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-indigo-700 mb-1">II. Nội Dung Sáng Kiến (Biện pháp thực hiện)</label>
          <p className="text-xs text-gray-500 mb-2">Chi tiết các biện pháp, ví dụ cụ thể bám sát sách Chân trời sáng tạo.</p>
          <textarea 
            rows={10}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={state.noiDungGiaiPhap}
            onChange={(e) => updateState({ noiDungGiaiPhap: e.target.value })}
          />
        </div>

        <div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="text-sm font-semibold text-indigo-700 mb-4">III. Đánh giá về tính mới, tính hiệu quả và khả thi, phạm vi</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">1. Tính mới</label>
                <textarea 
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={state.tinhMoi}
                  onChange={(e) => updateState({ tinhMoi: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">2. Tính hiệu quả và khả thi (Có thể kết hợp với Biểu đồ ở mục 3)</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={state.tinhHieuQua}
                  onChange={(e) => updateState({ tinhHieuQua: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">3. Phạm vi áp dụng</label>
                <textarea 
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={state.phamViApDung}
                  onChange={(e) => updateState({ phamViApDung: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-indigo-700 mb-1">IV. Kết Luận</label>
           <textarea 
             rows={3}
             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
             value={state.ketLuan}
             onChange={(e) => updateState({ ketLuan: e.target.value })}
           />
        </div>
      </div>
    </div>
  );
};
