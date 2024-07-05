import { Router } from 'express';
import { UserController } from '../controllers/users.controller';
import { verifyUser } from '../middlewares/auth.middleware';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/v1', this.userController.userRegisterEmail);
    this.router.post('/v2', this.userController.tenantRegisterEmail);
    this.router.get('/verify/:token', this.userController.sendVerif);
    this.router.patch('/v3', this.userController.userEntryData);
  }

  getRouter(): Router {
    return this.router;
  }
}
