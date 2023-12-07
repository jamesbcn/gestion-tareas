import {Request, Response} from 'express';
import {TASKS, SERVER_DELAY} from "./db-data.js";



export function getAllTasks(req: Request, res: Response) {

        // Retraso de para simular un servidor.
        setTimeout(() => {

             res.status(200).json({payload:Object.values(TASKS)});

        }, SERVER_DELAY);


}