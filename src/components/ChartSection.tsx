import React from 'react';
import { useAppContext } from '../AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#ef4444']; // HTT: Green, HT: Blue, CHT: Red

export const ChartSection: React.FC = () => {
  const { state, updateState } = useAppContext();

  const handleDataChange = (index: number, field: string, value: string) => {
    const newData = [...state.chartData];
    newData[index] = { ...newData[index], [field]: Number(value) || 0 };
    updateState({ chartData: newData });
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase">Xử Lý Số Liệu & Biểu Đồ Minh Họa</h2>
        <p className="text-center text-sm text-gray-500 mt-2">Nhập số liệu khảo sát theo Thông tư 27 để phần mềm tự động tạo biểu đồ cho Báo cáo.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bảng Số Liệu Khảo Sát</h3>
          
          <div className="space-y-4">
             {state.chartData.map((data, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <h4 className="font-medium text-sm text-indigo-600 mb-3">{data.name}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hoàn thành tốt (HTT)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-md border border-emerald-300 px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                        value={data.htt}
                        onChange={(e) => handleDataChange(index, 'htt', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Hoàn thành (HT)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-md border border-blue-300 px-3 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                        value={data.ht}
                        onChange={(e) => handleDataChange(index, 'ht', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Chưa hoàn thành (CHT)</label>
                      <input 
                        type="number" 
                        className="w-full rounded-md border border-red-300 px-3 py-1.5 text-sm focus:ring-red-500 focus:border-red-500"
                        value={data.cht}
                        onChange={(e) => handleDataChange(index, 'cht', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
             ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn dạng biểu đồ</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={state.chartType === 'bar'} onChange={() => updateState({ chartType: 'bar' })} className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm">Biểu đồ Cột (Khuyên dùng)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={state.chartType === 'pie'} onChange={() => updateState({ chartType: 'pie' })} className="text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm">Biểu đồ Tròn</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Hình Ảnh Biểu Đồ (Review)</h3>
          <div id="chart-export-container" className="h-80 w-full border border-gray-200 rounded-md bg-white p-4 flex items-center justify-center">
            {state.chartType === 'bar' ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={state.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="htt" name="Hoàn thành tốt" fill="#10b981" />
                  <Bar dataKey="ht" name="Hoàn thành" fill="#3b82f6" />
                  <Bar dataKey="cht" name="Chưa hoàn thành" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full flex justify-around">
                 {state.chartData.map((d, i) => {
                   const data = [
                     { name: 'HTT', value: d.htt },
                     { name: 'HT', value: d.ht },
                     { name: 'CHT', value: d.cht },
                   ];
                   return (
                     <div key={i} className="flex flex-col items-center">
                       <h5 className="text-xs font-semibold">{d.name}</h5>
                       <PieChart width={150} height={150}>
                         <Pie data={data} cx="50%" cy="50%" innerRadius={30} outerRadius={60} fill="#8884d8" dataKey="value">
                           {data.map((entry, idx) => (
                             <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                           ))}
                         </Pie>
                       </PieChart>
                     </div>
                   );
                 })}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">* Biểu đồ này sẽ tự động được chèn vào phần Đánh giá hiệu quả khi Xuất File Word/PDF.</p>
        </div>
      </div>
    </div>
  );
};
