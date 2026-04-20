import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithSKKNExpert } from '../services/geminiService';

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
      { role: 'model', content: 'Xin chào thầy/cô! Tôi là Trợ lý AI chuyên môn về CT GDPT 2018 (sách Chân trời sáng tạo). Thầy/cô đang gặp khó khăn gì trong việc viết Sáng kiến kinh nghiệm ạ?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
      if (!inputValue.trim()) return;

      const userMsg = inputValue.trim();
      setInputValue('');
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setIsTyping(true);

      try {
          // Pass history excluding the very first greeting (optional, but passing all is fine)
          const reply = await chatWithSKKNExpert(messages, userMsg);
          setMessages(prev => [...prev, { role: 'model', content: reply }]);
      } catch (error: any) {
          setMessages(prev => [...prev, { role: 'model', content: error.message || 'Lỗi kết nối. Thầy/cô vui lòng thử lại sau.' }]);
      } finally {
          setIsTyping(false);
      }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
      }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-2xl transition-transform hover:scale-110 flex items-center justify-center group"
        >
          <MessageCircleQuestion className="w-7 h-7" />
          {/* Tooltip */}
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-full after:border-4 after:border-transparent after:border-l-gray-800">
             Hỏi - Đáp cùng Chuyên gia AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between shadow-md z-10 shrink-0">
                <div className="flex items-center space-x-2 text-white">
                    <MessageCircleQuestion className="w-5 h-5" />
                    <h3 className="font-semibold">HỎI - ĐÁP CHUYÊN GIA</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-indigo-100 hover:text-white transition-colors p-1 rounded-md hover:bg-indigo-500"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Chat History */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mr-2 border border-indigo-200">
                                <Bot className="w-5 h-5 text-indigo-600" />
                            </div>
                        )}
                        
                        <div 
                           className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                               msg.role === 'user' 
                               ? 'bg-indigo-600 text-white rounded-br-none shadow-sm' 
                               : 'bg-white text-gray-800 rounded-bl-none shadow border border-gray-100 whitespace-pre-wrap'
                           }`}
                        >
                            {msg.content}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 ml-2 border border-gray-300">
                                <User className="w-5 h-5 text-gray-600" />
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mr-2 border border-indigo-200">
                            <Bot className="w-5 h-5 text-indigo-600" />
                         </div>
                         <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow border border-gray-100 flex items-center space-x-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                             <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                             <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                         </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white px-4 py-3 border-t border-gray-200 shrink-0">
                <div className="relative flex items-end">
                    <textarea 
                        className="w-full bg-gray-100 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={2}
                        placeholder="Thầy/cô cần hỏi gì ạ? (Nhấn Enter để gửi)"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 bottom-2 p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
};
