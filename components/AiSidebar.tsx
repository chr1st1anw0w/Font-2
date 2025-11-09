import React, { useState, useCallback } from 'react';
import { AspectRatio, AiChatMessage } from '../types';
import { generateImage, editImage, chatWithAi, generateFont } from '../services/geminiService';

interface AiSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  onImageGenerated: (imageUrl: string) => void;
  currentCanvasImage: string | null;
}

type AiTab = 'generate' | 'font' | 'edit' | 'assist';

const AiSidebar: React.FC<AiSidebarProps> = ({ isOpen, closeSidebar, onImageGenerated, currentCanvasImage }) => {
  const [activeTab, setActiveTab] = useState<AiTab>('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate State
  const [genPrompt, setGenPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  // Font State
  const [fontText, setFontText] = useState('');
  const [fontStyle, setFontStyle] = useState('');

  // Edit State
  const [editPrompt, setEditPrompt] = useState('');

  // Assist State
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>([
      { role: 'model', text: 'Hello! I am your typography assistant. How can I help you today?' }
  ]);

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateImage(genPrompt, aspectRatio);
      onImageGenerated(imageUrl);
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFontGenerate = async () => {
      if (!fontText.trim() || !fontStyle.trim()) return;
      setIsLoading(true);
      setError(null);
      try {
          const imageUrl = await generateFont(fontText, fontStyle);
          onImageGenerated(imageUrl);
      } catch (e: any) {
          setError(e.message || "Font generation failed");
      } finally {
          setIsLoading(false);
      }
  };

  const handleEdit = async () => {
     if (!editPrompt.trim() || !currentCanvasImage) {
         setError("Need an active image on canvas and a prompt to edit.");
         return;
     }
     setIsLoading(true);
     setError(null);
     try {
       const editedImageUrl = await editImage(currentCanvasImage, editPrompt);
       onImageGenerated(editedImageUrl); // Update canvas with edited version
     } catch (e: any) {
       setError(e.message || "Editing failed");
     } finally {
       setIsLoading(false);
     }
  };

  const handleChat = async () => {
      if (!chatMessage.trim()) return;
      const newUserMsg: AiChatMessage = { role: 'user', text: chatMessage };
      setChatHistory(prev => [...prev, newUserMsg]);
      setChatMessage('');
      setIsLoading(true);

      try {
          // Format history for Gemini API
          const apiHistory = chatHistory.map(msg => ({
              role: msg.role,
              parts: [{ text: msg.text }]
          }));

          const responseText = await chatWithAi(apiHistory, chatMessage);
          setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
      } catch (e: any) {
           setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error." }]);
      } finally {
          setIsLoading(false);
      }
  };


  if (!isOpen) return null;

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col shadow-2xl z-20 absolute right-0 top-12 bottom-14 overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950/50">
        <h2 className="font-semibold text-white flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-indigo-500"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12Z"/><path d="M21 12v3a9 9 0 0 1-9 9"/></svg>
            AI Studio
        </h2>
        <button onClick={closeSidebar} className="text-gray-500 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 text-sm">
        {(['generate', 'font', 'edit', 'assist'] as AiTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center capitalize font-medium transition-colors ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-500 bg-gray-800/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {error && (
            <div className="bg-red-900/30 text-red-200 p-3 rounded-md text-sm border border-red-800/50">
                {error}
            </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Prompt</label>
                <textarea
                    className="w-full bg-gray-950 border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none h-32"
                    placeholder="Describe the font glyph or reference image you want..."
                    value={genPrompt}
                    onChange={(e) => setGenPrompt(e.target.value)}
                />
            </div>
            <div>
                 <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Aspect Ratio</label>
                 <div className="grid grid-cols-3 gap-2">
                     {(['1:1', '3:4', '4:3', '16:9', '9:16'] as AspectRatio[]).map(ratio => (
                         <button
                            key={ratio}
                            onClick={() => setAspectRatio(ratio)}
                            className={`text-xs py-2 rounded border ${aspectRatio === ratio ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-gray-950 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                         >
                             {ratio}
                         </button>
                     ))}
                 </div>
            </div>

            <button
                disabled={isLoading || !genPrompt}
                onClick={handleGenerate}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md text-white font-medium transition-colors flex justify-center items-center"
            >
                {isLoading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Generating...
                    </>
                ) : 'Generate Reference'}
            </button>
            <p className="text-xs text-gray-500 text-center">Uses imagen-4.0-generate-001</p>
          </div>
        )}

         {activeTab === 'font' && (
            <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Text to Render</label>
                    <input
                        type="text"
                        className="w-full bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        placeholder="e.g. VectorFont, A, G..."
                        value={fontText}
                        onChange={(e) => setFontText(e.target.value)}
                        maxLength={20}
                    />
                    <p className="text-xs text-gray-600 mt-1">Keep it short for best results (max 20 chars).</p>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Style Description</label>
                    <textarea
                        className="w-full bg-gray-950 border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none h-24"
                        placeholder="e.g. Cyberpunk neon, Elegant serif, Grunge handwritten..."
                        value={fontStyle}
                        onChange={(e) => setFontStyle(e.target.value)}
                    />
                </div>
                <button
                    disabled={isLoading || !fontText.trim() || !fontStyle.trim()}
                    onClick={handleFontGenerate}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md text-white font-medium transition-colors flex justify-center items-center"
                >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Generating Font...
                        </>
                    ) : 'Generate Font'}
                </button>
                 <p className="text-xs text-gray-500 text-center">Uses imagen-4.0-generate-001</p>
            </div>
        )}

        {activeTab === 'edit' && (
            <div className="space-y-4">
                 {!currentCanvasImage ? (
                     <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm text-center">
                         Generate or load an image onto the canvas first to use AI editing.
                     </div>
                 ) : (
                    <>
                     <div className="aspect-video rounded-md overflow-hidden border border-gray-700 bg-gray-950 flex items-center justify-center relative">
                          <img src={currentCanvasImage} alt="Target" className="max-h-full max-w-full object-contain opacity-70" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="text-xs text-white font-medium px-2 py-1 bg-gray-900/80 rounded">Target</span>
                          </div>
                     </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Edit Instruction</label>
                        <textarea
                            className="w-full bg-gray-950 border border-gray-700 rounded-md p-3 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none resize-none h-24"
                            placeholder="e.g., 'Add a retro filter', 'Make background transparent'..."
                            value={editPrompt}
                            onChange={(e) => setEditPrompt(e.target.value)}
                        />
                    </div>
                    <button
                        disabled={isLoading || !editPrompt}
                        onClick={handleEdit}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:text-gray-500 rounded-md text-white font-medium transition-colors flex justify-center items-center"
                    >
                         {isLoading ? 'Editing...' : 'Apply Edit'}
                    </button>
                     <p className="text-xs text-gray-500 text-center">Uses gemini-2.5-flash-image</p>
                    </>
                 )}
            </div>
        )}

        {activeTab === 'assist' && (
            <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                     {isLoading && activeTab === 'assist' && (
                         <div className="flex justify-start">
                             <div className="bg-gray-800 rounded-lg p-3 text-sm text-gray-400 flex items-center">
                                 Thinking<span className="animate-pulse">...</span>
                             </div>
                         </div>
                     )}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                        placeholder="Ask about typography..."
                         className="flex-1 bg-gray-950 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                        disabled={isLoading || !chatMessage.trim()}
                        onClick={handleChat}
                        className="p-2 bg-gray-800 hover:bg-indigo-600 rounded-md text-white transition-colors disabled:opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                    </button>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AiSidebar;