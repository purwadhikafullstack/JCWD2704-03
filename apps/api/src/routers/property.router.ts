import { Router } from 'express';
import { verifyUser } from '../middlewares/auth.middleware';
import { PropertyController } from '@/controllers/property.controller';
import { blobUploader } from '../libs/multer';
import { verifyTenant } from '@/middlewares/role.middleware';

export class PropertyRouter {
  private router: Router;
  private propertyController: PropertyController;

  constructor() {
    this.propertyController = new PropertyController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/v1', this.propertyController.getRoomAvailability);
    this.router.get('/search', this.propertyController.searchProperties);
    this.router.get('/:name', this.propertyController.getPropertyDetail);
    this.router.get(
      '/detail/:propertyId',
      this.propertyController.getPropertyDetailHost,
    );
    this.router.get('/room/:id', this.propertyController.getRoomById);
    this.router.get('/image/:id', this.propertyController.renderPicProp);
    // this.router.get(
    //   '/room/image/:roomId',
    //   this.propertyController.renderPicRoom,
    // );
    this.router.post(
      '/',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.propertyController.createProperty,
    );
    this.router.patch(
      '/:propertyId',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.propertyController.updateProperty,
    );
    this.router.get(
      '/',
      verifyUser,
      verifyTenant,
      this.propertyController.getAllPropertyByTenantId,
    );
    this.router.get(
      '/detail/:propertyId',
      this.propertyController.getPropertyDetailHost,
    );
    // this.router.get(
    //   '/room/image/:roomId',
    //   this.propertyController.renderPicRoom,
    // );
    this.router.post(
      '/',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.propertyController.createProperty,
    );
    this.router.patch(
      '/:propertyId',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.propertyController.updateProperty,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
