export enum GameStage {
  START = 'START',
  PLAYING = 'PLAYING',
  CARD_SELECT = 'CARD_SELECT', // Deprecated in new logic but kept for type safety if needed
  LEVEL_TRANSITION = 'LEVEL_TRANSITION',
  GAME_OVER = 'GAME_OVER', 
  RESULT = 'RESULT'
}

export type PlayerRole = 'xiaowei' | 'xiaoya';

export type ElementType = 'physical' | 'fire' | 'water' | 'nature' | 'light' | 'dark' | 'heal';

export type CardEffect = 'damage' | 'heal';

export interface LevelConfig {
  levelNumber: number;
  name: string;
  bossName: string;
  bossIcon: string;
  bossHealth: number;
  bgGradient: string;
  bgImage: string; // New field for background image
  themeColor: string;
  element: ElementType;
}

export interface Question {
  id: number;
  category: string;
  text: string;
  options: string[];
  correctAnswer: string;
  knowledgePoint: string;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  value: number; 
  cost: number; // New: Energy cost
  effectType: CardEffect; 
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  color: string;
  animationClass: string;
  element: ElementType;
}

export interface HandCard extends Card {
  uniqueId: string;
}

export interface GameState {
  stage: GameStage;
  playerRole: PlayerRole;
  currentLevelIndex: number;
  currentQuestionIndex: number;
  score: number;
  monsterHealth: number;
  maxMonsterHealth: number;
  playerHealth: number; 
  maxPlayerHealth: number; 
  currentEnergy: number; // New: Current Energy points
  maxEnergy: number; // New: Max Energy points
  comboCount: number; 
  isMonsterHit: boolean;
  isPlayerHit: boolean;
  feedbackMessage: string | null;
  feedbackType: 'success' | 'error' | null;
  hand: HandCard[]; // New: Cards currently available to play
  availableCards: Card[]; // Deprecated, replaced by hand
  knowledgeCollected: string[];
  questions: Question[]; 
}