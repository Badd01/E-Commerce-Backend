interface TUser {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  role?: "User" | "Admin";
  revenue?: number;
}

export { TUser };
