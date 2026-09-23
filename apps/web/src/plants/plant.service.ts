import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from './plant.model';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly http = inject(HttpClient);

  getPlantsByGardenId(gardenId: number | string): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.baseUrl}/plants/garden/${gardenId}`);
  }

  getPlantById(plantId: number | string): Observable<Plant> {
    return this.http.get<Plant>(`${this.baseUrl}/plants/${plantId}`);
  }

  createPlant(plant: Omit<Plant, 'plantId'>): Observable<Plant> {
    return this.http.post<Plant>(`${this.baseUrl}/plants`, plant);
  }

  updatePlant(plantId: number | string, plant: Omit<Plant, 'plantId'>): Observable<Plant> {
    return this.http.put<Plant>(`${this.baseUrl}/plants/${plantId}`, plant);
  }

  deletePlant(plantId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/plants/${plantId}`);
  }
}