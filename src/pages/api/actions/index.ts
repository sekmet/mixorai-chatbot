// src/actions/index.ts
import * as fs from 'fs';
import * as path from 'path';
import { Action } from './action.interface';

const actionsPath = path.join(__dirname, '../actions');

export function executeAction(action: Action, inputData: any): Promise<any> {
  const actionFile = path.join(actionsPath, `${action.id}.js`);

  if (!fs.existsSync(actionFile)) {
    throw new Error(`Action "${action.name}" does not exist.`);
  }

  const actionFunction = require(actionFile).default;

  try {
    return actionFunction(inputData);
  } catch (error: any) {
    console.error('Error executing action:', error);
    throw error;
  }
}
