import { z } from 'zod';
import {
  createGardenSchema,
  gardenResponseSchema,
  updateGardenSchema,
} from '@itp-home-garden/schemas';

export type GardenCreateRequest = z.infer<typeof createGardenSchema>;
export type GardenUpdateRequest = z.infer<typeof updateGardenSchema>;
export type GardenModel = z.infer<typeof gardenResponseSchema>;
