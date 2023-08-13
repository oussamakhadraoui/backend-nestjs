import { Users } from '@prisma/client';
export class User implements Users {
  email: string;
  id: number;
  createdAt: Date;
  name: string;
  salt: string;
  password: string;
  updatedAt: Date;
}
