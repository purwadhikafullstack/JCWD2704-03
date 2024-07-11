import { Router } from 'express';
import { verifyUser } from '../middlewares/auth.middleware';
import { PropertyController } from '@/controllers/property.controller';

export class PropertyRouter {
  private router: Router;
  private propertyController: PropertyController;

  constructor() {
    this.propertyController = new PropertyController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/v1', this.propertyController.getRoomAvailability);
    this.router.get('/search', this.propertyController.searchProperties);
    this.router.get('/:Id', this.propertyController.getAllRoom);
    this.router.get('/room/:id', this.propertyController.getRoomById);
    this.router.get(
      '/image/:propertyId',
      this.propertyController.renderPicProp,
    );
    this.router.get(
      '/room/image/:roomId',
      this.propertyController.renderPicRoom,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
