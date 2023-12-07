import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SERVER_DELAY, SECRET_KEY,authenticate } from './db-data.js';

export function loginUser(req: Request, res: Response) {
  console.log("User login attempt ...");

  const { username, password } = req.body;

  const user = authenticate(username, password);

  // Delay to simulate server response time
  setTimeout(() => {
    if (user) {
      // Generate JWT
      const token = jwt.sign({ username: user.username, userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

      res.status(200).json({ username: user.username, token });
    } else {
      res.sendStatus(403);
    }
  }, SERVER_DELAY);
}