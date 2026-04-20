import React from 'react';
import { useAppContext } from '../AppContext';
import { Plus, Trash2 } from 'lucide-react';

export const DonYeuCauForm: React.FC = () => {
  const { state, updateState } = useAppContext();

  const handleAuthorChange = (id: string, field: string, value: string) => {
    const updatedAuthors = state.authors.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    );
    updateState({ authors: updatedAuthors });
  };

  const addAuthor = () => {
    updateState({
      authors: [
        ...state.authors, 
        { id: Date.now().toString(), name: '', dob: '', workplace: '', title: '', degree: '', contribution: '' }
      ]
    });
  };

  const removeAuthor = (id: string) => {
    if (state.authors.length > 1) {
      updateState({ authors: state.authors.filter(a => a.id !== id) });
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase">Đơn Yêu Cầu Công Nhận Sáng Kiến</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kính gửi (Cơ sở yêu cầu công nhận)</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="VD: Hội đồng sáng kiến Quận/Huyện..."
              value={state.coXo}
              onChange={(e) => updateState({ coXo: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên sáng kiến</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="VD: Sử dụng sơ đồ tư duy..."
              value={state.tenSangKien}
              onChange={(e) => updateState({ tenSangKien: e.target.value })}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Tác giả (Nhóm tác giả)</label>
            <button onClick={addAuthor} className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 hover:text-indigo-800">
              <Plus size={14} /> <span>Thêm tác giả</span>
            </button>
          </div>
          
          <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Họ và tên</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nơi công tác</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chức danh / Trình độ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Đóng góp (%)</th>
                  <th className="px-1 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.authors.map((author) => (
                  <tr key={author.id}>
                    <td className="px-3 py-2"><input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm" value={author.name} onChange={e => handleAuthorChange(author.id, 'name', e.target.value)} /></td>
                    <td className="px-3 py-2"><input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm" placeholder="dd/mm/yyyy" value={author.dob} onChange={e => handleAuthorChange(author.id, 'dob', e.target.value)} /></td>
                    <td className="px-3 py-2"><input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm" value={author.workplace} onChange={e => handleAuthorChange(author.id, 'workplace', e.target.value)} /></td>
                    <td className="px-3 py-2">
                       <input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm mb-1" placeholder="Chức danh" value={author.title} onChange={e => handleAuthorChange(author.id, 'title', e.target.value)} />
                       <input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm" placeholder="Trình độ" value={author.degree} onChange={e => handleAuthorChange(author.id, 'degree', e.target.value)} />
                    </td>
                    <td className="px-3 py-2"><input type="text" className="w-full border-gray-300 border rounded py-1 px-2 text-sm" value={author.contribution} onChange={e => handleAuthorChange(author.id, 'contribution', e.target.value)} /></td>
                    <td className="px-1 py-2 text-center text-red-500 cursor-pointer" onClick={() => removeAuthor(author.id)}><Trash2 size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực áp dụng</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="VD: Phương pháp dạy học, Công tác chủ nhiệm..."
              value={state.linhVuc}
              onChange={(e) => updateState({ linhVuc: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày áp dụng lần đầu</label>
            <input 
              type="text" 
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="dd/mm/yyyy"
              value={state.ngayApDung}
              onChange={(e) => updateState({ ngayApDung: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả bản chất của sáng kiến</label>
          <p className="text-xs text-gray-500 mb-2">Mô tả ngắn gọn nội dung đã cải tiến, khắc phục nhược điểm của giải pháp cũ.</p>
          <textarea 
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={state.moTaBanChat}
            onChange={(e) => updateState({ moTaBanChat: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thông tin cần bảo mật (Nếu có)</label>
            <textarea 
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={state.thongTinBaoMat}
              onChange={(e) => updateState({ thongTinBaoMat: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điều kiện cần thiết để áp dụng</label>
            <textarea 
              rows={2}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={state.dieuKienApDung}
              onChange={(e) => updateState({ dieuKienApDung: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá lợi ích thu được (Theo ý kiến tác giả)</label>
          <textarea 
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={state.loiIchTacGia}
            onChange={(e) => updateState({ loiIchTacGia: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
