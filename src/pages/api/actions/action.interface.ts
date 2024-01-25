import type {ActionInput, ActionOutput} from './input.output.types'

// src/action.interface.ts
export interface Action {
    id: string;
    name: string;
    description?: string;
    inputs?: ActionInput[];
    outputs?: ActionOutput[];
  }