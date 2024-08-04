const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000';

export const imageSrc = `${baseUrl}/api/properties/image/`;
export const imageSrcRoom = `${baseUrl}/api/rooms/image/`;
export const imageSrcUser = `${baseUrl}/api/users/image/`;
