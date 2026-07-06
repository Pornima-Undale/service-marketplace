export type Role = 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export interface DecodedToken {
  sub: string;      // email
  role: Role;
  iat: number;
  exp: number;
}

export interface AuthUser {
  email: string;
  role: Role;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface ServiceCategory {
  id: number;
  name: string;
}

export interface ServiceResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  categoryName: string;
  providerName: string;
}

export interface ServicePayload {
  title: string;
  description: string;
  price: number;
  category?: { id: number };
  provider?: { id: number };
}

export interface ProviderProfile {
  id?: number;
  businessName: string;
  description: string;
  latitude?: number;
  longitude?: number;
  user?: { id: number };
}

export interface BookingRequest {
  serviceId: number;
  bookingDate: string;
}

export interface BookingResponse {
  id: number;
  bookingDate: string;
  status: BookingStatus;
  customerName: string;
  serviceTitle: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
  customer?: { id: number };
  service?: { id: number };
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string;
  customerName: string;
  serviceTitle: string;
}

export interface RatingResponse {
  serviceId: number;
  averageRating: number;
  totalReviews: number;
}
