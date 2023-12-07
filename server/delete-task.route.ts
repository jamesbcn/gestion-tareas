import { Request, Response } from 'express';
import { TASKS } from "./db-data.js";

export function deleteTask(req: Request, res: Response) {

    const id = Number(req.params["id"]);

    if (!(id in TASKS)) {
        res.status(404).json({ error: 'Task not found' });
      }
    
      // Remove the task from the object
      const deletedTask = TASKS[id];
      delete TASKS[id];
    
    console.log("Borrando la tarea...", id);

    // Retraso de 1 segundo para simular un servidor.
    setTimeout(() => res.status(200).json(deletedTask) ,1000);

    
};