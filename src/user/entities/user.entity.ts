import { $Enums, Users } from '@prisma/client';
export class User implements Users {
  email: string;
  id: number;
  createdAt: Date;
  name: string;
  salt: string;
  password: string;
  updatedAt: Date;
  active: boolean;
  passResetExpire: Date;
  passResetToken: string;
  photo: string;
  role: $Enums.Role;
}
