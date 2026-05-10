export interface UserResponse {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  refreshTokenHash: string | null;
  createdAt: Date;
  updatedAt: Date;
}
