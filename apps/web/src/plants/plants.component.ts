/*eslint-disable*/
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Plant } from './plant.model';
import { PlantService } from './plant.service';

@Component({
  selector: 'app-plants',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './plants.component.html',
  styleUrl: './plants.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantsComponent {
  private plantService = inject(PlantService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  lookupMode: 'garden' | 'plant' = 'garden';
  searchId = '';
  plants: Plant[] = [];
  editingPlantId: number | null = null;
  errorMessage = '';

  plantForm: FormGroup = this.fb.group({
    plantName: ['', Validators.required],
    species: ['', Validators.required],
    plantType: ['', Validators.required],
    plantationDate: ['', Validators.required],
    surfaceAreaRequired: [null, [Validators.required, Validators.min(0)]],
    idealHumidityLevel: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    gardenId: [null, Validators.required]
  });

  onSearch(): void {
    if (!this.searchId.trim()) return;
    this.errorMessage = '';

    if (this.lookupMode === 'garden') {
      this.plantService.getPlantsByGardenId(this.searchId.trim()).subscribe({
        next: (data) => {
          this.plants = data;
          if (this.plants.length === 0) {
            this.errorMessage = 'No plants available for this garden.';
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to fetch plants for garden:', err);
          this.errorMessage = 'Failed to load plants for this garden.';
          this.plants = [];
          this.cdr.markForCheck();
        }
      });
    } else {
      this.plantService.getPlantById(this.searchId.trim()).subscribe({
        next: (singlePlant) => {
          this.plants = singlePlant ? [singlePlant] : [];
          if (this.plants.length === 0) {
            this.errorMessage = 'No plants available with this ID.';
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to fetch plant by ID:', err);
          this.errorMessage = 'Plant not found.';
          this.plants = [];
          this.cdr.markForCheck();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.plantForm.invalid) return;
    this.errorMessage = '';

    const formValue = this.plantForm.value;
    const payload: Omit<Plant, 'plantId'> = {
      ...formValue,
      surfaceAreaRequired: Number(formValue.surfaceAreaRequired),
      idealHumidityLevel: Number(formValue.idealHumidityLevel),
      gardenId: Number(formValue.gardenId),
      plantationDate: new Date(formValue.plantationDate).toISOString()
    };

    if (this.editingPlantId) {
      this.plantService.updatePlant(this.editingPlantId, payload).subscribe({
        next: () => {
          this.resetForm();
          if (this.searchId) {
            this.onSearch();
          } else {
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.errorMessage = 'Failed to update plant.';
          this.cdr.markForCheck();
        }
      });
    } else {
      this.plantService.createPlant(payload).subscribe({
        next: () => {
          this.searchId = String(payload.gardenId);
          this.lookupMode = 'garden';
          this.resetForm();
          this.onSearch();
        },
        error: (err) => {
          console.error('Create failed:', err);
          this.errorMessage = 'Failed to create plant.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  onEdit(plant: Plant): void {
    this.editingPlantId = plant.plantId ?? null;

    const formattedDate = plant.plantationDate
      ? new Date(plant.plantationDate).toISOString().split('T')[0]
      : '';

    this.plantForm.patchValue({
      plantName: plant.plantName,
      species: plant.species,
      plantType: plant.plantType,
      plantationDate: formattedDate,
      surfaceAreaRequired: plant.surfaceAreaRequired,
      idealHumidityLevel: plant.idealHumidityLevel,
      gardenId: plant.gardenId
    });

    this.cdr.markForCheck();
  }

  onDelete(plantId: number): void {
    if (confirm(`Delete plant ID ${plantId}?`)) {
      this.plantService.deletePlant(plantId).subscribe({
        next: () => {
          if (this.searchId) {
            this.onSearch();
          } else {
            this.plants = this.plants.filter((p) => p.plantId !== plantId);
            this.cdr.markForCheck();
          }
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.errorMessage = 'Failed to delete plant.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  resetForm(): void {
    this.editingPlantId = null;
    this.plantForm.reset();
    this.cdr.markForCheck();
  }
}
