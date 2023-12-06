import {Request, Response} from 'express';
import {TASKS} from "./db-data.js";


export function saveTask(req: Request, res: Response) {
  try {
      const id = req.params["id"];
      const changes = req.body;

      console.log("Guardando cambios en la tarea...", id, JSON.stringify(changes));

      if (id && TASKS[id]) {
          // Update existing task
          const updatedTask = {
              ...TASKS[id],
              ...changes
          };

          TASKS[id] = updatedTask;

          console.log("Updated task version", updatedTask);

          res.status(200).json(updatedTask);
      } else {
          // Create a new task with a generated ID
          const newId = generateNewId();
          const newTask = {
              id: newId,
              ...changes
          };

          TASKS[newId] = newTask;

          console.log("New task version", newTask);

          res.status(200).json(newTask);
      }
  } catch (error) {
      console.error("Error saving task:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}

function generateNewId(): string {
  return Date.now().toString();
}