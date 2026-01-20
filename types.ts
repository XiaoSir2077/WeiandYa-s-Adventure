
export enum GameStage {
  START = 'START',
  PLAYING = 'PLAYING',
  CARD_SELECT = 'CARD_SELECT', 
  LEVEL_TRANSITION = 'LEVEL_TRANSITION',
  GAME_OVER = 'GAME_OVER', 
  RESULT = 'RESULT'
}

export type PlayerRole = 'xiaowei' | 'xiaoya';

export type ElementType = 'physical' | 'fire' | 'water' | 'nature' | 'light' | 'dark' | 'heal';

export type CardEffect = 'damage' | 'heal' | 'defense'; // Added defense

export interface LevelConfig {
  levelNumber: number;
  name: string;
  bossName: string;
  bossIcon: string;
  bossHealth: number;
  bgGradient: string;
  bgImage: string; 
  themeColor: string;
  element: ElementType;
  monsterAttackInterval: number; 
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
  cost: number; 
  effectType: CardEffect; 
  rarity: 'common' | 'rare' | 'legendary';
  icon: string;
  color: string;
  animationClass: string;
  element: ElementType;
  allowedRoles?: PlayerRole[]; // New: Restrict cards to specific roles
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
  
  // --- New Player Stats ---
  playerArmor: number; // New: Armor value
  maxArmor: number;
  currentEnergy: number; 
  maxEnergy: number; 
  heroSkillCooldown: number; // New: Seconds remaining
  
  comboCount: number; 
  isMonsterHit: boolean;
  isPlayerHit: boolean;
  feedbackMessage: string | null;
  feedbackType: 'success' | 'error' | null;
  hand: HandCard[]; 
  availableCards: Card[]; 
  knowledgeCollected: string[];
  questions: Question[]; 
  
  monsterAttackProgress: number; 
  isPlayerStunned: boolean; 
  levelTimeRemaining: number; 
}
