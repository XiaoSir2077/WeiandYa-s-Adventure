import React, { useState, useEffect } from 'react';
import { PlayerRole } from '../types';
import { ASSETS } from '../constants';

interface StartViewProps {
  onStart: (role: PlayerRole) => void;
}

export const StartView: React.FC<StartViewProps> = ({ onStart }) => {
  const [step, setStep] = useState<'title' | 'role' | 'story'>('title');
  const [selectedRole, setSelectedRole] = useState<PlayerRole>('xiaowei');
  
  // Cutscene State
  const [scenePhase, setScenePhase] = useState(0);

  useEffect(() => {
    if (step === 'story') {
      setScenePhase(0); 
      const timer1 = setTimeout(() => setScenePhase(1), 3000); 
      const timer2 = setTimeout(() => setScenePhase(2), 5500); 
      const timer3 = setTimeout(() => setScenePhase(3), 8500); 

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [step]);

  const renderAvatar = (role: PlayerRole, className: string) => {
    const imgSrc = role === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA;
    return <img src={imgSrc} alt={role} className={`${className} object-contain`} />;
  };

  // --- STEP 1: TITLE SCREEN ---
  if (step === 'title') {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full relative overflow-hidden p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${ASSETS.BG_MAIN})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/30 to-blue-900/40 z-0 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          {/* Logo Container */}
          <div className="mb-16 animate-float relative">
            <div className="absolute inset-0 bg-yellow-300 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <h1 className="relative text-7xl md:text-8xl font-black font-cartoon text-white text-center leading-none drop-shadow-2xl filter" style={{ textShadow: '0px 4px 0px #0ea5e9, 0px 8px 0px #0369a1, 0px 10px 10px rgba(0,0,0,0.4)' }}>
              <span className="block text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-500 mb-2" style={{ WebkitTextStroke: '2px #b45309' }}>知识大陆</span>
              <span className="block text-white" style={{ WebkitTextStroke: '2px #1d4ed8' }}>勇气传说</span>
            </h1>
          </div>

          {/* 3D Button */}
          <button 
            onClick={() => setStep('role')}
            className="group relative w-64 h-24 animate-pop hover:scale-105 transition-transform duration-200"
          >
            {/* Shadow/Side */}
            <div className="absolute inset-0 bg-yellow-700 rounded-3xl translate-y-2"></div>
            {/* Main Face */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-3xl border-b-4 border-yellow-600 shadow-[inset_0_2px_10px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3 active:translate-y-2 transition-transform">
               <span className="text-4xl filter drop-shadow-md">▶</span>
               <span className="text-4xl font-black font-cartoon text-yellow-900 drop-shadow-sm">开始冒险</span>
            </div>
            {/* Shine */}
            <div className="absolute top-2 left-4 right-4 h-3 bg-white/30 rounded-full pointer-events-none"></div>
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 2: ROLE SELECTION ---
  if (step === 'role') {
    return (
      <div className="flex flex-col items-center justify-center h-full relative overflow-hidden p-4 bg-sky-50">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:24px_24px]"></div>
        
        <h2 className="text-4xl font-black font-cartoon text-indigo-800 mb-10 relative z-10 drop-shadow-md text-center">
          选择你的英雄
        </h2>

        <div className="flex flex-col md:flex-row gap-8 z-10 w-full max-w-2xl px-4">
          {/* Card: Xiaowei */}
          <button 
            onClick={() => { setSelectedRole('xiaowei'); setStep('story'); }}
            className="group flex-1 relative bg-white rounded-[2rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white hover:border-blue-400"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white rounded-[1.8rem] z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 md:w-48 md:h-48 mb-4 relative">
                 <div className="absolute inset-0 bg-blue-200 rounded-full opacity-20 scale-90 group-hover:scale-110 transition-transform"></div>
                 <img src={ASSETS.ROLE_XIAOWEI} alt="Xiaowei" className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-black font-cartoon text-2xl shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform">
                我是小威
              </div>
              <p className="text-blue-400 font-bold mt-3 bg-blue-50 px-3 py-1 rounded-lg">勇气骑士 ⚔️</p>
            </div>
          </button>

          {/* Card: Xiaoya */}
          <button 
            onClick={() => { setSelectedRole('xiaoya'); setStep('story'); }}
            className="group flex-1 relative bg-white rounded-[2rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-white hover:border-pink-400"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-white rounded-[1.8rem] z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 md:w-48 md:h-48 mb-4 relative">
                 <div className="absolute inset-0 bg-pink-200 rounded-full opacity-20 scale-90 group-hover:scale-110 transition-transform"></div>
                 <img src={ASSETS.ROLE_XIAOYA} alt="Xiaoya" className="w-full h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="bg-pink-500 text-white px-6 py-2 rounded-full font-black font-cartoon text-2xl shadow-lg transform rotate-2 group-hover:rotate-0 transition-transform">
                我是小芽
              </div>
              <p className="text-pink-400 font-bold mt-3 bg-pink-50 px-3 py-1 rounded-lg">智慧法师 🪄</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // --- STEP 3: STORY MODE (Same logic, better styling) ---
  const otherRole = selectedRole === 'xiaowei' ? 'xiaoya' : 'xiaowei';
  let peaceText = "在灵光大陆，小威和小芽正在草地上依靠智慧水晶的光芒快乐地看书...";
  let monsterText = "突然，讨厌思考的混沌魔王降临了！他打碎了智慧水晶！";
  let crisisText = selectedRole === 'xiaowei' ? "不好！博学的守护者小芽被魔王抓走了！" : "不好！勇敢的小勇士小威被魔王击败带走了！";
  let resolveText = selectedRole === 'xiaowei' ? "我是勇气骑士！我一定要救回小芽！" : "我是智慧法师！我一定要救回小威！";

  const getBgClass = () => {
    if (scenePhase === 0) return "bg-sky-200";
    if (scenePhase >= 1) return "bg-purple-900"; 
    return "bg-sky-200";
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full relative overflow-hidden transition-colors duration-1000 ${getBgClass()}`}>
       {scenePhase === 0 && <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] animate-float"></div>}
       {scenePhase >= 1 && <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>}

       <div className="relative w-full max-w-md h-96 flex items-center justify-center">
          {/* Monster */}
          {scenePhase >= 1 && (
            <div className="absolute top-0 z-20 flex flex-col items-center animate-monster-enter">
                <img src={ASSETS.BOSS_DRAGON} alt="Boss" className="w-64 h-64 object-contain filter drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]" />
                <div className="bg-red-600 text-white font-black px-6 py-2 rounded-full border-4 border-white text-xl animate-pulse mt-[-40px] z-30 shadow-xl">魔王降临!</div>
            </div>
          )}

          {/* Victim */}
          <div className={`absolute bottom-10 right-20 transition-all duration-500 z-10 ${scenePhase === 2 ? 'animate-kidnap' : 'animate-bounce-slow'} ${scenePhase >= 3 ? 'opacity-0' : 'opacity-100'}`}>
            {renderAvatar(otherRole, "filter drop-shadow-lg w-24 h-24")}
            {scenePhase === 2 && (
                <div className="absolute -top-14 -right-4 bg-white px-3 py-2 rounded-xl text-sm font-black whitespace-nowrap animate-ping shadow-lg border-2 border-slate-200 text-red-500">
                    {selectedRole === 'xiaowei' ? '救命呀！' : '呃啊...'}
                </div>
            )}
          </div>

          {/* Hero */}
          <div className={`absolute bottom-10 left-20 transition-all duration-1000 z-40 ${scenePhase === 2 ? 'translate-x-10 scale-90 grayscale brightness-50' : ''} ${scenePhase === 3 ? 'left-1/2 -translate-x-1/2 scale-150 bottom-24' : ''}`}>
             <img src={selectedRole === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA} alt="Hero" className="w-24 h-24 object-contain filter drop-shadow-lg" />
             {scenePhase === 2 && <div className="absolute -top-10 left-4 text-5xl animate-pop drop-shadow-md">⁉️</div>}
          </div>
       </div>

       {/* Dialogue Box */}
       <div className="absolute bottom-6 w-full px-6 flex flex-col items-center z-30 max-w-lg">
          {scenePhase === 0 && (
             <div className="bg-white/95 backdrop-blur p-6 rounded-3xl shadow-xl border-b-8 border-sky-100 animate-pop">
                <p className="text-slate-700 font-bold text-lg leading-relaxed text-center">{peaceText}</p>
             </div>
          )}

          {scenePhase === 1 && (
             <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl border-4 border-red-800 animate-shake text-center transform rotate-1">
                <p className="font-black text-2xl drop-shadow-md">{monsterText}</p>
             </div>
          )}

          {scenePhase === 2 && (
             <div className="bg-slate-900/90 text-white p-6 rounded-3xl shadow-xl border-l-8 border-red-500 text-center animate-pulse">
                 <p className="font-bold text-xl text-red-200">{crisisText}</p>
             </div>
          )}

          {scenePhase === 3 && (
             <div className="flex flex-col items-center w-full animate-pop gap-6">
                 <div className="bg-blue-600 text-white px-8 py-6 rounded-3xl shadow-xl border-4 border-blue-400 relative">
                    <p className="font-black text-2xl text-center">{resolveText}</p>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-600 rotate-45 border-b-4 border-r-4 border-blue-400"></div>
                 </div>

                 <button 
                    onClick={() => onStart(selectedRole)}
                    className="relative w-full h-20 group"
                 >
                    <div className="absolute inset-0 bg-yellow-700 rounded-2xl translate-y-2"></div>
                    <div className="absolute inset-0 bg-yellow-400 rounded-2xl border-b-4 border-yellow-600 flex items-center justify-center active:translate-y-2 transition-transform shadow-lg group-hover:bg-yellow-300">
                        <span className="text-3xl font-black font-cartoon text-yellow-900 tracking-widest flex items-center gap-3">
                            出发去战斗！⚔️
                        </span>
                    </div>
                 </button>
             </div>
          )}
       </div>
    </div>
  );
};