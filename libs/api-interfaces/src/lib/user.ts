import { z } from 'zod';
import { createUserSchema, updateUserSchema, userResponseSchema } from '@itp-home-garden/schemas';

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserModel = z.infer<typeof userResponseSchema>;
