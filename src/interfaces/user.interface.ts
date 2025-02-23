interface TUser {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  address: string;
  role?: "User" | "Admin";
  createdAt?: Date;
  updatedAt?: Date;
  refreshToken?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

interface TUserUpdate {
  name?: string;
  phoneNumber?: string;
  address?: string;
  updatedAt?: Date;
}

interface TUserUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

interface TUserEmail {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export { TUser, TUserUpdate, TUserUpdatePassword, TUserEmail };
