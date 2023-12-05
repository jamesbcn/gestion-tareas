import {Request, Response} from 'express';
import {TASKS} from "./db-data.js";
import {setTimeout} from 'timers';


export function editTask(req: Request, res: Response) {

    const id = req.params["id"],
        changes = req.body;

    console.log("Guardando cambios en la tarea...", id, JSON.stringify(changes));

    const newCourse = {
      ...TASKS[id],
      ...changes
    };

    TASKS[id] = newCourse;

    console.log("new course version", newCourse);

    // Retraso de 2 segundos para simular un servidor.
    setTimeout(() => {

        res.status(200).json(TASKS[id]);

    }, 2000);

}