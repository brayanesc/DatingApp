import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { Photo } from '../../../types/photo';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-photo-management',
  imports: [],
  templateUrl: './photo-management.html',
  styleUrl: './photo-management.css',
})
export class PhotoManagement implements OnInit {
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);
  protected photosForApproval = signal<Photo[]>([]);

  ngOnInit(): void {
    this.getPhotosForApproval();
  }

  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe({
      next: (photos: Photo[]) => {
        this.photosForApproval.set(photos);
      },
    });
  }

  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe({
      next: () => {
        this.toastService.success('Photo approved successfully');
        this.photosForApproval.update(photos => {
          return photos.filter(x => x.id !== photoId)
        });
      },
      error: (error) => console.log(error),
    });
  }

  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () => {
        this.toastService.error('Photo rejected successfully');
        this.photosForApproval.update(photos => {
          return photos.filter(x => x.id !== photoId)
        });
      },
      error: (error) => console.log(error),
    });
  }
}
