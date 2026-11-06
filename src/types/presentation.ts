export interface SceneConfig {
  index: number;
  kicker: string;
  title: string;
  name: string;
  duration: number; // in seconds
  script: string;
}

export type ViewMode = 'audience' | 'presenter' | 'preview';

export interface SyncMessage {
  type: 'NAVIGATE' | 'PING' | 'PONG' | 'TIMER_STATE';
  scene?: number;
  timestamp: number;
  timerRunning?: boolean;
}
