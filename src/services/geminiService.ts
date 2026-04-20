import { GoogleGenAI } from '@google/genai';

// Initialize the API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export const checkSKKNText = async (text: string) => {
  if (!text || text.trim().length < 20) {
    throw new Error('Văn bản quá ngắn');
  }

  const prompt = `
Bạn là một chuyên gia giáo dục tiểu học và chuyên viên kiểm định chất lượng Sáng kiến kinh nghiệm.
Hãy phân tích đoạn văn bản sau, được dùng trong Sáng kiến kinh nghiệm (theo chương trình GDPT 2018):

<TEXT>
${text}
</TEXT>

Nhiệm vụ của bạn:
1. Xác định tỉ lệ % ước tính văn bản này có khả năng là văn mẫu sáo rỗng hoặc cóp nhặt trên mạng (trả về 1 con số nguyên từ 0 đến 100).
2. Viết 1 nhận xét ngắn (tối đa 40 chữ) đánh giá chất lượng văn phong sư phạm của đoạn văn.
3. Cung cấp 2-3 đề xuất sửa đổi từ ngữ (tìm những từ ngữ đời thường, thiếu trang trọng, hoặc quá cũ) thành từ ngữ chuẩn sư phạm hiện đại.

Trả về kết quả DƯỚI DẠNG JSON TUYỆT ĐỐI CHÍNH XÁC với cấu trúc sau (không có markdown code block, chỉ nội dung JSON raw):
{
  "plagiarism": number,
  "message": "chuỗi nhận xét",
  "suggestions": [
     { "original": "cụm từ cũ", "replacement": "cụm từ mới" }
  ]
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
      }
    });

    const output = response.text || '';
    
    let jsonStr = output.trim();
    if (jsonStr.startsWith('```')) {
      const lines = jsonStr.split('\n');
      lines.shift();
      if (lines[lines.length - 1].startsWith('```')) {
          lines.pop();
      }
      jsonStr = lines.join('\n');
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const analyzeDocumentForSKKN = async (text: string) => {
  if (!text || text.trim().length < 50) {
    throw new Error('Nội dung file quá ngắn hoặc không có text hợp lệ.');
  }

  // Truncate text to avoid hitting token limits for very large files, analyzing the first 20000 characters is usually enough for context
  const truncatedText = text.substring(0, 20000);

  const prompt = `
Bạn là chuyên gia giáo dục tiểu học thiết kế Sáng kiến kinh nghiệm (Chương trình GDPT 2018).
Dưới đây là nội dung tài liệu mà giáo viên tải lên (có thể là giáo án, số liệu, bài giảng, bài tham luận...):

<DOCUMENT_CONTENT>
${truncatedText}
</DOCUMENT_CONTENT>

Dựa trên ngữ liệu này, hãy TỔNG HỢP và GỢI Ý các nội dung cốt lõi để điền vào Form Sáng kiến kinh nghiệm (theo chuẩn bộ sách Chân trời sáng tạo nếu phù hợp). 
Hãy suy luận và viết 1 cách chuyên nghiệp, logic.
Trả về DƯỚI DẠNG JSON TUYỆT ĐỐI CHÍNH XÁC với cấu trúc sau (không có markdown code block, chỉ nội dung JSON raw):
{
  "tenSangKien": "Gợi ý 1 tên Sáng kiến kinh nghiệm thật hay, bám sát nội dung, khoảng 15-25 từ.",
  "linhVuc": "Gợi ý lĩnh vực (VD: Phương pháp dạy học Toán lớp 3, Công tác chủ nhiệm...)",
  "moTaBanChat": "Tóm tắt ngắn gọn mô tả bản chất sáng kiến từ tài liệu trên (3-4 câu).",
  "lyDoNghienCuu": "Viết 1 đoạn Văn phong sư phạm giải thích lý do chọn đề tài dựa trên dữ liệu từ tài liệu (thực trạng, khó khăn).",
  "noiDungGiaiPhap": "Trình bày 2-3 biện pháp cụ thể rút ra từ tài liệu. Viết thành các gạch đầu dòng rõ ràng.",
  "tinhMoi": "Điểm mới của giải pháp này là gì?",
  "tinhHieuQua": "Đề xuất cách đánh giá hiệu quả (hoặc lấy trực tiếp kết quả nếu trong tài liệu có đề cập)."
}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      }
    });

    const output = response.text || '';
    
    let jsonStr = output.trim();
    if (jsonStr.startsWith('```')) {
      const lines = jsonStr.split('\n');
      lines.shift();
      if (lines[lines.length - 1].startsWith('```')) {
          lines.pop();
      }
      jsonStr = lines.join('\n');
    }
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Analyze Error:", error);
    throw error;
  }
};

export const chatWithSKKNExpert = async (messageHistory: { role: 'user' | 'model', content: string }[], newMessage: string) => {
  const contents = messageHistory.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  contents.push({
    role: 'user',
    parts: [{ text: newMessage }]
  });

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: "Bạn là chuyên gia giáo dục tiểu học tại Việt Nam, am hiểu sâu sắc CT GDPT 2018 và bộ sách Chân trời sáng tạo. Hãy xưng hô 'tôi' và 'thầy/cô'. Trả lời ngắn gọn, súc tích, truyền cảm hứng và giúp đỡ giáo viên tháo gỡ khó khăn khi viết Sáng kiến kinh nghiệm. Bạn có thể gợi ý cả tên đề tài, cách đặt vấn đề nếu được yêu cầu.",
          temperature: 0.5,
        }
    });
  
    return response.text || "Tôi chưa rõ ý thầy/cô lắm, xin vui lòng nói cụ thể hơn!";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error('Xin lỗi, hệ thống AI đang quá tải. Thầy/cô hãy thử lại sau ít phút nhé!');
  }
};
