import { NextFunction, Request, Response } from 'express';
import { prisma } from '../libs/prisma';

export const verifyTenant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user?.role !== 'tenant') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Access is allowed for sellers only' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyBuyer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID found' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user?.role !== 'user') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Access is allowed for buyers only' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEventOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { propertyId } = req.params;

    const event = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { tenant_id: true }, // Hanya ambil ID pemilik acara
    });

    if (event && event.tenant_id === req.user?.id) {
      next();
    } else {
      res
        .status(403)
        .json({ error: 'Access denied. You are not the owner of this event.' });
    }
  } catch (error) {
    console.error('Error verifying event owner:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
