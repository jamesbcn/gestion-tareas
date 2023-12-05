import {Request, Response} from 'express';
import {TASKS} from "./db-data.js";



export function getAllTasks(req: Request, res: Response) {

        // Retraso de 1,5 segundos para simular un servidor.
        setTimeout(() => {

             res.status(200).json({payload:Object.values(TASKS)});

        }, 1500);


}