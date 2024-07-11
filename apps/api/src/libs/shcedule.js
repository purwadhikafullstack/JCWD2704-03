const dateFromDB = new Date('2024-07-12T00:00:00.000Z');
function getCronExpression(date) {
  const minute = date.getUTCMinutes();
  const hours = date.getUTCHours();
  const dayOfMonth = date.getUTCDate() - 1;
  const month = date.getUTCMonth() + 1;
  return `${minute} ${hours} ${dayOfMonth} ${month} *`;
}

console.log(dateFromDB);
console.log(getCronExpression(dateFromDB));
