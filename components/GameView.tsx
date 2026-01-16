import React, { useState, useEffect } from 'react';
import { Question, GameState, GameStage, Card, LevelConfig, ElementType } from '../types';
import { ASSETS } from '../constants';

interface GameViewProps {
  currentQuestion: Question;
  gameState: GameState;
  currentLevel: LevelConfig;
  onAnswer: (isCorrect: boolean) => void;
  onCardSelect: (card: Card) => void;
  onNextLevel: () => void;
}

const getElementIcon = (el: ElementType) => {
  switch(el) {
    case 'fire': return '🔥';
    case 'water': return '💧';
    case 'nature': return '🍃';
    case 'light': return '⚡';
    case 'dark': return '🌑';
    case 'physical': return '⚔️';
    case 'heal': return '💖';
    default: return '';
  }
};

const getElementColor = (el: ElementType) => {
    switch(el) {
      case 'fire': return 'text-red-500';
      case 'water': return 'text-blue-500';
      case 'nature': return 'text-green-500';
      case 'light': return 'text-yellow-500';
      case 'dark': return 'text-purple-500';
      case 'physical': return 'text-slate-500';
      case 'heal': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  };

export const GameView: React.FC<GameViewProps> = ({ 
  currentQuestion, 
  gameState, 
  currentLevel,
  onAnswer,
  onCardSelect,
  onNextLevel
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showBossIntro, setShowBossIntro] = useState(false);
  
  useEffect(() => {
    setSelectedOption(null);
  }, [currentQuestion.id, gameState.currentLevelIndex]);

  useEffect(() => {
      setShowBossIntro(true);
      const timer = setTimeout(() => {
        setShowBossIntro(false);
      }, 3000); 
      return () => clearTimeout(timer);
  }, [currentLevel.levelNumber]);

  const handleOptionClick = (option: string) => {
    if (selectedOption || gameState.feedbackMessage) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    onAnswer(isCorrect);
  };

  // --- LEVEL COMPLETE SCREEN ---
  if (gameState.stage === GameStage.LEVEL_TRANSITION) {
    return (
      <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-fade-in p-6 text-center">
         <img 
            src={currentLevel.bossIcon} 
            alt={currentLevel.bossName}
            className="w-48 h-48 object-contain mb-4 animate-bounce filter drop-shadow-2xl grayscale opacity-50"
         />
         <h2 className="text-4xl text-white font-black font-cartoon mb-2">
           打败了 {currentLevel.bossName}!
         </h2>
         <p className="text-yellow-300 text-xl font-bold mb-8">Level Complete!</p>
         <button 
           onClick={onNextLevel}
           className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white rounded-2xl font-black text-2xl shadow-[0_6px_0_#15803d] active:translate-y-1 active:shadow-none transition-all"
         >
           前往下一关 ➡️
         </button>
      </div>
    );
  }

  // --- BOSS INTRO ANIMATION ---
  if (showBossIntro) {
    let animationClass = '';
    let introBg = '';
    switch (currentLevel.levelNumber) {
        case 1: animationClass = 'animate-bounce'; introBg = 'bg-emerald-900'; break;
        case 2: animationClass = 'animate-shake'; introBg = 'bg-orange-900'; break;
        case 3: animationClass = 'animate-pulse scale-125'; introBg = 'bg-indigo-950'; break;
        default: animationClass = 'animate-pop'; introBg = 'bg-slate-900';
    }

    return (
      <div className={`absolute inset-0 z-50 ${introBg} flex flex-col items-center justify-center animate-fade-in overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:50px_50px] animate-[pulse_2s_infinite]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-yellow-400 text-2xl md:text-4xl font-black font-cartoon tracking-widest mb-4 animate-pulse uppercase border-y-4 border-yellow-400 py-2 px-8 bg-black/30 backdrop-blur-sm">
                ⚠️ WARNING ⚠️
            </div>
            
            <img 
                src={currentLevel.bossIcon} 
                alt={currentLevel.bossName}
                className={`w-64 h-64 md:w-80 md:h-80 object-contain my-4 filter drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] ${animationClass} transition-all duration-500`}
            />

            <h2 className="text-5xl md:text-7xl text-white font-black font-cartoon text-outline-lg mb-2 animate-pop" style={{ animationDelay: '0.3s' }}>
                {currentLevel.bossName}
            </h2>
            <div className="flex items-center gap-2 mt-4 bg-black/40 px-4 py-2 rounded-full border border-white/20">
                <span className="text-white font-bold">属性:</span>
                <span className="text-2xl">{getElementIcon(currentLevel.element)}</span>
                <span className={`font-bold uppercase ${getElementColor(currentLevel.element)}`}>{currentLevel.element}</span>
            </div>
          </div>
      </div>
    );
  }

  // NEW LAYOUT: BATTLE (Top) -> QUESTION (Middle) -> DECK (Bottom)
  return (
    <div className="flex flex-col h-full bg-slate-100 relative overflow-hidden">
      
      {/* 1. TOP: BATTLE ARENA (45% height) */}
      <div 
        className="relative h-[45%] flex-shrink-0 w-full overflow-hidden border-b-4 border-black/20 shadow-lg bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${currentLevel.bgImage})` }}
      >
        {/* Dark overlay for better visibility */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* HUD */}
        <div className="absolute top-0 w-full p-2 flex justify-between items-start z-20">
          <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-1 bg-black/40 p-1.5 rounded-full border-2 border-white/30 backdrop-blur-sm mt-1">
                  {[...Array(gameState.maxPlayerHealth)].map((_, i) => (
                      <span key={i} className={`text-xl md:text-2xl transition-all duration-300 ${i < gameState.playerHealth ? 'scale-100 animate-pulse' : 'scale-90 grayscale opacity-30'}`}>
                          ❤️
                      </span>
                  ))}
              </div>
          </div>

          <div className="flex flex-col items-end w-1/2">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-white font-cartoon text-lg font-black drop-shadow-md">{currentLevel.bossName}</span>
               <div className="relative">
                 <img src={currentLevel.bossIcon} className="w-8 h-8 object-contain filter drop-shadow" alt="boss-icon" />
               </div>
            </div>
            <div className="w-full h-4 bg-slate-900/50 rounded-full border-2 border-white overflow-hidden relative shadow-lg backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500 ease-out"
                  style={{ width: `${(gameState.monsterHealth / gameState.maxMonsterHealth) * 100}%` }}
                />
            </div>
          </div>
        </div>

        {/* Characters (Made Larger) */}
        <div className="absolute bottom-0 w-full h-full flex justify-between px-2 items-end pb-2">
           <div className={`transition-all duration-300 transform ${gameState.isPlayerHit ? 'animate-shake grayscale scale-95 opacity-50' : 'translate-y-0'} relative z-10`}>
              {/* RENDER HERO */}
              <img 
                  src={gameState.playerRole === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA} 
                  alt="Player" 
                  className="w-32 h-32 md:w-48 md:h-48 object-contain filter drop-shadow-2xl" 
              />
              
              {gameState.comboCount > 1 && (
                  <div className="absolute -top-6 right-0 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-black text-xs animate-bounce border-2 border-white shadow-lg rotate-12">
                      {gameState.comboCount}连击!
                  </div>
              )}
           </div>

           <div className={`transition-all duration-300 relative z-10 flex flex-col items-center ${gameState.isMonsterHit ? 'animate-shake opacity-60 scale-90' : 'animate-bounce-slow'}`}>
             <img 
                src={currentLevel.bossIcon} 
                alt={currentLevel.bossName}
                className="w-40 h-40 md:w-56 md:h-56 object-contain filter drop-shadow-2xl"
             />
             
              {gameState.isMonsterHit && (
                <div className="absolute top-10 left-0 w-full text-center">
                   <span className="text-6xl font-black text-white text-outline animate-pop drop-shadow-xl">POW!</span>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 2. MIDDLE: QUESTION AREA (More Compact) */}
      <div className="flex-1 p-1 md:p-2 flex flex-col justify-center bg-white relative overflow-y-auto z-0">
          <div className="w-full max-w-lg mx-auto flex flex-col items-center">
            <div className="mb-2 bg-yellow-100 text-yellow-800 px-3 py-0.5 rounded-full border border-yellow-300 text-[10px] font-bold uppercase tracking-wider">
               {currentQuestion.category}
            </div>
            
            <div className="text-center mb-3">
               <h2 className="text-lg md:text-xl font-black text-slate-800 font-cartoon leading-tight px-4">
                 {currentQuestion.text}
               </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full px-6">
               {currentQuestion.options.map((option, idx) => {
                 const isSelected = selectedOption === option;
                 const isCorrect = option === currentQuestion.correctAnswer;
                 let btnClass = "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300";
                 
                 if (isSelected) {
                    if (isCorrect) btnClass = "bg-green-500 border-green-600 text-white";
                    else btnClass = "bg-red-500 border-red-600 text-white";
                 }

                 return (
                    <button
                       key={option}
                       onClick={() => handleOptionClick(option)}
                       disabled={!!selectedOption}
                       className={`
                          py-3 px-3 rounded-lg border-2 text-sm md:text-base font-bold font-cartoon transition-all shadow-sm
                          ${btnClass}
                          ${!selectedOption ? 'active:border-b-2 active:translate-y-0.5' : ''}
                       `}
                    >
                       {option}
                    </button>
                 );
               })}
            </div>
          </div>
      </div>

      {/* 3. BOTTOM: DECK & ENERGY (Fixed, Larger Cards) */}
      <div className="flex-shrink-0 bg-blue-800 p-2 pb-safe border-t-4 border-blue-900 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-20 relative">
         
         {/* Cards Container */}
         <div className="flex justify-center gap-3 md:gap-5 items-end pb-3">
            {gameState.hand.map((card, idx) => {
               const canAfford = gameState.currentEnergy >= card.cost;
               return (
                 <button 
                   key={card.uniqueId} 
                   onClick={() => canAfford && onCardSelect(card)}
                   disabled={!canAfford}
                   className={`
                      relative w-24 md:w-28 aspect-[2.5/3.5] rounded-xl border-2 shadow-lg transition-all duration-300 animate-pop
                      bg-slate-100 overflow-hidden group
                      ${canAfford 
                          ? 'border-white hover:-translate-y-3 cursor-pointer active:scale-95 shadow-black/30' 
                          : 'border-slate-500 opacity-60 grayscale cursor-not-allowed'}
                   `}
                 >
                    {/* Cost Drop (Top Left) */}
                    <div className={`absolute top-0 left-0 w-8 h-8 bg-purple-600 rounded-br-xl z-20 flex items-center justify-center border-b border-r border-white/50 shadow-md`}>
                       <span className="text-white font-black text-lg drop-shadow-md">{card.cost}</span>
                    </div>

                    {/* Card Image Area */}
                    <div className={`absolute inset-1 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center overflow-hidden`}>
                       <div className="text-5xl filter drop-shadow-lg transform group-hover:scale-110 transition-transform">{card.icon}</div>
                    </div>

                    {/* Card Value Badge (Bottom) */}
                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-md font-bold whitespace-nowrap backdrop-blur-sm border border-white/20 shadow-sm">
                       {card.effectType === 'heal' ? `+${card.value} HP` : `-${card.value} ATK`}
                    </div>
                 </button>
               );
            })}
         </div>

         {/* Energy Bar (Bottom Overlay) */}
         <div className="w-full max-w-md mx-auto h-7 bg-black/60 rounded-full border-2 border-black/50 relative overflow-hidden mt-1 shadow-inner">
             <div 
               className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(192,38,211,0.5)]"
               style={{ width: `${(gameState.currentEnergy / gameState.maxEnergy) * 100}%` }}
             >
                {/* Shine effect */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
             </div>
             
             {/* Text */}
             <div className="absolute inset-0 flex items-center justify-center gap-2 text-white text-xs font-black tracking-widest drop-shadow-md z-10">
                 <span className="text-purple-200">ENERGY</span>
                 <span>{gameState.currentEnergy}/{gameState.maxEnergy}</span>
             </div>
         </div>
         
      </div>

      {/* Feedback Overlay */}
      {gameState.feedbackMessage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-full px-4 text-center">
            <div className={`inline-block px-6 py-4 rounded-2xl border-4 border-white shadow-2xl animate-pop ${gameState.feedbackType === 'success' ? 'bg-green-500 rotate-2' : 'bg-red-500 -rotate-2'}`}>
                <span className="text-2xl font-black text-white font-cartoon text-outline">
                  {gameState.feedbackMessage}
                </span>
            </div>
          </div>
      )}

    </div>
  );
};