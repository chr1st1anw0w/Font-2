import React from 'react';

interface TopBarProps {
  toggleAiSidebar: () => void;
  isAiSidebarOpen: boolean;
  onImport: () => void;
  onExport: () => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  toggleTexturePanel?: () => void;
  showTexturePanel?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleAiSidebar, isAiSidebarOpen, onImport, onExport, showGrid, setShowGrid, toggleTexturePanel, showTexturePanel = false }) => {
  const menuItems = ['File', 'Edit', 'View'];
  const actionIconClass = "p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors cursor-pointer";

  return (
    <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 select-none relative z-10">
      {/* Left: Menus & Actions */}
      <div className="flex items-center space-x-6">
        {/* Menus */}
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          {menuItems.map(item => (
            <div key={item} className="hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-gray-800">
              {item}
            </div>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-700 mx-2"></div>

        {/* Global Operations (Icons) */}
        <div className="flex items-center space-x-1">
          {/* Import */}
          <button className={actionIconClass} title="Import Image" onClick={onImport}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>

          <div className="w-2"></div>

          {/* Undo */}
          <button className={actionIconClass} title="Undo">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          {/* Redo */}
          <button className={actionIconClass} title="Redo">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 3.7"/></svg>
          </button>
          <div className="w-4"></div>
           {/* Grid Toggle */}
           <button className={`${actionIconClass} ${showGrid ? 'text-indigo-400 bg-indigo-500/10' : ''}`} title="Toggle Grid" onClick={() => setShowGrid(!showGrid)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          </button>
           {/* Share/Export */}
           <button className={actionIconClass} title="Export" onClick={onExport}>
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>

          <div className="w-2"></div>

          {/* Texture Tool */}
          {toggleTexturePanel && (
            <button
              className={`${actionIconClass} ${showTexturePanel ? 'text-purple-400 bg-purple-500/10' : ''}`}
              title="Texture Generator"
              onClick={toggleTexturePanel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="2"/><circle cx="16" cy="8" r="2"/><circle cx="12" cy="16" r="2"/><circle cx="8" cy="16" r="2"/><circle cx="16" cy="16" r="2"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right: AI & User */}
      <div className="flex items-center space-x-4">
        <button
            onClick={toggleAiSidebar}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${isAiSidebarOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-white'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/><path d="M12 12 2.1 12a10 10 0 0 1 9.9-10V12Z" opacity="0.5"/></svg>
            <span className="text-sm font-medium">AI Assistant</span>
        </button>

        {/* Avatar */}
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5 cursor-pointer">
            <img className="h-full w-full rounded-full bg-gray-900" src="https://picsum.photos/seed/user/64/64" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;