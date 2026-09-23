export interface Plant {
  plantId?: number;
  plantName: string;
  species: string;
  plantType: string;
  plantationDate: string;
  surfaceAreaRequired: number;
  idealHumidityLevel: number;
  gardenId: number;
  createdAt?: string;
  updatedAt?: string;
}
