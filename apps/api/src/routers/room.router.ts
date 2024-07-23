import { Router } from 'express';
import { verifyUser } from '../middlewares/auth.middleware';
import { PropertyController } from '@/controllers/property.controller';
import { blobUploader } from '../libs/multer';
import { verifyTenant } from '@/middlewares/role.middleware';
import roomController, { RoomController } from '@/controllers/room.controller';

export class RoomRouter {
  private router: Router;
  private roomController: RoomController;

  constructor() {
    this.roomController = new RoomController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/v1', this.propertyController.getRoomAvailability);
    this.router.post(
      '/create/:propertyId',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.roomController.createRoom,
    );
    this.router.patch(
      '/edit/:roomCategoryId',
      verifyUser,
      verifyTenant,
      blobUploader().single('pic'),
      this.roomController.updateRoom,
    );
    this.router.delete(
      '/d/:roomCategoryId',
      verifyUser,
      verifyTenant,
      this.roomController.deleteRoom,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
