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
  // 0: Peace, 1: Monster Appears, 2: Kidnap Action, 3: Resolve/Button
  const [scenePhase, setScenePhase] = useState(0);

  // Trigger animations when entering story mode
  useEffect(() => {
    if (step === 'story') {
      setScenePhase(0); // Peace
      
      const timer1 = setTimeout(() => setScenePhase(1), 3000); // Monster Enter
      const timer2 = setTimeout(() => setScenePhase(2), 5500); // Kidnap
      const timer3 = setTimeout(() => setScenePhase(3), 8500); // Resolve

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [step]);

  // Helper to render role avatar
  const renderAvatar = (role: PlayerRole, className: string) => {
    const imgSrc = role === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA;
    return (
      <img 
        src={imgSrc} 
        alt={role} 
        className={`${className} object-contain`} 
      />
    );
  };

  // Step 1: Title Screen
  if (step === 'title') {
    return (
      <div 
        className="flex flex-col items-center justify-center h-full relative overflow-hidden p-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${ASSETS.BG_MAIN})` }}
      >
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        
        <div className="relative z-10 w-full max-w-md flex flex-col items-center">
          <div className="mb-20 animate-float">
            <h1 className="text-6xl md:text-8xl font-black font-cartoon text-white text-center tracking-wider text-outline-lg leading-tight drop-shadow-2xl">
              <span className="block -mb-2 text-yellow-400">知识大陆</span>
              <span className="block">勇气传说</span>
            </h1>
          </div>

          <button 
            onClick={() => setStep('role')}
            className="group relative w-full animate-pop mt-10"
          >
            <div className="absolute inset-0 bg-yellow-600 rounded-full translate-y-3 group-hover:translate-y-4 transition-transform"></div>
            <div className="relative bg-yellow-400 hover:bg-yellow-300 text-yellow-900 rounded-full border-4 border-yellow-500 p-6 flex items-center justify-center gap-4 transition-transform group-hover:translate-y-1 active:translate-y-3">
               <span className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-inner text-yellow-500">▶</span>
               <span className="text-4xl font-black font-cartoon tracking-widest">开始游戏</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Role Selection
  if (step === 'role') {
    return (
      <div className="flex flex-col items-center justify-center h-full relative overflow-hidden p-4 bg-sky-100">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <h2 className="text-3xl font-black font-cartoon text-indigo-600 mb-8 relative z-10 bg-white/80 px-6 py-2 rounded-full border-4 border-indigo-200">
          你是谁？
        </h2>

        <div className="flex flex-col md:flex-row gap-6 z-10 w-full max-w-lg">
          {/* Xiaowei Option */}
          <button 
            onClick={() => { setSelectedRole('xiaowei'); setStep('story'); }}
            className="flex-1 bg-white p-4 rounded-3xl border-b-8 border-blue-200 hover:border-blue-400 hover:-translate-y-2 transition-all group flex flex-col items-center"
          >
            <img 
              src={ASSETS.ROLE_XIAOWEI} 
              alt="Xiaowei" 
              className="w-40 h-40 mb-4 object-contain transform group-hover:scale-110 transition-transform filter drop-shadow-lg" 
            />
            <div className="text-2xl font-black text-blue-600 font-cartoon">我是小威</div>
            <p className="text-sm text-slate-400 font-bold mt-2">勇气骑士</p>
          </button>

          {/* Xiaoya Option */}
          <button 
            onClick={() => { setSelectedRole('xiaoya'); setStep('story'); }}
            className="flex-1 bg-white p-4 rounded-3xl border-b-8 border-pink-200 hover:border-pink-400 hover:-translate-y-2 transition-all group flex flex-col items-center"
          >
            <img 
              src={ASSETS.ROLE_XIAOYA} 
              alt="Xiaoya" 
              className="w-40 h-40 mb-4 object-contain transform group-hover:scale-110 transition-transform filter drop-shadow-lg" 
            />
            <div className="text-2xl font-black text-pink-500 font-cartoon">我是小芽</div>
            <p className="text-sm text-slate-400 font-bold mt-2">智慧法师</p>
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Cinematic Story Intro
  
  const otherRole = selectedRole === 'xiaowei' ? 'xiaoya' : 'xiaowei';

  // Dynamic Story Text Logic
  let peaceText = "在灵光大陆，小威和小芽正在草地上依靠智慧水晶的光芒快乐地看书...";
  let monsterText = "突然，讨厌思考的混沌魔王降临了！他打碎了智慧水晶！";
  let crisisText = "";
  let resolveText = "";

  if (selectedRole === 'xiaowei') {
      crisisText = "不好！博学的守护者小芽被魔王抓走了！";
      resolveText = "我是勇气骑士！我一定要救回小芽，重聚智慧水晶！";
  } else {
      crisisText = "不好！勇敢的小勇士小威被魔王击败带走了！";
      resolveText = "我是智慧法师！我一定要救回小威，重聚智慧水晶！";
  }

  // Background style based on phase
  const getBgClass = () => {
    if (scenePhase === 0) return "bg-sky-200";
    if (scenePhase >= 1) return "bg-purple-900"; // Darken when monster appears
    return "bg-sky-200";
  };

  return (
    <div className={`flex flex-col items-center justify-center h-full relative overflow-hidden transition-colors duration-1000 ${getBgClass()}`}>
       
       {/* Background Elements */}
       {scenePhase === 0 && (
          <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] animate-float"></div>
       )}
       {scenePhase >= 1 && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
       )}

       {/* SCENE CONTAINER */}
       <div className="relative w-full max-w-md h-96 flex items-center justify-center">
          
          {/* 1. THE MONSTER */}
          {scenePhase >= 1 && (
            <div className="absolute top-0 z-20 flex flex-col items-center animate-monster-enter">
                <img 
                  src={ASSETS.BOSS_DRAGON} 
                  alt="Boss"
                  className="w-64 h-64 object-contain filter drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]" 
                />
                <div className="bg-black/50 text-red-500 font-black px-4 py-1 rounded text-xl animate-pulse mt-[-40px] z-30">
                    魔王降临!
                </div>
            </div>
          )}

          {/* 2. THE VICTIM (Gets Kidnapped) */}
          <div 
            className={`absolute bottom-10 right-20 transition-all duration-500 z-10
              ${scenePhase === 2 ? 'animate-kidnap' : 'animate-bounce-slow'}
              ${scenePhase >= 3 ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {renderAvatar(otherRole, "filter drop-shadow-lg w-24 h-24")}
            {scenePhase === 2 && (
                <div className="absolute -top-12 -right-10 bg-white p-2 rounded-xl text-xs font-bold whitespace-nowrap animate-ping">
                    {selectedRole === 'xiaowei' ? '救命呀！' : '呃啊...'}
                </div>
            )}
          </div>

          {/* 3. THE HERO (You) */}
          <div 
             className={`absolute bottom-10 left-20 transition-all duration-1000 z-10
               ${scenePhase === 2 ? 'translate-x-10 scale-90 grayscale' : ''} 
               ${scenePhase === 3 ? 'left-1/2 -translate-x-1/2 scale-150 bottom-20' : ''}
             `}
          >
             {/* Use the specific asset for the selected role */}
             <img 
               src={selectedRole === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA} 
               alt="Hero"
               className="w-24 h-24 object-contain filter drop-shadow-lg" 
             />

             {scenePhase === 2 && (
                 <div className="absolute -top-10 left-0 text-4xl animate-pop">⁉️</div>
             )}
          </div>

       </div>

       {/* DIALOGUE & ACTION AREA */}
       <div className="absolute bottom-10 w-full px-6 flex flex-col items-center z-30">
          
          {scenePhase === 0 && (
             <div className="bg-white/90 p-4 rounded-2xl shadow-lg mb-4 text-center animate-pop">
                <p className="text-slate-600 font-bold leading-relaxed">{peaceText}</p>
             </div>
          )}

          {scenePhase === 1 && (
             <div className="bg-red-600 text-white p-4 rounded-2xl shadow-xl mb-4 text-center animate-shake border-4 border-red-800">
                <p className="font-black text-xl">{monsterText}</p>
             </div>
          )}

          {scenePhase === 2 && (
             <div className="bg-black/80 text-white p-4 rounded-2xl shadow-xl mb-4 text-center">
                 <p className="font-bold text-lg text-red-300">{crisisText}</p>
             </div>
          )}

          {scenePhase === 3 && (
             <div className="flex flex-col items-center w-full animate-pop">
                 <div className="bg-blue-600 text-white p-4 rounded-t-2xl rounded-br-2xl mb-6 shadow-xl border-4 border-blue-400 self-start ml-8 relative">
                    <p className="font-black text-xl">{resolveText}</p>
                    <div className="absolute -bottom-3 left-4 w-4 h-4 bg-blue-600 rotate-45"></div>
                 </div>

                 <button 
                    onClick={() => onStart(selectedRole)}
                    className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 text-2xl font-black font-cartoon py-4 rounded-2xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all shadow-2xl animate-pulse"
                 >
                    出发！⚔️
                 </button>
             </div>
          )}
       </div>

    </div>
  );
};