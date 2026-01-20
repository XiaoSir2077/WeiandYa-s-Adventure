import React, { useState, useEffect, useRef } from 'react';
import { StartView } from './components/StartView';
import { GameView } from './components/GameView';
import { ResultView } from './components/ResultView';
import { QUESTIONS, LEVELS, CARDS, MAX_PLAYER_HEALTH, MAX_ENERGY, ASSETS, BASIC_ATTACK_DAMAGE, STUN_DURATION, LEVEL_TIME_LIMIT, MONSTER_RAGE_PER_MISTAKE, MAX_ARMOR, HERO_SKILL_COOLDOWN } from './constants';
import { GameState, GameStage, Card, PlayerRole, ElementType, Question, HandCard } from './types';

// Helper: Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Helper: Create a HandCard with unique ID
const createHandCard = (card: Card): HandCard => {
  return {
    ...card,
    uniqueId: Math.random().toString(36).substr(2, 9) + Date.now().toString()
  };
};

const getCurrentQuestion = (gameState: GameState) => {
  const { questions, currentQuestionIndex } = gameState;
  if (!questions || questions.length === 0) return QUESTIONS[0];
  if (currentQuestionIndex < questions.length) return questions[currentQuestionIndex];
  return questions[currentQuestionIndex % questions.length]; 
};

