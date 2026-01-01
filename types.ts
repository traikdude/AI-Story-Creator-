
import { ReactNode } from 'react';

export interface AdventureTheme {
  id: string;
  title: string;
  description: string;
  keywords: string;
  icon: ReactNode;
  imageUrl: string;
}

export interface Scene {
  scene: string;
  description: string;
  character: string;
  mutter: string;
  dialogue: string;
  action: string;
  imagePrompt: string;
}

export interface Choice {
  text: string;
}

export interface StoryPart {
  scene: Scene;
  choices: Choice[];
  imageUrl: string;
  userChoice?: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  history: StoryPart[];
}

export type Page = 
  | { name: 'home' }
  | { name: 'custom' }
  | { name: 'story'; data: Story };
