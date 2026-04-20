import React, { useState } from 'react';
import { PenTool, FileText, CheckCircle, BarChart3, Settings, Download, UploadCloud } from 'lucide-react';
import { UploadSection } from './UploadSection';
import { DonYeuCauForm } from './DonYeuCauForm';
import { BaoCaoForm } from './BaoCaoForm';
import { ChartSection } from './ChartSection';
import { AiChecker } from './AiChecker';
import { ExportSection } from './ExportSection';
import { ChatBox } from './ChatBox';

type Tab = 'upload' | 'don' | 'baocao' | 'chart' | 'ai' | 'export';

export const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  return (
    <div className="flex h-screen bg-gray-50 flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2 text-indigo-600">
          <PenTool className="h-6 w-6" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            SKKN Master Pro (CT 2018)
          </h1>
        </div>
        <div className="flex space-x-4 text-sm font-medium text-gray-500">
          <span>Công cụ hỗ trợ viết Sáng kiến kinh nghiệm chuyên nghiệp</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col pt-4 shrink-0">
          <nav className="flex-1 space-y-1 px-4">
            <NavItem 
              active={activeTab === 'upload'} 
              onClick={() => setActiveTab('upload')} 
              icon={<UploadCloud size={18} />} 
              label="0. Phân tích ngữ liệu" 
            />
            <NavItem 
              active={activeTab === 'don'} 
              onClick={() => setActiveTab('don')} 
              icon={<FileText size={18} />} 
              label="1. Đơn yêu cầu (Mẫu 03)" 
            />
            <NavItem 
              active={activeTab === 'baocao'} 
              onClick={() => setActiveTab('baocao')} 
              icon={<FileText size={18} />} 
              label="2. Báo cáo SKKN" 
            />
            <NavItem 
              active={activeTab === 'chart'} 
              onClick={() => setActiveTab('chart')} 
              icon={<BarChart3 size={18} />} 
              label="3. Xử lý biểu đồ số liệu" 
            />
            <NavItem 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')} 
              icon={<CheckCircle size={18} />} 
              label="4. AI Quét lỗi & Trùng lặp" 
            />
            <div className="pt-8 pb-2">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Kết xuất & Lưu trữ
              </p>
            </div>
            <NavItem 
              active={activeTab === 'export'} 
              onClick={() => setActiveTab('export')} 
              icon={<Download size={18} />} 
              label="5. Xuất file Word / PDF" 
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 relative">
          <div className="max-w-5xl mx-auto pb-20">
            {activeTab === 'upload' && <UploadSection />}
            {activeTab === 'don' && <DonYeuCauForm />}
            {activeTab === 'baocao' && <BaoCaoForm />}
            {activeTab === 'chart' && <ChartSection />}
            {activeTab === 'ai' && <AiChecker />}
            {activeTab === 'export' && <ExportSection />}
          </div>
        </main>
      </div>

      <ChatBox />
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
        active 
          ? 'bg-indigo-50 text-indigo-700' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <span className={active ? 'text-indigo-600' : 'text-gray-400'}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};
