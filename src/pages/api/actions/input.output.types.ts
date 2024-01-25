// src/input.output.types.ts
import { Action } from './action.interface';

export type ActionInput = {
  name: string;
  type: string;
  description?: string;
  defaultValue?: any;
};

export type ActionOutput = {
  name: string;
  type: string;
  description?: string;
  defaultValue?: any;
};