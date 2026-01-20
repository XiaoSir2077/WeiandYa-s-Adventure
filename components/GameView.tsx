
import React, { useState, useEffect, useRef } from 'react';
import { Question, GameState, GameStage, Card, LevelConfig, ElementType } from '../types';
import { ASSETS, MAX_ARMOR, HERO_SKILL_COOLDOWN } from '../constants';

interface GameViewProps {
  currentQuestion: Question;
  gameState: GameState;
  currentLevel: LevelConfig;
  onAnswer: (isCorrect: boolean) => void;
  onCardSelect: (card: Card) => void;
  onNextLevel: () => void;
  onHeroSkill: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ 
  currentQuestion, 
  gameState, 
  currentLevel,
  onAnswer,
  onCardSelect,
  onNextLevel,
  onHeroSkill
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showBossIntro, setShowBossIntro] = useState(false);
  
  // Animation state for Energy changes
  const prevEnergyRef = useRef(gameState.currentEnergy);
  const [energyAnimation, setEnergyAnimation] = useState<'none' | 'spend' | 'gain'>('none');

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

  // Effect to trigger energy animations
  useEffect(() => {
      if (gameState.currentEnergy < prevEnergyRef.current) {
          setEnergyAnimation('spend');
          const timer = setTimeout(() => setEnergyAnimation('none'), 400);
          return () => clearTimeout(timer);
      } else if (gameState.currentEnergy > prevEnergyRef.current) {
          setEnergyAnimation('gain');
          const timer = setTimeout(() => setEnergyAnimation('none'), 400);
          return () => clearTimeout(timer);
      }
      prevEnergyRef.current = gameState.currentEnergy;
  }, [gameState.currentEnergy]);

  const handleOptionClick = (option: string) => {
    if (selectedOption || gameState.feedbackMessage || gameState.isPlayerStunned) return;
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    onAnswer(isCorrect);
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- LEVEL COMPLETE SCREEN ---
  if (gameState.stage === GameStage.LEVEL_TRANSITION) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-fade-in p-6 text-center">
         <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 animate-pulse"></div>
            <img 
                src={currentLevel.bossIcon} 
                alt={currentLevel.bossName}
                className="w-48 h-48 object-contain mb-8 animate-bounce filter drop-shadow-2xl grayscale opacity-50 relative z-10"
            />
         </div>
         <h2 className="text-5xl text-white font-black font-cartoon mb-4 text-outline drop-shadow-lg">
           胜利!
         </h2>
         <p className="text-yellow-300 text-2xl font-bold mb-12">打败了 {currentLevel.bossName}</p>
         
         <button 
           onClick={onNextLevel}
           className="relative group w-64 h-20"
         >
           <div className="absolute inset-0 bg-green-700 rounded-2xl translate-y-2"></div>
           <div className="absolute inset-0 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-green-700 active:translate-y-2 transition-transform group-hover:bg-green-400">
             <span className="text-white font-black text-2xl font-cartoon tracking-wider">下一关 ➡️</span>
           </div>
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
      <div className={`fixed inset-0 z-50 ${introBg} flex flex-col items-center justify-center animate-fade-in overflow-hidden`}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:30px_30px]"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-yellow-400 text-3xl md:text-5xl font-black font-cartoon tracking-widest mb-8 animate-pulse uppercase border-y-8 border-yellow-500 py-4 px-12 bg-black/50 backdrop-blur-md transform -skew-x-12 shadow-2xl">
                ⚠️ 前方高能 ⚠️
            </div>
            
            <img 
                src={currentLevel.bossIcon} 
                alt={currentLevel.bossName}
                className={`w-64 h-64 md:w-80 md:h-80 object-contain my-4 filter drop-shadow-[0_0_50px_rgba(255,255,255,0.4)] ${animationClass} transition-all duration-500`}
            />

            <h2 className="text-5xl md:text-7xl text-white font-black font-cartoon text-outline-lg mb-4 animate-pop drop-shadow-2xl" style={{ animationDelay: '0.3s' }}>
                {currentLevel.bossName}
            </h2>
          </div>
      </div>
    );
  }

  // MAIN LAYOUT
  return (
    <div className="flex flex-col h-[100dvh] bg-slate-900 relative overflow-hidden">
      
      {/* 1. TOP SCENE (45%) */}
      <div 
        className="relative h-[45%] flex-shrink-0 w-full overflow-hidden shadow-2xl bg-cover bg-center transition-all duration-500 z-0"
        style={{ backgroundImage: `url(${currentLevel.bgImage})` }}
      >
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]"></div>

        {/* HUD: Top Bar */}
        <div className="absolute top-0 w-full p-2 pt-3 flex justify-between items-start z-20">
          
          {/* PLAYER HUD (Top Left) */}
          <div className="flex flex-col items-start gap-1">
              <div className="flex flex-col gap-1 bg-black/50 p-2 rounded-xl border border-white/20 backdrop-blur-md shadow-lg min-w-[140px]">
                  
                  {/* Row 1: Health */}
                  <div className="flex items-center gap-2">
                     <span className="text-lg">❤️</span>
                     <div className="flex gap-1">
                        {[...Array(gameState.maxPlayerHealth)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-4 rounded-sm border border-white/30 transition-all duration-300 ${i < gameState.playerHealth ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-slate-700/50'}`}
                            ></div>
                        ))}
                     </div>
                  </div>

                  {/* Row 2: Armor */}
                  <div className="flex items-center gap-2">
                     <span className="text-lg">🛡️</span>
                     <div className="flex gap-1">
                        {[...Array(MAX_ARMOR)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-3 h-4 rounded-sm border border-white/30 transition-all duration-300 ${i < gameState.playerArmor ? 'bg-slate-300 shadow-[0_0_5px_white]' : 'bg-slate-700/50'}`}
                            ></div>
                        ))}
                     </div>
                  </div>

                  {/* Row 3: Energy (Mana) */}
                  <div className={`flex items-center gap-2 transition-all duration-200 ${energyAnimation === 'spend' ? 'animate-shake brightness-125' : ''} ${energyAnimation === 'gain' ? 'scale-105' : ''}`}>
                     <span className="text-lg">⚡</span>
                     <div className={`flex-1 h-3 bg-slate-900 rounded-full border overflow-hidden relative transition-colors duration-200 ${energyAnimation === 'spend' ? 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : (energyAnimation === 'gain' ? 'border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'border-slate-600')}`}>
                        <div 
                            className={`h-full transition-all duration-300 ${energyAnimation === 'spend' ? 'bg-red-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}
                            style={{ width: `${(gameState.currentEnergy / gameState.maxEnergy) * 100}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white text-shadow">{gameState.currentEnergy}/{gameState.maxEnergy}</span>
                     </div>
                  </div>

              </div>
          </div>

          {/* TIMER HUD */}
          <div className={`absolute left-1/2 -translate-x-1/2 top-4 px-4 py-1 rounded-lg border-2 font-mono font-bold text-xl flex items-center gap-2 shadow-lg ${gameState.levelTimeRemaining < 30 ? 'bg-red-600 border-red-400 text-white animate-pulse' : 'bg-black/40 border-white/20 text-white backdrop-blur'}`}>
               <span>⏰</span>
               {formatTime(gameState.levelTimeRemaining)}
          </div>

          {/* Boss Health & Attack Bar */}
          <div className="flex flex-col items-end w-[40%]">
            <div className="flex items-center gap-2 mb-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
               <span className="text-white font-cartoon text-sm font-black drop-shadow-md tracking-wide">{currentLevel.bossName}</span>
               <img src={currentLevel.bossIcon} className="w-5 h-5 object-contain" alt="boss-icon" />
            </div>
            {/* Glossy HP Bar */}
            <div className="w-full h-4 bg-slate-900/80 rounded-full border border-slate-600 overflow-hidden relative shadow-lg mb-1">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 transition-all duration-500 ease-out relative"
                  style={{ width: `${(gameState.monsterHealth / gameState.maxMonsterHealth) * 100}%` }}
                >
                    <div className="absolute top-0 left-0 w-full h-[40%] bg-white/30 rounded-t-full"></div>
                </div>
            </div>
            {/* Monster Action Bar (ATB) */}
            <div className="w-[80%] h-2 bg-slate-800 rounded-full border border-slate-600 overflow-hidden relative shadow">
                 <div 
                   className="h-full bg-red-500 transition-all duration-100 ease-linear"
                   style={{ width: `${gameState.monsterAttackProgress}%` }}
                 ></div>
                 {/* Warning Icon if near full */}
                 {gameState.monsterAttackProgress > 80 && (
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[8px] animate-ping">⚠️</div>
                 )}
            </div>
          </div>
        </div>

        {/* Characters */}
        <div className="absolute bottom-6 w-full h-full flex justify-between px-6 items-end pointer-events-none">
           {/* Player Avatar */}
           <div className={`transition-all duration-300 transform ${gameState.isPlayerHit ? 'animate-shake grayscale brightness-50' : 'translate-y-0'} relative z-10 flex items-end`}>
              
              {/* HERO SKILL BUTTON (Next to Avatar) */}
              <div className="pointer-events-auto mr-4 mb-4 relative group">
                  <button 
                    onClick={onHeroSkill}
                    disabled={gameState.heroSkillCooldown > 0 || gameState.isPlayerStunned}
                    className={`
                        w-16 h-16 rounded-full border-4 shadow-xl transition-all duration-200 flex items-center justify-center relative overflow-hidden
                        ${gameState.heroSkillCooldown > 0 || gameState.isPlayerStunned
                            ? 'bg-slate-600 border-slate-400 grayscale' 
                            : 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-200 animate-pulse hover:scale-110 active:scale-95 cursor-pointer'}
                    `}
                  >
                      <span className="text-3xl filter drop-shadow-md">
                        {gameState.playerRole === 'xiaowei' ? '🛡️' : '🪄'}
                      </span>
                      
                      {/* Cooldown Overlay */}
                      {gameState.heroSkillCooldown > 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{Math.ceil(gameState.heroSkillCooldown)}</span>
                          </div>
                      )}
                  </button>
                  {/* Skill Label */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                      {gameState.playerRole === 'xiaowei' ? '勇气护盾' : '魔力爆发'}
                  </div>
              </div>

              <div className="relative">
                  <div className="absolute bottom-0 w-24 h-6 bg-black/40 blur-lg rounded-[100%]"></div>
                  <img 
                      src={gameState.playerRole === 'xiaowei' ? ASSETS.ROLE_XIAOWEI : ASSETS.ROLE_XIAOYA} 
                      alt="Player" 
                      className="w-24 h-24 md:w-32 md:h-32 object-contain filter drop-shadow-xl relative" 
                  />
                  {gameState.comboCount > 1 && (
                      <div className="absolute -top-6 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-xl font-black font-cartoon text-sm animate-bounce border-2 border-white shadow-lg rotate-12 z-20">
                          {gameState.comboCount} 连击! 🔥
                      </div>
                  )}
              </div>
           </div>

           {/* Boss */}
           <div className={`transition-all duration-300 relative z-10 flex flex-col items-center ${gameState.isMonsterHit ? 'animate-shake opacity-60 scale-90 brightness-150' : 'animate-bounce-slow'}`}>
             <div className="absolute bottom-0 w-32 h-8 bg-black/50 blur-xl rounded-[100%]"></div>
             <img 
                src={currentLevel.bossIcon} 
                alt={currentLevel.bossName}
                className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-2xl relative"
             />
              {gameState.isMonsterHit && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-30">
                   <span className="text-4xl font-black text-white text-outline-lg animate-pop drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]" style={{textShadow: '0 0 10px red'}}>暴击!</span>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* 2. MAIN PANEL - Fills remaining space */}
      <div className="flex-1 bg-[#F5F7FA] rounded-t-[30px] -mt-8 relative z-10 flex flex-col overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.2)]">
          
          {/* STUN OVERLAY */}
          {gameState.isPlayerStunned && (
              <div className="absolute inset-0 z-40 bg-slate-800/60 backdrop-blur-[2px] flex items-center justify-center animate-fade-in">
                  <div className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-shake">
                      <div className="text-4xl animate-spin mb-2">💫</div>
                      <h3 className="text-xl font-black text-slate-800">晕眩中...</h3>
                      <p className="text-slate-500 text-sm">怪兽攻击了你！</p>
                  </div>
              </div>
          )}

          {/* Question Area */}
          <div className="flex-1 overflow-y-auto px-4 pt-6 pb-2 flex flex-col justify-start">
            
            {/* Category Badge - ENLARGED */}
            <div className="flex justify-center mb-3">
               <div className="bg-blue-100 text-blue-600 px-8 py-2 rounded-full text-2xl font-black font-cartoon tracking-widest shadow-sm border-2 border-blue-200 transform hover:scale-105 transition-transform">
                   {currentQuestion.category}
               </div>
            </div>

            {/* Question Text */}
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 mb-4 text-center shrink-0">
                <h2 className="text-lg md:text-xl font-bold text-slate-800 leading-snug">
                    {currentQuestion.text}
                </h2>
            </div>

            {/* Options - 2 COLUMNS (GRID) */}
            <div className="grid grid-cols-2 gap-3 w-full mb-2">
               {currentQuestion.options.map((option, idx) => {
                 const isSelected = selectedOption === option;
                 const isCorrect = option === currentQuestion.correctAnswer;
                 
                 let styleClass = "bg-white text-slate-600 border border-slate-200 shadow-[0_2px_0_#e2e8f0]";
                 
                 if (isSelected) {
                    if (isCorrect) styleClass = "bg-green-500 text-white border-green-600 shadow-[0_2px_0_#15803d]";
                    else styleClass = "bg-red-500 text-white border-red-600 shadow-[0_2px_0_#b91c1c]";
                 } else {
                    styleClass += " hover:bg-slate-50 active:translate-y-[2px] active:shadow-none";
                 }

                 return (
                    <button
                       key={option}
                       onClick={() => handleOptionClick(option)}
                       disabled={!!selectedOption || gameState.isPlayerStunned}
                       className={`
                          w-full py-3 px-2 rounded-xl text-base font-bold transition-all duration-150 flex items-center justify-center text-center leading-tight min-h-[60px]
                          ${styleClass}
                          ${gameState.isPlayerStunned ? 'opacity-50 cursor-not-allowed' : ''}
                       `}
                    >
                       {option}
                    </button>
                 );
               })}
            </div>
          </div>

          {/* 3. DECK AREA (Fixed at bottom of white panel) */}
          <div className="flex-shrink-0 bg-indigo-50/80 border-t border-indigo-100 pb-safe pt-2 px-2 z-20 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)]">
             
             {/* Cards List */}
             <div className="flex justify-center gap-3 overflow-x-auto pb-4 px-2 no-scrollbar pt-2">
                {gameState.hand.map((card, idx) => {
                   const canAfford = gameState.currentEnergy >= card.cost;
                   return (
                     <button 
                       key={card.uniqueId} 
                       onClick={() => canAfford && onCardSelect(card)}
                       disabled={!canAfford || gameState.isPlayerStunned}
                       className={`
                          flex-shrink-0 relative w-16 aspect-[3/4] rounded-lg transition-all duration-300
                          ${canAfford && !gameState.isPlayerStunned
                              ? 'hover:-translate-y-3 cursor-pointer shadow-xl ring-2 ring-yellow-400 scale-105 brightness-110 z-10' // Highlighting Effect
                              : 'opacity-60 grayscale cursor-not-allowed scale-95'}
                       `}
                     >
                        <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${card.color} p-0.5`}>
                            {/* Glow Effect for Affordable Cards */}
                            {canAfford && !gameState.isPlayerStunned && (
                                <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 animate-pulse"></div>
                            )}

                            <div className="w-full h-full bg-white rounded-[6px] flex flex-col items-center justify-center relative overflow-hidden z-10">
                                {/* Cost */}
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center z-20 shadow-sm border border-white ${canAfford ? 'bg-blue-600 text-white' : 'bg-slate-400 text-slate-100'}`}>
                                    <span className="font-bold text-[10px]">{card.cost}</span>
                                </div>
                                
                                <div className="text-3xl mb-1 filter drop-shadow-sm">{card.icon}</div>
                                <div className="text-[9px] font-bold text-slate-700 bg-slate-100/90 px-1.5 py-0.5 rounded-full whitespace-nowrap overflow-hidden max-w-[95%] text-center border border-slate-200">
                                    {card.name}
                                </div>
                            </div>
                        </div>
                     </button>
                   );
                })}
             </div>
          </div>
      </div>

      {/* Feedback Overlay */}
      {gameState.feedbackMessage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-full px-4 text-center">
            <div className={`
                inline-block px-6 py-3 rounded-2xl border-4 border-white shadow-2xl animate-pop backdrop-blur-md
                ${gameState.feedbackType === 'success' ? 'bg-green-500' : 'bg-red-500'}
            `}>
                <span className="text-2xl font-black text-white font-cartoon">
                  {gameState.feedbackMessage}
                </span>
            </div>
          </div>
      )}

    </div>
  );
};
