import {Request, Response} from 'express';
import {TASKS} from "./db-data.js";
import {setTimeout} from 'timers';


export function modifyTask(req: Request, res: Response) {

    const id = req.params["id"],
        changes = req.body;

    console.log("Guardando cambios en la tarea...", id, JSON.stringify(changes));

    const newTask = {
      ...TASKS[id],
      ...changes
    };

    TASKS[id] = newTask;

    console.log("new task version", newTask);

    // Retraso de 2 segundos para simular un servidor.
    setTimeout(() => {

        res.status(200).json(TASKS[id]);

    }, 2000);

}