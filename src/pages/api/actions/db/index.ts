// src/db/index.ts
import * as sqlite3 from 'sqlite3';
import { Action } from '../action.interface';

const db = new sqlite3.Database(':memory:');

async function addAction(action: Action): Promise<void> {
  await db.run('INSERT INTO actions (name, description) VALUES (?, ?)', [action.name, action.description]);
}

async function updateAction(action: Action): Promise<void> {
  await db.run('UPDATE actions SET description = ? WHERE name = ?', [action.description, action.name]);
}

async function deleteAction(actionName: string): Promise<void> {
  await db.run('DELETE FROM actions WHERE name = ?', [actionName]);
}

async function getActions(): Promise<Action[]> {
    const result: Action[] = [];
    await db.all('SELECT * FROM actions', function(err, rows) { 

    console.log ('rows ', rows)
    return rows.map((row: any) => {
        result.push({
        id: row.id,
        name: row.name,
        description: row.description,
        inputs: row.inputs,
        outputs: row.outputs,
      })
    });

  });

  return result;

}

export { addAction, updateAction, deleteAction, getActions };