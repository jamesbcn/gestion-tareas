import {Request, Response} from 'express';
import {SERVER_DELAY, authenticate} from "./db-data.js";


export function loginUser(req: Request, res: Response) {

  console.log("User login attempt ...");

  const {username, password} = req.body;

  console.log(req.body)

  const user = authenticate(username, password);

  // Retraso para simular un servidor.
  setTimeout(() => {

    if (user) {
      res.status(200).json({username: user.username});
    }
    else {
      res.sendStatus(403);
    }

  },SERVER_DELAY);

}