const generateRandomString = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Function to generate invoice code
export const generateInvoice = (id: string) => {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const propertyIdPrefix = id.substring(0, 5);
  const randomString = generateRandomString(5); // Generate a random string of 5 characters
  return `INV-${date}-${propertyIdPrefix}-${randomString}`;
};
