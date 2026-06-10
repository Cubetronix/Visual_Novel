export interface Choice {
  text: string;
  nextNodeId: string;
  achievementId?: string;
  divergenceChange?: number;
  phoneRequired?: boolean;
}

export interface DMailOption {
  id: string;
  subject: string;
  body: string;
  destination: string; // Phone number or contact
  impactDivergence: number;
  nextNodeId: string;
  description: string;
}

export interface PhoneTriggerData {
  availableDMails: DMailOption[];
  promptText: string;
}

export interface StoryNode {
  id: string;
  speaker: string;
  text: string;
  characterLeft?: "okabe" | "kurisu" | "mayuri" | "daru" | "none";
  characterLeftExpression?: "default" | "smug" | "blush" | "shocked" | "sad" | "laugh" | "serious";
  characterRight?: "okabe" | "kurisu" | "mayuri" | "daru" | "none";
  characterRightExpression?: "default" | "smug" | "blush" | "shocked" | "sad" | "laugh" | "serious";
  background: "lab" | "radio_building" | "akihabara" | "black" | "time_tunnel" | "shrine";
  choices?: Choice[];
  phoneTrigger?: PhoneTriggerData;
  next?: string;
  divergence?: number; // Show divergence change if it triggers Reading Steiner
  bgmEffect?: "ambient" | "tension" | "sad" | "tutturu" | "action" | "none";
  sfxEffect?: "click" | "phone_ring" | "steiner" | "beep" | "tutturu_vo" | "fuahaha_vo" | "christina_vo" | "laser" | "fail";
  achievementToUnlock?: string;
}

export interface SaveSlot {
  id: number;
  dateTime: string;
  nodeId: string;
  divergence: number;
  summaryText: string;
  activeAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  category: "story" | "secret" | "joke";
  iconName: string;
}

export interface GameState {
  currentNodeId: string;
  divergence: number; // e.g. 0.337187
  history: string[]; // text backlogs
  unlockedAchievements: string[];
  currentBgm: string;
  phoneOpen: boolean;
  phoneUnread: boolean;
  textSpeed: number; // ms per char
  isMuted: boolean;
  textLog: { speaker: string; text: string }[];
}