// Elemental Effectiveness Logic
const getDamageAnalysis = (cardEl: ElementType, bossEl: ElementType, baseDamage: number): { finalDamage: number, text: string, type: 'normal' | 'weak' | 'resist' } => {
    if (cardEl === 'heal') return { finalDamage: 0, text: '辅助', type: 'normal' };

    let multiplier = 1;
    let text = "命中!";
    
    if (cardEl === bossEl) {
        multiplier = 0.5;
        text = "效果一般...";
    } else if (
        (cardEl === 'water' && bossEl === 'fire') ||
        (cardEl === 'fire' && bossEl === 'nature') ||
        (cardEl === 'nature' && bossEl === 'water') ||
        (cardEl === 'light' && bossEl === 'dark')
    ) {
        multiplier = 1.5;
        text = "效果拔群!!!";
    }

    const finalDamage = Math.ceil(baseDamage * multiplier);
    const type = multiplier > 1 ? 'weak' : (multiplier < 1 ? 'resist' : 'normal');

    return { finalDamage, text, type };
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.START,
    playerRole: 'xiaowei',
    currentLevelIndex: 0,
    currentQuestionIndex: 0,
    score: 0,
    monsterHealth: 10,
    maxMonsterHealth: 10,
    playerHealth: MAX_PLAYER_HEALTH,
    maxPlayerHealth: MAX_PLAYER_HEALTH,
    playerArmor: 0,
    maxArmor: MAX_ARMOR,
    currentEnergy: 0,
    maxEnergy: MAX_ENERGY,
    heroSkillCooldown: 0,
    comboCount: 0,
    isMonsterHit: false,
    isPlayerHit: false,
    feedbackMessage: null,
    feedbackType: null,
    hand: [],
    availableCards: [],
    knowledgeCollected: [],
    questions: [],
    monsterAttackProgress: 0,
    isPlayerStunned: false,
    levelTimeRemaining: LEVEL_TIME_LIMIT 
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(ASSETS.BGM_MENU);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; 

    const playAudio = () => {
        audioRef.current?.play().catch(() => {});
    };
    playAudio();

    const handleFirstInteraction = () => {
        playAudio();
        document.removeEventListener('click', handleFirstInteraction);
    };
    document.addEventListener('click', handleFirstInteraction);

    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // Handle BGM Switching
  useEffect(() => {
    if (!audioRef.current) return;
    const isBattleStage = gameState.stage === GameStage.PLAYING || 
                          gameState.stage === GameStage.LEVEL_TRANSITION ||
                          gameState.stage === GameStage.GAME_OVER ||
                          gameState.stage === GameStage.RESULT;
    const targetSrc = isBattleStage ? ASSETS.BGM_BATTLE : ASSETS.BGM_MENU;

    if (audioRef.current.src !== targetSrc) {
        audioRef.current.volume = 0.2;
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.src = targetSrc;
                audioRef.current.play().catch(e => console.log("Audio play error", e));
                audioRef.current.volume = 0.5;
            }
        }, 200);
    }
  }, [gameState.stage]);

  // --- MAIN GAME LOOP (Timer & CD) ---
  useEffect(() => {
    let intervalId: any;

    if (gameState.stage === GameStage.PLAYING) {
        intervalId = setInterval(() => {
            setGameState(prev => {
                // Time Check
                if (prev.levelTimeRemaining <= 0) {
                     return { ...prev, stage: GameStage.GAME_OVER, feedbackMessage: "时间到!", feedbackType: 'error' };
                }
                return {
                    ...prev,
                    levelTimeRemaining: prev.levelTimeRemaining - 1,
                    heroSkillCooldown: Math.max(0, prev.heroSkillCooldown - 1)
                };
            });
        }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [gameState.stage]); 


  // ---------------------

  const startLevel = (
    levelIndex: number, 
    currentScore: number, 
    knowledge: string[], 
    role: PlayerRole, 
    qIndex: number, 
    currentHealth: number,
    levelQuestions: Question[],
    currentEnergy: number,
    currentHand: HandCard[],
    currentArmor: number
  ) => {
    const levelConfig = LEVELS[levelIndex];
    
    // Filter Cards by Role
    const roleCards = CARDS.filter(c => !c.allowedRoles || c.allowedRoles.includes(role));
    
    // Deal Hand if empty
    let newHand = currentHand;
    if (newHand.length === 0) {
        newHand = shuffleArray(roleCards).slice(0, 4).map(createHandCard);
    }

    setGameState({
      stage: GameStage.PLAYING,
      playerRole: role,
      currentLevelIndex: levelIndex,
      currentQuestionIndex: qIndex,
      score: currentScore,
      monsterHealth: levelConfig.bossHealth,
      maxMonsterHealth: levelConfig.bossHealth,
      playerHealth: currentHealth, 
      maxPlayerHealth: MAX_PLAYER_HEALTH,
      playerArmor: currentArmor,
      maxArmor: MAX_ARMOR,
      currentEnergy: currentEnergy,
      maxEnergy: MAX_ENERGY,
      heroSkillCooldown: 0,
      comboCount: 0,
      isMonsterHit: false,
      isPlayerHit: false,
      feedbackMessage: null,
      feedbackType: null,
      hand: newHand,
      availableCards: roleCards, // Store available pool
      knowledgeCollected: knowledge,
      questions: levelQuestions,
      monsterAttackProgress: 0,
      isPlayerStunned: false,
      levelTimeRemaining: LEVEL_TIME_LIMIT
    });
  };

  const startGame = (role: PlayerRole) => {
    const shuffledQuestions = shuffleArray(QUESTIONS);
    startLevel(0, 0, [], role, 0, MAX_PLAYER_HEALTH, shuffledQuestions, 0, [], 0);
  };

  const handleNextLevel = () => {
    const nextLevelIndex = gameState.currentLevelIndex + 1;
    startLevel(
      nextLevelIndex, 
      gameState.score, 
      gameState.knowledgeCollected, 
      gameState.playerRole,
      gameState.currentQuestionIndex + 1,
      gameState.playerHealth,
      gameState.questions,
      gameState.currentEnergy, 
      gameState.hand,
      gameState.playerArmor // Carry over armor
    );
  };

  // ROGUELIKE ITEM DROP
  const triggerItemDrop = (currentGameState: GameState): Partial<GameState> => {
     const rand = Math.random();
     let msg = '';
     let updates: Partial<GameState> = {};

     if (rand < 0.4) {
         msg = "获得道具: 时间沙漏 ⏳ (+30s)";
         updates = { levelTimeRemaining: currentGameState.levelTimeRemaining + 30 };
     } else if (rand < 0.7) {
         msg = "获得道具: 能量药水 🧪 (+5 ⚡)";
         updates = { currentEnergy: Math.min(currentGameState.currentEnergy + 5, MAX_ENERGY) };
     } else {
         msg = "获得道具: 急救包 💊 (+1 ❤️)";
         updates = { playerHealth: Math.min(currentGameState.playerHealth + 1, MAX_PLAYER_HEALTH) };
     }

     return { ...updates, feedbackMessage: msg, feedbackType: 'success' };
  };

  // --- HERO SKILL LOGIC ---
  const handleHeroSkill = () => {
    if (gameState.heroSkillCooldown > 0 || gameState.isPlayerStunned) return;

    if (gameState.playerRole === 'xiaowei') {
        // Courage Shield
        setGameState(prev => ({
            ...prev,
            playerArmor: Math.min(prev.playerArmor + 3, prev.maxArmor),
            heroSkillCooldown: HERO_SKILL_COOLDOWN,
            feedbackMessage: "勇气爆发! 护甲 +3",
            feedbackType: 'success'
        }));
    } else {
        // Wisdom Surge
        const roleCards = gameState.availableCards;
        const newHand = shuffleArray(roleCards).slice(0, 4).map(createHandCard);
        
        setGameState(prev => ({
            ...prev,
            currentEnergy: Math.min(prev.currentEnergy + 5, prev.maxEnergy),
            hand: newHand,
            heroSkillCooldown: HERO_SKILL_COOLDOWN,
            feedbackMessage: "魔力涌动! 能量 +5 & 手牌刷新",
            feedbackType: 'success'
        }));
    }

    setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackMessage: null }));
    }, 1500);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (gameState.isPlayerStunned) return;

    if (isCorrect) {
      // Basic Attack Logic
      const currentQ = getCurrentQuestion(gameState);
      const newCombo = gameState.comboCount + 1;
      const energyGain = newCombo >= 3 ? 2 : 1;
      
      let feedback = `平A! 伤害 ${BASIC_ATTACK_DAMAGE} 能量 +${energyGain}`;
      let extraUpdates: Partial<GameState> = {};

      if (newCombo % 5 === 0) {
          const itemEffects = triggerItemDrop({ ...gameState, comboCount: newCombo });
          extraUpdates = itemEffects;
          feedback = itemEffects.feedbackMessage || feedback; 
      } else if (newCombo >= 3) {
          feedback = `三连击! 伤害 ${BASIC_ATTACK_DAMAGE} 能量 +${energyGain}`;
      }

      setGameState(prev => {
          const newMonsterHealth = prev.monsterHealth - BASIC_ATTACK_DAMAGE;
          const isDead = newMonsterHealth <= 0;

          if (isDead) {
             setTimeout(() => {
                setGameState(curr => {
                    if (curr.currentLevelIndex < LEVELS.length - 1) {
                         return { ...curr, stage: GameStage.LEVEL_TRANSITION };
                    }
                    return { ...curr, stage: GameStage.RESULT };
                })
             }, 500);
          }

          return {
            ...prev,
            score: prev.score + 1,
            currentEnergy: Math.min(prev.currentEnergy + energyGain, prev.maxEnergy), 
            comboCount: newCombo,
            monsterHealth: Math.max(0, newMonsterHealth),
            isMonsterHit: true,
            feedbackMessage: feedback,
            feedbackType: 'success',
            currentQuestionIndex: prev.currentQuestionIndex + 1, 
            knowledgeCollected: [...prev.knowledgeCollected, `${currentQ.category}: ${currentQ.knowledgePoint}`],
            ...extraUpdates 
          }
      });

      setTimeout(() => {
        setGameState(prev => ({ ...prev, isMonsterHit: false, feedbackMessage: null }));
      }, 1500);

    } else {
      // Wrong Answer Logic: Stun + Rage Increase
      setGameState(prev => {
        let newRage = prev.monsterAttackProgress + MONSTER_RAGE_PER_MISTAKE;
        let newHealth = prev.playerHealth;
        let newArmor = prev.playerArmor;
        let msg = "答错了! 怪兽怒气上升!";
        let isHit = false;

        if (newRage >= 100) {
            newRage = 0;
            const damage = 1;
            
            // Armor Absorb Logic
            if (newArmor >= damage) {
                newArmor -= damage;
                msg = "护甲抵挡了攻击! 🛡️";
            } else {
                const remainingDmg = damage - newArmor;
                newArmor = 0;
                newHealth -= remainingDmg;
                msg = `怪兽怒气爆发! -${remainingDmg} ❤️`;
            }
            isHit = true;
        }

        const isDead = newHealth <= 0;
        
        return {
            ...prev,
            playerHealth: newHealth,
            playerArmor: newArmor,
            monsterAttackProgress: newRage,
            comboCount: 0, 
            isPlayerHit: isHit,
            isPlayerStunned: true, 
            feedbackMessage: msg,
            feedbackType: 'error',
            stage: isDead ? GameStage.GAME_OVER : GameStage.PLAYING
        }
      });

      setTimeout(() => {
        setGameState(prev => {
             if (prev.stage === GameStage.GAME_OVER) return prev; 
             return {
                ...prev,
                isPlayerStunned: false,
                isPlayerHit: false,
                feedbackMessage: null,
                feedbackType: null,
                currentQuestionIndex: prev.currentQuestionIndex + 1, 
                stage: GameStage.PLAYING
             }
        });
      }, STUN_DURATION);
    }
  };

  const handleCardUse = (card: Card) => {
    if (gameState.currentEnergy < card.cost || gameState.isPlayerStunned) return;

    const usedHandCard = card as HandCard;
    const remainingHand = gameState.hand.filter(c => c.uniqueId !== usedHandCard.uniqueId);
    
    // Draw new card from Available Role Cards
    const nextCardTemplate = shuffleArray(gameState.availableCards)[0];
    const nextHandCard = createHandCard(nextCardTemplate);
    const newHand = [...remainingHand, nextHandCard];

    // HEALING
    if (card.effectType === 'heal') {
         setGameState(prev => ({
            ...prev,
            playerHealth: Math.min(prev.playerHealth + (card.value || 1), prev.maxPlayerHealth),
            currentEnergy: prev.currentEnergy - card.cost, 
            feedbackMessage: `恢复 ${card.value} 颗心!`,
            feedbackType: 'success',
            hand: newHand
         }));
         setTimeout(() => setGameState(p => ({...p, feedbackMessage: null})), 1200);
         return;
    }

    // DEFENSE
    if (card.effectType === 'defense') {
         setGameState(prev => ({
            ...prev,
            playerArmor: Math.min(prev.playerArmor + (card.value || 3), prev.maxArmor),
            currentEnergy: prev.currentEnergy - card.cost, 
            feedbackMessage: `护甲增加 ${card.value}!`,
            feedbackType: 'success',
            hand: newHand
         }));
         setTimeout(() => setGameState(p => ({...p, feedbackMessage: null})), 1200);
         return;
    }

    // DAMAGE
    const currentBoss = LEVELS[gameState.currentLevelIndex];
    const { finalDamage, text } = getDamageAnalysis(card.element, currentBoss.element, card.value);

    setGameState(prev => ({
      ...prev,
      isMonsterHit: true,
      currentEnergy: prev.currentEnergy - card.cost, 
      feedbackMessage: `${text} -${finalDamage}`,
      hand: newHand
    }));

    setTimeout(() => {
      setGameState(prev => {
        const newMonsterHealth = prev.monsterHealth - finalDamage;
        const isDead = newMonsterHealth <= 0;
        
        if (isDead) {
          if (prev.currentLevelIndex < LEVELS.length - 1) {
            return {
              ...prev,
              monsterHealth: 0,
              isMonsterHit: false,
              feedbackMessage: null,
              stage: GameStage.LEVEL_TRANSITION
            };
          } else {
            return {
              ...prev,
              monsterHealth: 0,
              isMonsterHit: false,
              feedbackMessage: null,
              stage: GameStage.RESULT
            };
          }
        }

        return {
          ...prev,
          monsterHealth: newMonsterHealth,
          isMonsterHit: false,
          feedbackMessage: null,
          stage: GameStage.PLAYING
        };
      });
    }, 1200);
  };

  const restartGame = () => {
    setGameState(prev => ({
      ...prev,
      stage: GameStage.START
    }));
  };

  return (
    <div className="font-sans text-gray-900 h-full">
      {gameState.stage === GameStage.START && (
        <StartView onStart={startGame} />
      )}
      
      {(gameState.stage === GameStage.PLAYING || gameState.stage === GameStage.LEVEL_TRANSITION) && (
        <GameView 
          currentQuestion={getCurrentQuestion(gameState)}
          gameState={gameState}
          currentLevel={LEVELS[gameState.currentLevelIndex]}
          onAnswer={handleAnswer}
          onCardSelect={handleCardUse}
          onNextLevel={handleNextLevel}
          onHeroSkill={handleHeroSkill}
        />
      )}

      {(gameState.stage === GameStage.RESULT || gameState.stage === GameStage.GAME_OVER) && (
        <ResultView 
          score={gameState.score}
          monsterHealth={gameState.monsterHealth}
          isGameOver={gameState.stage === GameStage.GAME_OVER}
          playerRole={gameState.playerRole} 
          knowledgeCollected={gameState.knowledgeCollected}
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}