import { z } from 'zod';
import { createUserSchema, updateUserSchema, userResponseSchema } from '@itp-home-garden/schemas';

export type UserCreateRequest = z.infer<typeof createUserSchema>;
export type UserUpdateRequest = z.infer<typeof updateUserSchema>;
export type UserModel = z.infer<typeof userResponseSchema>;
