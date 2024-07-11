import propertyController from '@/controllers/property.controller';
import { Router } from 'express';
class PropertyRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }
  initializedRoutes() {
    this.router.get('/:Id', propertyController.getAllRoom);
    this.router.get('/room/:id', propertyController.getRoomById);
    this.router.get('/image/:propertyId', propertyController.renderPicProp);
    this.router.get('/room/image/:roomId', propertyController.renderPicRoom);
  }
  getRouter() {
    return this.router;
  }
}

export default new PropertyRouter();
