import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Garden } from './garden.model';

@Injectable({
  providedIn: 'root',
})
export class GardenService {
  private readonly apiUrl = 'http://localhost:3000/gardens';
  private readonly http = inject(HttpClient);

  getGardens(): Observable<Garden[]> {
    return this.http.get<Garden[]>(this.apiUrl);
  }

  getGardenById(gardenId: number | string): Observable<Garden> {
    return this.http.get<Garden>(`${this.apiUrl}/${gardenId}`);
  }

  createGarden(garden: Omit<Garden, 'gardenId'>): Observable<Garden> {
    return this.http.post<Garden>(this.apiUrl, garden);
  }

  updateGarden(gardenId: number | string, garden: Omit<Garden, 'gardenId'>): Observable<Garden> {
    return this.http.put<Garden>(`${this.apiUrl}/${gardenId}`, garden);
  }

  deleteGarden(gardenId: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${gardenId}`);
  }
}
