import React, { useState, useRef } from 'react';
import { Upload, FileText, FileSpreadsheet, Loader2, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { analyzeDocumentForSKKN } from '../services/geminiService';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';

// Setting up pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const UploadSection: React.FC = () => {
  const { state, updateState } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [errorStatus, setErrorStatus] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const extractWord = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject('Lỗi khi đọc file Word.');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const extractExcel = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                let fullText = '';
                workbook.SheetNames.forEach(sheetName => {
                    const sheet = workbook.Sheets[sheetName];
                    fullText += `[Sheet: ${sheetName}]\n`;
                    fullText += XLSX.utils.sheet_to_txt(sheet) + '\n\n';
                });
                resolve(fullText);
            } catch (error) {
                reject('Lỗi khi đọc file Excel.');
            }
        };
        reader.readAsArrayBuffer(file);
    });
  };

  const extractPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument(typedarray).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                resolve(fullText);
            } catch (error) {
                reject('Lỗi khi đọc file PDF. File có thể bị mã hóa hoặc định dạng không hỗ trợ.');
            }
        };
        reader.readAsArrayBuffer(file);
    });
  };

  const processFile = async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setAiSuggestions(null);
    setErrorStatus('');
    setExtractedText('');

    try {
      let text = '';
      const lowerName = file.name.toLowerCase();
      
      if (lowerName.endsWith('.docx')) {
          text = await extractWord(file);
      } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
          text = await extractExcel(file);
      } else if (lowerName.endsWith('.pdf')) {
          text = await extractPDF(file);
      } else {
          throw new Error('Định dạng file không được hỗ trợ. Vui lòng chọn .docx, .pdf, hoặc .xlsx');
      }

      setExtractedText(text);

      if (text.length < 50) {
          throw new Error('Nội dung file quá ngắn hoặc không thể trích xuất được văn bản (có thể là file ảnh nén).');
      }

      // Send to AI for Analysis
      const suggestions = await analyzeDocumentForSKKN(text);
      setAiSuggestions(suggestions);

    } catch (err: any) {
        setErrorStatus(err.message || 'Có lỗi xảy ra khi xử lý file.');
    } finally {
        setIsProcessing(false);
    }
  };

  const applySuggestions = () => {
      if (!aiSuggestions) return;

      updateState({
          tenSangKien: aiSuggestions.tenSangKien || state.tenSangKien,
          linhVuc: aiSuggestions.linhVuc || state.linhVuc,
          moTaBanChat: aiSuggestions.moTaBanChat || state.moTaBanChat,
          lyDoNghienCuu: aiSuggestions.lyDoNghienCuu || state.lyDoNghienCuu,
          noiDungGiaiPhap: aiSuggestions.noiDungGiaiPhap || state.noiDungGiaiPhap,
          tinhMoi: aiSuggestions.tinhMoi || state.tinhMoi,
          tinhHieuQua: aiSuggestions.tinhHieuQua || state.tinhHieuQua,
      });

      alert('Đã đồng bộ Gợi ý từ AI vào Form nhập liệu thành công! Thầy/cô có thể chuyển sang Tab 1 và 2 để kiểm tra.');
  };

  return (
    <div className="bg-white shadow rounded-lg p-8">
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center uppercase">Phân Tích Ngữ Liệu Bằng AI</h2>
        <p className="text-center text-sm text-gray-500 mt-2">
            Tải lên tài liệu gốc (Giáo án Word, Bài tập PDF, Bảng điểm Excel...). AI sẽ đọc, phân tích và tự động viết phác thảo toàn bộ Sáng kiến kinh nghiệm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-gray-100"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".docx, .pdf, .xlsx, .xls"
                onChange={handleChange}
              />
              <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex space-x-4 text-gray-400">
                    <FileText size={40} className="text-blue-500" />
                    <FileSpreadsheet size={40} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">Kéo thả file vào đây</p>
                    <p className="text-sm text-gray-500 mt-1">hoặc <button onClick={() => fileInputRef.current?.click()} className="text-indigo-600 font-semibold hover:underline border-none bg-transparent cursor-pointer">duyệt trên máy</button></p>
                  </div>
                  <p className="text-xs text-gray-400">Hỗ trợ: PDF, Word (.docx), Excel (.xlsx)</p>
              </div>
            </div>

            {isProcessing && (
                <div className="mt-6 flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
                    <p className="text-sm font-medium text-indigo-800">Đang đọc tài liệu và phân tích AI...</p>
                    <p className="text-xs text-indigo-600 mt-1">Tiến trình này có thể mất 10-15 giây tùy vào độ lớn của file.</p>
                </div>
            )}

            {errorStatus && (
                <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm">
                    {errorStatus}
                </div>
            )}

            {!isProcessing && !errorStatus && fileName && (
                <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 flex items-center shadow-sm">
                    <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">Đã đọc nội dung: {fileName}</p>
                    </div>
                </div>
            )}
          </div>

          {/* AI Output Area */}
          <div>
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <ChevronRight className="h-5 w-5 text-indigo-500 mr-2" />
                Kết quả tổng hợp từ AI
             </h3>

             {!aiSuggestions ? (
                 <div className="h-64 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                     <p className="text-gray-400 text-sm text-center px-8">
                         Tải file lên để AI quét và xây dựng cấu trúc Sáng kiến kinh nghiệm tự động dựa trên dữ liệu thật của thầy/cô.
                     </p>
                 </div>
             ) : (
                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                     <div className="bg-white border text-sm border-gray-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-semibold text-indigo-700 mb-1">💡 Tên đề tài gợi ý:</h4>
                         <p className="text-gray-800">{aiSuggestions.tenSangKien}</p>
                     </div>
                     <div className="bg-white border text-sm border-gray-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-semibold text-indigo-700 mb-1">📖 Lĩnh vực & Bản chất:</h4>
                         <p className="text-gray-800"><span className="font-medium">Lĩnh vực:</span> {aiSuggestions.linhVuc}</p>
                         <p className="text-gray-800 mt-2"><span className="font-medium">Bản chất:</span> {aiSuggestions.moTaBanChat}</p>
                     </div>
                     <div className="bg-white border text-sm border-gray-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-semibold text-indigo-700 mb-1">🎯 Lý do nghiên cứu (Thực trạng):</h4>
                         <p className="text-gray-800">{aiSuggestions.lyDoNghienCuu}</p>
                     </div>
                     <div className="bg-white border text-sm border-gray-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-semibold text-indigo-700 mb-1">🛠️ Biện pháp giải quyết:</h4>
                         <div className="text-gray-800 whitespace-pre-wrap">{aiSuggestions.noiDungGiaiPhap}</div>
                     </div>
                     <div className="bg-white border text-sm border-gray-200 rounded-lg p-4 shadow-sm">
                         <h4 className="font-semibold text-indigo-700 mb-1">✨ Tính mới & Hiệu quả:</h4>
                         <p className="text-gray-800"><span className="font-medium">Tính mới:</span> {aiSuggestions.tinhMoi}</p>
                         <p className="text-gray-800 mt-2"><span className="font-medium">Đánh giá hiệu quả:</span> {aiSuggestions.tinhHieuQua}</p>
                     </div>
                     
                     <div className="sticky bottom-0 pt-4 bg-gray-50 w-full flex justify-end">
                         <button onClick={applySuggestions} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium shadow-md transition-transform active:scale-95">
                             <Download size={18} />
                             <span>Áp dụng toàn bộ vào Form</span>
                         </button>
                     </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
};
