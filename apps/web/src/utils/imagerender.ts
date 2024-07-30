const baseUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

export const imageSrc = `${baseUrl}properties/image/`;
export const imageSrcRoom = `${baseUrl}rooms/image/`;
export const imageSrcUser = `${baseUrl}users/image/`;
