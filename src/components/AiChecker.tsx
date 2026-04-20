import React, { useState } from 'react';
import { Search, SpellCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { checkSKKNText } from '../services/geminiService';

export const AiChecker: React.FC = () => {
  const [textToCheck, setTextToCheck] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    setResult(null);
    try {
      if (textToCheck.length < 50) {
        setResult({
          status: 'warning',
          message: 'Đoạn văn quá ngắn. Vui lòng nhập tối thiểu 50 ký tự để AI có thể phân tích.',
          plagiarism: 0,
        });
      } else {
        const aiResult = await checkSKKNText(textToCheck);
        setResult({
          status: aiResult.plagiarism > 30 ? 'warning' : 'success',
          message: aiResult.message,
          plagiarism: aiResult.plagiarism,
          suggestions: aiResult.suggestions
        });
      }
    } catch (error) {
       console.error("Lỗi AI:", error);
       setResult({
          status: 'warning',
          message: 'Hệ thống AI đang bận hoặc quá tải. Hãy thử lại mô phỏng bên dưới.',
          plagiarism: 0,
       });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase">Trợ lý AI - Soát Lỗi & Quét Trùng Lặp</h2>
        <p className="text-center text-sm text-gray-500 mt-2">Dán đoạn văn bản Nháp của thầy/cô vào đây, AI sẽ hỗ trợ "chuốt" lại văn phong sư phạm và kiểm tra tính nguyên bản (Anti-Plagiarism).</p>
      </div>

      <div className="space-y-4">
        <textarea
          rows={10}
          className="w-full rounded-md border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner bg-slate-50"
          placeholder="Dán đoạn văn bản (Lý do chọn đề tài, Biện pháp, Đánh giá...) vào đây để hệ thống tự động nhận diện và phân tích..."
          value={textToCheck}
          onChange={(e) => setTextToCheck(e.target.value)}
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleCheck}
            disabled={isChecking || !textToCheck}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50"
          >
            {isChecking ? <span className="animate-spin mr-2">⟳</span> : <Search size={18} />}
            <span>Quét Sâu (Deep Scan)</span>
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-5 rounded-md border ${result.status === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                {result.status === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600"/> : <AlertTriangle className="h-5 w-5 text-amber-600"/>}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${result.status === 'success' ? 'text-emerald-800' : 'text-amber-800'}`}>
                  Kết quả phân tích:
                </h3>
                <div className={`mt-2 text-sm ${result.status === 'success' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.message}
                </div>
                
                {result.status === 'success' && (
                  <div className="mt-4 border-t border-emerald-200 pt-4">
                    <div className="flex items-center mb-2">
                       <span className="font-semibold text-sm text-gray-700 mr-2">Tỉ lệ trùng lặp trên Internet (Plagiarism): </span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold ${result.plagiarism < 20 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                         {result.plagiarism}%
                       </span>
                       <span className="text-xs text-gray-500 ml-2">(An toàn &lt; 30%)</span>
                    </div>

                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="mt-3">
                         <span className="font-semibold text-sm text-gray-700 flex items-center"><SpellCheck size={16} className="mr-1" /> Đề xuất nâng cấp từ vựng (Chuốt lời văn):</span>
                         <ul className="mt-2 text-sm space-y-1 list-disc list-inside">
                           {result.suggestions.map((s: any, i: number) => (
                             <li key={i}>Đổi <span className="text-red-500 italic">"{s.original}"</span> ➔ <span className="text-green-600 font-medium">"{s.replacement}"</span></li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
