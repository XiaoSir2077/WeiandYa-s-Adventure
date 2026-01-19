import React, { useEffect, useState } from 'react';
import { TOTAL_QUESTIONS, ASSETS } from '../constants';
import { PlayerRole } from '../types';

interface ResultViewProps {
  score: number;
  monsterHealth: number;
  isGameOver?: boolean;
  playerRole: PlayerRole; 
  knowledgeCollected: string[];
  onRestart: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ score, monsterHealth, isGameOver, playerRole, knowledgeCollected, onRestart }) => {
  const isWin = !isGameOver && monsterHealth <= 0;
  // Calculate stars based on score (Simple logic for demo)
  const stars = isGameOver ? 0 : (score === TOTAL_QUESTIONS ? 3 : score >= 3 ? 2 : 1);
  const bgImage = isWin ? ASSETS.BG_VICTORY : ASSETS.BG_GAME_OVER;

  // High Score State
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    // Logic to handle High Score persistence
    const storedHighScore = localStorage.getItem('knowledge_game_highscore');
    let currentHigh = storedHighScore ? parseInt(storedHighScore, 10) : 0;

    if (score > currentHigh) {
        currentHigh = score;
        localStorage.setItem('knowledge_game_highscore', score.toString());
        setIsNewRecord(true);
    }
    setHighScore(currentHigh);
  }, [score]);

  // Narrative Text
  const getWinnerText = () => {
     if (playerRole === 'xiaowei') {
         return "小威救出了小芽！两人联手，用知识的光芒驱散了黑暗，灵光大陆恢复了和平！";
     } else {
         return "小芽救出了小威！两人联手，用知识的光芒驱散了黑暗，灵光大陆恢复了和平！";
     }
  };

  const getFailText = () => {
      return "不要气馁！注意保护好自己的生命值！";
  };

  return (
    <div 
      className="flex flex-col h-full relative overflow-y-auto overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Header Banner */}
      <div className="h-40 w-full flex-shrink-0 relative flex items-center justify-center z-10 mt-10">
        <h1 className="text-5xl text-white font-black font-cartoon text-outline-lg mb-4 animate-bounce drop-shadow-xl text-center px-4">
          {isWin ? '🏆 冒险成功 🏆' : (isGameOver ? '💀 你的生命耗尽了 💀' : '💀 冒险失败 💀')}
        </h1>
        {/* Confetti if win */}
        {isWin && (
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 text-4xl animate-float">🎉</div>
              <div className="absolute top-20 right-20 text-4xl animate-float" style={{ animationDelay: '1s'}}>✨</div>
           </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-1 px-4 pb-8 relative z-10 max-w-md mx-auto w-full">
        
        {/* Stats Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-b-8 border-slate-200 mb-6">
           {/* High Score Badge */}
           <div className="flex justify-center mb-4">
              <div className="bg-amber-100 border border-amber-200 rounded-full px-4 py-1 flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  <span className="text-amber-700 font-bold text-sm">历史最高: {highScore}</span>
                  {isNewRecord && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse ml-1">
                          新纪录!
                      </span>
                  )}
              </div>
           </div>

           <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                 <span key={i} className={`text-4xl filter drop-shadow-sm transition-all duration-500 ${i <= stars && isWin ? 'grayscale-0 scale-110' : 'grayscale opacity-30'}`}>
                    ⭐
                 </span>
              ))}
           </div>
           
           <div className="text-center mb-4">
             <p className="text-slate-500 font-bold mb-1">本次得分</p>
             <div className="text-5xl font-black text-slate-800 font-cartoon">
                {score} <span className="text-2xl text-slate-300">/ {TOTAL_QUESTIONS}</span>
             </div>
           </div>

           <div className="bg-orange-50 rounded-xl p-3 border border-orange-100 text-center">
              <span className="text-orange-600 font-bold text-sm leading-relaxed">
                 {isWin 
                    ? getWinnerText()
                    : isGameOver 
                        ? getFailText()
                        : "只差一点点！下次一定能打败它！"
                 }
              </span>
           </div>
        </div>

        {/* Learning Report (For Parents) */}
        <div className="bg-indigo-50/95 backdrop-blur-sm rounded-3xl p-6 border-2 border-indigo-100 mb-6 relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 bg-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
              家长报告
           </div>
           <h3 className="text-lg font-black text-indigo-900 mb-3 flex items-center gap-2">
              <span>📚</span> 知识点收集卡
           </h3>
           
           {knowledgeCollected.length > 0 ? (
             <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {knowledgeCollected.map((item, idx) => (
                   <li key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs flex-shrink-0">✓</div>
                      <span className="text-slate-700 font-bold text-sm">{item}</span>
                   </li>
                ))}
             </ul>
           ) : (
             <p className="text-slate-400 text-sm italic text-center">加油！答对题目才能收集知识卡片哦。</p>
           )}
        </div>

        {/* Action Button */}
        <button 
          onClick={onRestart}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white text-xl font-black font-cartoon py-4 rounded-2xl shadow-[0_6px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <span>🔄</span> {isWin ? '再玩一次' : '再次挑战'}
        </button>

      </div>
    </div>
  );
};