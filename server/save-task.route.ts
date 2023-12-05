import {Request, Response} from 'express';
import {TASKS} from "./db-data.js";
import {setTimeout} from 'timers';


export function saveTask(req: Request, res: Response) {

    const id = req.params["id"],
        changes = req.body;

    console.log("Guardando cambios en la tarea...", id, JSON.stringify(changes));

    const saveTask = {
      ...TASKS[id],
      ...changes
    };

    TASKS[id] = saveTask;

    console.log("new task version", saveTask);

    res.status(200).json(TASKS[id]);


}