import * as express from 'express';
import cors from 'cors';

import {getAllTasks} from "./get-tasks.route.js";
import {saveTask} from './save-task.route.js';
import {deleteTask} from './delete-task.route.js';
import {loginUser} from './login.route.js';

import { verifyToken } from './middleware.js';


const app: express.Express = express.default();

app.use(express.json()); 
app.use(cors({origin: true}));

// Rutas
app.route('/api/tasks').get(verifyToken, getAllTasks);
app.route('/api/tasks/:id').put(verifyToken, saveTask);
app.route('/api/tasks/:id').delete(verifyToken, deleteTask);


app.route('/api/login').post(loginUser);

const httpServer: any = app.listen(9000, () => {
    const port = (httpServer.address() as any).port;
    console.log(`HTTP REST API Server running at http://localhost:${port}`);
});