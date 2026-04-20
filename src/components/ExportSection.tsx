import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { FileDown, FileText } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle, HeadingLevel as DocxHeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

export const ExportSection: React.FC = () => {
  const { state } = useAppContext();
  const [isExportingWord, setIsExportingWord] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const generateWord = async () => {
    setIsExportingWord(true);
    try {
      const doc = new Document({
        creator: "SKKN Master Pro",
        title: state.tenSangKien || "Sang kien kinh nghiem",
        description: "SKKN chuẩn GDPT 2018",
        styles: {
            paragraphStyles: [
                {
                    id: "Normal",
                    name: "Normal",
                    basedOn: "Normal",
                    next: "Normal",
                    run: {
                        font: "Times New Roman",
                        size: 28, // 14pt (28 half-points)
                    },
                    paragraph: {
                        spacing: { line: 360, before: 60, after: 60 }, // 1.5 line spacing (240 is 1 line, 360 is 1.5)
                        alignment: AlignmentType.JUSTIFIED,
                    },
                },
                {
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Times New Roman",
                        size: 32, // 16pt
                        bold: true,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                        alignment: AlignmentType.CENTER,
                    },
                },
                {
                    id: "Heading2",
                    name: "Heading 2",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        font: "Times New Roman",
                        size: 28,
                        bold: true,
                        color: "000000",
                    },
                    paragraph: {
                        spacing: { before: 240, after: 120 },
                    },
                }
            ]
        },
        sections: [
          // Phần 1: Mẫu 03 (Đơn yêu cầu)
          {
             properties: {
                 page: {
                     margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 } // Top, Right, Bottom = 2cm (1134 twips), Left = 3cm (1701 twips)
                 }
             },
             children: [
                new Paragraph({ children: [new TextRun({ text: "Mẫu 03", italics: true })], alignment: AlignmentType.LEFT }),
                new Paragraph({ children: [new TextRun({ text: "Đơn yêu cầu công nhận sáng kiến", italics: true })], alignment: AlignmentType.LEFT }),
                new Paragraph({ children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 28, font: "Times New Roman" })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, underline: { type: "single" } })], alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "ĐƠN YÊU CẦU CÔNG NHẬN SÁNG KIẾN", bold: true, size: 28 })], alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: `Kính gửi: ${state.coXo}`, bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "Tôi (chúng tôi) ghi tên dưới đây:" })] }),
                new Paragraph({ text: "" }),
                
                // Table of Authors
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "TT", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Họ và tên", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Ngày sinh", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Nơi công tác", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Chức danh", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Trình độ", alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "Tỷ lệ đóng góp", alignment: AlignmentType.CENTER })] }),
                            ],
                        }),
                        ...state.authors.map((a, i) => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: `${i + 1}`, alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: a.name })] }),
                                new TableCell({ children: [new Paragraph({ text: a.dob, alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: a.workplace })] }),
                                new TableCell({ children: [new Paragraph({ text: a.title })] }),
                                new TableCell({ children: [new Paragraph({ text: a.degree })] }),
                                new TableCell({ children: [new Paragraph({ text: a.contribution, alignment: AlignmentType.CENTER })] }),
                            ]
                        }))
                    ]
                }),
                
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "Là tác giả (nhóm tác giả) đề nghị xét công nhận sáng kiến:" })] }),
                new Paragraph({ children: [new TextRun({ text: state.tenSangKien, bold: true })] }),
                new Paragraph({ children: [new TextRun({ text: "- Lĩnh vực áp dụng sáng kiến: " }), new TextRun({ text: state.linhVuc })] }),
                new Paragraph({ children: [new TextRun({ text: "- Ngày sáng kiến được áp dụng lần đầu: " }), new TextRun({ text: state.ngayApDung })] }),
                new Paragraph({ children: [new TextRun({ text: "- Mô tả bản chất của sáng kiến:" })] }),
                ...state.moTaBanChat.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ children: [new TextRun({ text: "- Những thông tin cần được bảo mật (nếu có): " }), new TextRun({ text: state.thongTinBaoMat })] }),
                new Paragraph({ children: [new TextRun({ text: "- Các điều kiện cần thiết để áp dụng sáng kiến: " }), new TextRun({ text: state.dieuKienApDung })] }),
                new Paragraph({ children: [new TextRun({ text: "- Đánh giá lợi ích thu được: " })] }),
                ...state.loiIchTacGia.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "Tôi (chúng tôi) xin cam đoan mọi thông tin nêu trong đơn là trung thực, đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật." })] }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "..........., ngày ..... tháng ..... năm .....", italics: true })], alignment: AlignmentType.RIGHT }),
                new Paragraph({ children: [new TextRun({ text: "Người nộp đơn", bold: true })], alignment: AlignmentType.RIGHT }),
                new Paragraph({ children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true })], alignment: AlignmentType.RIGHT }),
             ]
          },
          // Phần 2: Báo cáo
          {
             properties: {
                 page: {
                     margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 } 
                 }
             },
             children: [
                new Paragraph({ children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 28, font: "Times New Roman" })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, underline: { type: "single" } })], alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "........., ngày ....... tháng ....... Năm ..........", italics: true })], alignment: AlignmentType.RIGHT }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "BÁO CÁO", bold: true, size: 32 })], alignment: AlignmentType.CENTER }),
                new Paragraph({ children: [new TextRun({ text: "Sáng kiến hoặc giải pháp", bold: true, size: 28 })], alignment: AlignmentType.CENTER }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: `- Tên sáng kiến: ${state.tenSangKien}` })] }),
                new Paragraph({ children: [new TextRun({ text: `- Họ và tên: ${state.authors[0]?.name || ''}` })] }),
                new Paragraph({ children: [new TextRun({ text: `- Đơn vị công tác: ${state.authors[0]?.workplace || ''}` })] }),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "I. ĐẶT VẤN ĐỀ", bold: true })], heading: DocxHeadingLevel.HEADING_2 }),
                new Paragraph({ children: [new TextRun({ text: "1. Tên sáng kiến hoặc giải pháp", bold: true })] }),
                new Paragraph({ text: state.tenSangKien }),
                new Paragraph({ children: [new TextRun({ text: "2. Sự cần thiết, mục đích của việc thực hiện sáng kiến (lý do nghiên cứu)", bold: true })] }),
                ...state.lyDoNghienCuu.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "II. NỘI DUNG SÁNG KIẾN HOẶC GIẢI PHÁP", bold: true })], heading: DocxHeadingLevel.HEADING_2 }),
                ...state.noiDungGiaiPhap.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "III. ĐÁNH GIÁ VỀ TÍNH MỚI, TÍNH HIỆU QUẢ VÀ KHẢ THI, PHẠM VI ÁP DỤNG", bold: true })], heading: DocxHeadingLevel.HEADING_2 }),
                new Paragraph({ children: [new TextRun({ text: "1. Tính mới", bold: true })] }),
                ...state.tinhMoi.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ children: [new TextRun({ text: "2. Tính hiệu quả và khả thi", bold: true })] }),
                ...state.tinhHieuQua.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ children: [new TextRun({ text: "3. Phạm vi áp dụng", bold: true })] }),
                ...state.phamViApDung.split("\n").map(l => new Paragraph({ text: l })),
                new Paragraph({ text: "" }),
                new Paragraph({ children: [new TextRun({ text: "IV. KẾT LUẬN", bold: true })], heading: DocxHeadingLevel.HEADING_2 }),
                ...state.ketLuan.split("\n").map(l => new Paragraph({ text: l })),
                
                new Paragraph({ text: "" }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE, size: 0 },
                        bottom: { style: BorderStyle.NONE, size: 0 },
                        left: { style: BorderStyle.NONE, size: 0 },
                        right: { style: BorderStyle.NONE, size: 0 },
                        insideHorizontal: { style: BorderStyle.NONE, size: 0 },
                        insideVertical: { style: BorderStyle.NONE, size: 0 },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [
                                    new Paragraph({ text: "XÁC NHẬN CỦA", bold: true, alignment: AlignmentType.CENTER }),
                                    new Paragraph({ text: "THỦ TRƯỞNG ĐƠN VỊ TRỰC TIẾP", bold: true, alignment: AlignmentType.CENTER }),
                                    new Paragraph({ text: "(Ký, ghi rõ họ tên, đóng dấu)", italics: true, alignment: AlignmentType.CENTER }),
                                ]}),
                                new TableCell({ children: [
                                    new Paragraph({ text: "Người báo cáo", bold: true, alignment: AlignmentType.CENTER }),
                                    new Paragraph({ text: "(Ký ghi rõ họ và tên)", italics: true, alignment: AlignmentType.CENTER }),
                                ]}),
                            ]
                        })
                    ]
                })
             ]
          }
        ]
      });

      const buffer = await Packer.toBlob(doc);
      saveAs(buffer, "SKKN_Ban_Chuan.docx");
    } catch (e) {
      console.error(e);
      alert("Đã xảy ra lỗi khi tạo file Word");
    }
    setIsExportingWord(false);
  };

  const generatePDF = () => {
    setIsExportingPDF(true);
    // Use an invisible div that represents the document structure roughly accurately to convert to PDF.
    // For a robust app, you would render a hidden perfectly-styled react component, but for now we simulate it.
    
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; padding: 2cm 2cm 2cm 3cm;">
         <div style="text-align: center; font-weight: bold;">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br/>
            <u>Độc lập - Tự do - Hạnh phúc</u>
         </div>
         <p style="text-align: right; font-style: italic;">........., ngày ....... tháng ....... Năm ..........</p>
         <h2 style="text-align: center;">BÁO CÁO</h2>
         <h3 style="text-align: center;">Sáng kiến hoặc giải pháp</h3>
         <p><strong>Tên sáng kiến:</strong> ${state.tenSangKien}</p>
         <p><strong>Họ và tên:</strong> ${state.authors[0]?.name || ''}</p>
         <p><strong>Đơn vị công tác:</strong> ${state.authors[0]?.workplace || ''}</p>
         
         <h4 style="font-weight: bold;">I. ĐẶT VẤN ĐỀ</h4>
         <p><strong>1. Tên sáng kiến hoặc giải pháp</strong></p>
         <p>${state.tenSangKien}</p>
         <p><strong>2. Sự cần thiết, mục đích của việc thực hiện sáng kiến (lý do nghiên cứu)</strong></p>
         <p>${state.lyDoNghienCuu.replace(/\n/g, '<br/>')}</p>

         <h4 style="font-weight: bold;">II. NỘI DUNG SÁNG KIẾN HOẶC GIẢI PHÁP</h4>
         <p>${state.noiDungGiaiPhap.replace(/\n/g, '<br/>')}</p>

         <h4 style="font-weight: bold;">III. ĐÁNH GIÁ VỀ TÍNH MỚI, TÍNH HIỆU QUẢ VÀ KHẢ THI, PHẠM VI ÁP DỤNG</h4>
         <p><strong>1. Tính mới</strong><br/>${state.tinhMoi.replace(/\n/g, '<br/>')}</p>
         <p><strong>2. Tính hiệu quả và khả thi</strong><br/>${state.tinhHieuQua.replace(/\n/g, '<br/>')}</p>
         <p><strong>3. Phạm vi áp dụng</strong><br/>${state.phamViApDung.replace(/\n/g, '<br/>')}</p>

         <h4 style="font-weight: bold;">IV. KẾT LUẬN</h4>
         <p>${state.ketLuan.replace(/\n/g, '<br/>')}</p>
      </div>
    `;

    // Append to body temporarily
    document.body.appendChild(element);

    const opt = {
      margin:       0, // Using internal padding
      filename:     'SKKN_Ban_Chuan.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'A4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
        setIsExportingPDF(false);
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-8 text-center">
      <div className="border-b border-gray-200 pb-5 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 uppercase">Xuất Bản & In Ấn</h2>
        <p className="text-sm text-gray-500 mt-2">Toàn bộ dữ liệu của thầy/cô sẽ được hệ thống gộp, tạo thành văn bản tuân thủ chính xác thể thức trình bày (Font Times New Roman, Size 14, Giãn dòng 1.5 lines, Lề chuẩn: Trái 3cm, Phải 2cm, Trên/Dưới 2cm).</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
         <button 
           onClick={generateWord}
           disabled={isExportingWord}
           className="w-80 flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
         >
           {isExportingWord ? <span className="animate-spin text-2xl">⟳</span> : <FileText size={28} />}
           <span>Xuất File Word (.docx)</span>
         </button>

         <div className="relative w-80 flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 font-medium text-sm">HOẶC</span>
            <div className="flex-grow border-t border-gray-300"></div>
         </div>

         <button 
           onClick={generatePDF}
           disabled={isExportingPDF}
           className="w-80 flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
         >
           {isExportingPDF ? <span className="animate-spin text-2xl">⟳</span> : <FileDown size={28} />}
           <span>Xuất File PDF (.pdf)</span>
         </button>
      </div>

      <div className="mt-12 bg-indigo-50 rounded-lg p-6 text-left shadow-inner border border-indigo-100">
         <h4 className="font-semibold text-indigo-800 text-lg mb-3">Lưu ý quan trọng trước khi xuất:</h4>
         <ul className="list-disc list-inside text-indigo-700 space-y-2 text-sm">
            <li>Hệ thống sẽ kết hợp <strong>Đơn Yêu Cầu Công Nhận (Mẫu 03)</strong> và <strong>Báo Cáo Giải Pháp</strong> thành 1 file duy nhất tiện lợi nộp cho hội đồng.</li>
            <li>Biểu đồ ở mục Xử lý số liệu (nếu có vẽ ngoài đời thực) sẽ cần phải Copy/Paste thủ công từ Word hoặc vẽ lại dựa trên số liệu vì HTML to Word Chart là phức tạp.</li>
            <li>Sau khi tải file Word về, thầy/cô vui lòng kiểm tra và hiệu chỉnh lại phần ngày tháng, chữ ký trước khi nộp.</li>
         </ul>
      </div>
    </div>
  );
};
