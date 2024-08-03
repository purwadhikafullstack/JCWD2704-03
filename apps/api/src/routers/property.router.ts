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
    this.router.get('/detail/:name', this.propertyController.getPropertyDetail);
    this.router.get(
      '/myDetail/:propertyId',
      verifyUser,
      verifyTenant,
      this.propertyController.getPropertyDetailHost,
    );
    this.router.get('/room/:id', this.propertyController.getRoomById);
    this.router.get('/image/:picName', this.propertyController.renderPicProp);
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
      '/myProperty',
      verifyUser,
      verifyTenant,
      this.propertyController.getAllPropertyByTenantId,
    );
    this.router.get(
      '/prop/:id',
      this.propertyController.getProfilePropertyByTenantId,
    );
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
    this.router.patch(
      '/del/:propertyId',
      verifyUser,
      verifyTenant,
      this.propertyController.deleteProperty,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
