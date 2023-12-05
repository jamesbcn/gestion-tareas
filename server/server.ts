import * as express from 'express';
import cors from 'cors';

import {getAllTasks} from "./get-tasks.route.js";
import {editTask} from './edit-task.route.js';
import {loginUser} from './login.route.js';

const app: express.Express = express.default();

app.use(express.json()); 
app.use(cors({origin: true}));

// Rutas
app.route('/api/tasks').get(getAllTasks);

app.route('/api/tasks/:id').put(editTask);

app.route('/api/login').post(loginUser);

const httpServer: any = app.listen(9000, () => {
    const port = (httpServer.address() as any).port;
    console.log(`HTTP REST API Server running at http://localhost:${port}`);
});