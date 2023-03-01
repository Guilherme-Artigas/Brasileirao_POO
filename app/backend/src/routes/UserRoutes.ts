import { Router, Request, Response } from 'express';
import UserController from '../controllers/UserController';
import UserService from '../services/UserService';

const userRoutes = Router();

const userService = new UserService();

const userController = new UserController(userService);

userRoutes.post(
  '/',
  (req: Request, res: Response) => userController.userLogin(req, res),
);

export default userRoutes;
