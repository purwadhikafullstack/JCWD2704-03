import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const scheduleRoomAvailabilityUpdate = (
  date: Date,
  roomId: string,
  totalRooms: number,
  increase: boolean,
) => {
  var cron = require('node-cron');
  const task = cron.schedule(
    date.getSeconds() +
      ' ' +
      date.getMinutes() +
      ' ' +
      date.getHours() +
      ' ' +
      date.getDate() +
      ' ' +
      (date.getMonth() + 1) +
      ' *',
    async () => {
      const room = await prisma.room.findFirst({ where: { id: roomId } });
      if (!room) {
        throw new Error('Room not found');
      }

      const newAvailability = increase
        ? room.availability + totalRooms
        : room.availability - totalRooms;
      await prisma.room.update({
        where: { id: roomId },
        data: {
          availability: newAvailability,
        },
      });

      // Stop the task once it's executed
      task.stop();
    },
  );

  task.start();
};
