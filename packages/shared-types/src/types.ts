// Database entity types

export interface User {
  id: string;
  email: string;
  username?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuitAttempt {
  id: string;
  userId: string;
  quitDate: Date;
  productType: string;
  dailyUsage: number;
  cost?: number;
  reasons: string[];
  triggers: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface ProgressLog {
  id: string;
  quitAttemptId: string;
  logDate: Date;
  cravingsCount: number;
  moodRating?: number;
  notes?: string;
  createdAt: Date;
}

export interface TriggerLog {
  id: string;
  quitAttemptId: string;
  triggerType: string;
  intensity: number;
  location?: string;
  copingStrategy: string;
  wasSuccessful: boolean;
  occurredAt: Date;
  notes?: string;
}

export interface SlipLog {
  id: string;
  quitAttemptId: string;
  occurredAt: Date;
  quantity?: number;
  triggerType?: string;
  circumstances: string;
  feelings: string;
  lessonLearned?: string;
}

export interface Milestone {
  id: string;
  quitAttemptId: string;
  milestoneType: string;
  achievedAt: Date;
  celebrated: boolean;
  sharedPublicly: boolean;
}

export interface UserSettings {
  userId: string;
  notificationsEnabled: boolean;
  notificationTimes: string[];
  theme: 'light' | 'dark' | 'system';
  currency: string;
  cigaretteCost?: number;
  cigarettesPerDay?: number;
  updatedAt: Date;
}

export interface EducationProgress {
  id: string;
  userId: string;
  moduleId: string;
  lessonId: string;
  completedAt: Date;
}

// Frontend-specific types

export interface StreakData {
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
}

export interface CalculatedStats {
  moneySaved: number;
  timeFreed: number; // in minutes
  unitsAvoided: number;
  projection5Year: {
    moneySaved: number;
    timeFreed: number; // in hours
  };
}

export interface MilestoneDefinition {
  id: string;
  name: string;
  hours: number;
  description: string;
  icon: string;
  healthBenefit?: string;
}

export interface CoachingMessage {
  day: number;
  headline: string;
  message: string;
  actionStep?: string;
}
