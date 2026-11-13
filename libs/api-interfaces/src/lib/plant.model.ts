import { z } from 'zod';
import {
  createPlantSchema,
  plantResponseSchema,
  updatePlantSchema,
} from '@itp-home-garden/schemas';

export type PlantCreateRequest = z.infer<typeof createPlantSchema>;
export type PlantUpdateRequest = z.infer<typeof updatePlantSchema>;
export type PlantModel = z.infer<typeof plantResponseSchema>;
