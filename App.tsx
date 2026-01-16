import React, { useState } from 'react';
import { StartView } from './components/StartView';
import { GameView } from './components/GameView';
import { ResultView } from './components/ResultView';
import { QUESTIONS, LEVELS, CARDS, MAX_PLAYER_HEALTH, MAX_ENERGY } from './constants';
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

// Modified to use the specific game session's randomized questions
const getCurrentQuestion = (gameState: GameState) => {
  const { questions, currentQuestionIndex } = gameState;
  if (!questions || questions.length === 0) return QUESTIONS[0];
  if (currentQuestionIndex < questions.length) return questions[currentQuestionIndex];
  return questions[currentQuestionIndex % questions.length]; 
};

// Elemental Effectiveness Logic
const getDamageAnalysis = (cardEl: ElementType, bossEl: ElementType, baseDamage: number): { finalDamage: number, text: string, type: 'normal' | 'weak' | 'resist' } => {
    if (cardEl === 'heal') return { finalDamage: 0, text: '恢复', type: 'normal' };

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
    currentEnergy: 0,
    maxEnergy: MAX_ENERGY,
    comboCount: 0,
    isMonsterHit: false,
    isPlayerHit: false,
    feedbackMessage: null,
    feedbackType: null,
    hand: [],
    availableCards: [],
    knowledgeCollected: [],
    questions: [], 
  });

  const startLevel = (
    levelIndex: number, 
    currentScore: number, 
    knowledge: string[], 
    role: PlayerRole, 
    qIndex: number, 
    currentHealth: number,
    levelQuestions: Question[],
    currentEnergy: number,
    currentHand: HandCard[]
  ) => {
    const levelConfig = LEVELS[levelIndex];
    // If hand is empty (first start), deal 4 cards
    const initialHand = currentHand.length > 0 
        ? currentHand 
        : shuffleArray(CARDS).slice(0, 4).map(createHandCard);

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
      currentEnergy: currentEnergy,
      maxEnergy: MAX_ENERGY,
      comboCount: 0,
      isMonsterHit: false,
      isPlayerHit: false,
      feedbackMessage: null,
      feedbackType: null,
      hand: initialHand,
      availableCards: [],
      knowledgeCollected: knowledge,
      questions: levelQuestions
    });
  };

  const startGame = (role: PlayerRole) => {
    // Randomize questions at the start of the game
    const shuffledQuestions = shuffleArray(QUESTIONS);
    startLevel(0, 0, [], role, 0, MAX_PLAYER_HEALTH, shuffledQuestions, 0, []);
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
      gameState.currentEnergy, // Carry over energy
      gameState.hand // Carry over hand
    );
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const currentQ = getCurrentQuestion(gameState);
      const newCombo = gameState.comboCount + 1;
      
      // Energy Logic: +2 for 3+ combo, otherwise +1
      const energyGain = newCombo >= 3 ? 2 : 1;
      
      let feedback = `能量 +${energyGain}`;
      if (newCombo >= 3) feedback = `三连对！能量 +${energyGain}`;

      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        currentEnergy: Math.min(prev.currentEnergy + energyGain, prev.maxEnergy), // Use calculated gain
        comboCount: newCombo,
        feedbackMessage: feedback,
        feedbackType: 'success',
        stage: GameStage.PLAYING, // Stay in playing
        currentQuestionIndex: prev.currentQuestionIndex + 1, // Next Question immediately
        knowledgeCollected: [...prev.knowledgeCollected, `${currentQ.category}: ${currentQ.knowledgePoint}`]
      }));

      // Short feedback duration
      setTimeout(() => {
        setGameState(prev => ({ ...prev, feedbackMessage: null }));
      }, 1000);

    } else {
      // Wrong Answer Logic: Boss Attacks
      setGameState(prev => {
        const newHealth = prev.playerHealth - 1;
        const isDead = newHealth <= 0;
        
        return {
            ...prev,
            playerHealth: newHealth,
            comboCount: 0, // Reset combo
            isPlayerHit: true,
            feedbackMessage: "受到伤害！",
            feedbackType: 'error',
            stage: isDead ? GameStage.GAME_OVER : GameStage.PLAYING
        }
      });

      // Clear hit effect after delay
      setTimeout(() => {
        setGameState(prev => {
             if (prev.stage === GameStage.GAME_OVER) return prev; 
             
             return {
                ...prev,
                isPlayerHit: false,
                feedbackMessage: null,
                feedbackType: null,
                currentQuestionIndex: prev.currentQuestionIndex + 1, 
                stage: GameStage.PLAYING
             }
        });
      }, 1500);
    }
  };

  const handleCardUse = (card: Card) => {
    if (gameState.currentEnergy < card.cost) return;

    const usedHandCard = card as HandCard;

    // Conveyor Belt Mechanism:
    // 1. Remove the used card (filtering by uniqueId)
    // 2. Add a new random card to the END of the hand
    const remainingHand = gameState.hand.filter(c => c.uniqueId !== usedHandCard.uniqueId);
    
    // Pick new random card
    const nextCardTemplate = shuffleArray(CARDS)[0];
    const nextHandCard = createHandCard(nextCardTemplate);
    
    const newHand = [...remainingHand, nextHandCard];

    // HEALING LOGIC
    if (card.effectType === 'heal') {
         setGameState(prev => {
            const healAmount = card.value === 0 ? 1 : card.value; 
            const newHealth = Math.min(prev.playerHealth + healAmount, prev.maxPlayerHealth);
            
            return {
                ...prev,
                playerHealth: newHealth,
                currentEnergy: prev.currentEnergy - card.cost, // Deduct Cost
                feedbackMessage: `恢复 ${healAmount} 颗心!`,
                feedbackType: 'success',
                hand: newHand
            };
         });
         
         setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                feedbackMessage: null,
            }));
         }, 1200);
         return;
    }

    // DAMAGE LOGIC
    const currentBoss = LEVELS[gameState.currentLevelIndex];
    const { finalDamage, text } = getDamageAnalysis(card.element, currentBoss.element, card.value);

    setGameState(prev => ({
      ...prev,
      isMonsterHit: true,
      currentEnergy: prev.currentEnergy - card.cost, // Deduct Cost
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
        />
      )}

      {(gameState.stage === GameStage.RESULT || gameState.stage === GameStage.GAME_OVER) && (
        <ResultView 
          score={gameState.score}
          monsterHealth={gameState.monsterHealth}
          isGameOver={gameState.stage === GameStage.GAME_OVER}
          playerRole={gameState.playerRole} // New Prop
          knowledgeCollected={gameState.knowledgeCollected}
          onRestart={restartGame} 
        />
      )}
    </div>
  );
}