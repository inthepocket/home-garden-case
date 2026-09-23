/* eslint-disable prettier/prettier */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Garden } from './garden.model';
import { GardenService } from './garden.service';

@Component({
  selector: 'hgc-gardens',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './gardens.component.html',
  styleUrl: './gardens.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GardensComponent implements OnInit {
  private gardenService = inject(GardenService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  gardens: Garden[] = [];
  searchGardenId = '';
  editingGardenId: number | null = null;
  errorMessage = '';

  gardenForm: FormGroup = this.fb.group({
    gardenName: ['', Validators.required],
    totalSurfaceArea: [null, [Validators.required, Validators.min(0)]],
    locationDescription: [''],
    latitude: [null, Validators.required],
    longitude: [null, Validators.required]
  });

  ngOnInit(): void {
    this.loadGardens();
  }

  loadGardens(): void {
    this.searchGardenId = '';
    this.errorMessage = '';
    this.gardenService.getGardens().subscribe({
      next: (data) => {
        this.gardens = Array.isArray(data) ? data : [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch gardens', err);
        this.errorMessage = 'Failed to load gardens.';
        this.cdr.markForCheck();
      }
    });
  }

  onFindById(): void {
    const id = this.searchGardenId.trim();
    if (!id) {
      this.loadGardens();
      return;
    }

    this.errorMessage = '';
    this.gardenService.getGardenById(id).subscribe({
      next: (garden) => {
        this.gardens = garden ? [garden] : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.gardens = [];
        this.errorMessage = `Garden with ID "${id}" not found.`;
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.gardenForm.invalid) return;

    const formValue = this.gardenForm.value;
    const payload: Omit<Garden, 'gardenId'> = {
      gardenName: formValue.gardenName,
      totalSurfaceArea: Number(formValue.totalSurfaceArea),
      locationDescription: formValue.locationDescription || '',
      latitude: Number(formValue.latitude),
      longitude: Number(formValue.longitude)
    };

    if (this.editingGardenId !== null) {
      this.gardenService.updateGarden(this.editingGardenId, payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadGardens();
        },
        error: (err) => {
          console.error('Update failed:', err);
          this.errorMessage = 'Failed to update garden.';
          this.cdr.markForCheck();
        }
      });
    } else {
      this.gardenService.createGarden(payload).subscribe({
        next: () => {
          this.resetForm();
          this.loadGardens();
        },
        error: (err) => {
          console.error('Create failed:', err);
          this.errorMessage = 'Failed to create garden.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  onEdit(garden: Garden): void {
    this.editingGardenId = garden.gardenId ?? null;
    this.gardenForm.patchValue({
      gardenName: garden.gardenName,
      totalSurfaceArea: garden.totalSurfaceArea,
      locationDescription: garden.locationDescription,
      latitude: garden.latitude,
      longitude: garden.longitude
    });
  }

  onDelete(id?: number): void {
    if (id === undefined) return;
    if (confirm('Are you sure you want to delete this garden?')) {
      this.gardenService.deleteGarden(id).subscribe({
        next: () => {
          this.loadGardens();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.errorMessage = 'Failed to delete garden.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  resetForm(): void {
    this.editingGardenId = null;
    this.gardenForm.reset();
    this.cdr.markForCheck();
  }
}
