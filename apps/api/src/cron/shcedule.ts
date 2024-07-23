import sendBookingReminders from './reminder';

const cron = require('node-cron');
// Schedule to run every day at midnight
cron.schedule('0 0 * * *', async (orderId: any) => {
  await sendBookingReminders(orderId);
  console.log('Booking reminders checked and sent if any.');
});
