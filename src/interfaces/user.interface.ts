interface TUser {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  role?: "User" | "Admin";
  revenue?: number;
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
}

interface TUserUpdate {
  name: string;
  phoneNumber: string;
  address: string;
}

export { TUser, TUserUpdate };
