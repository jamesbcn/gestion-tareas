import {Request, Response} from 'express';
import {authenticate} from "./db-data.js";


export function loginUser(req: Request, res: Response) {

  console.log("User login attempt ...");

  const {username, password} = req.body;

  console.log(req.body)

  const user = authenticate(username, password);

  if (user) {
    res.status(200).json({username: user.username});
  }
  else {
    res.sendStatus(403);
  }

}