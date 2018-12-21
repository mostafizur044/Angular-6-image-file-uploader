import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropComponent } from './drag-drop.component';
import { FileUploadService } from './file-upload.service';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports:[DragDropComponent],
  declarations: [DragDropComponent, DragDropDirective],
  providers:[FileUploadService]
})
export class DragDropModule { }
