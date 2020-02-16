import { Component, Input, HostListener } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ManuscriptFile } from "../manuscript";
import { ManuscriptService } from "../manuscript.service";
import { ManuscriptDetailsComponent } from "../manuscript-details/manuscript-details.component";

@Component({
  selector: "manuscript-file-list",
  templateUrl: "./manuscript-file-list.component.html",
  styleUrls: ["./manuscript-file-list.component.css", "./controls.css"]
})
export class ManuscriptFileListComponent {
  @Input() files: ManuscriptFile[];
  @Input() markedForDelete: ManuscriptFile[];

  @HostListener("document:keyup", ["$event"]) handleDeleteKeyboardEvent(
    e: KeyboardEvent
  ) {
    if (e.key === "Escape") this.fullscreen = false;
  }

  selectedFile: ManuscriptFile;
  selectedIndex: number;
  fullscreen: boolean;
  fullscreenMessage: boolean;

  constructor(private details: ManuscriptDetailsComponent) {}

  drop(event: CdkDragDrop<{ name: string; url: string }[]>) {
    moveItemInArray(this.files, event.previousIndex, event.currentIndex);
  }

  markForDelete(index: number) {
    if (!this.markedForDelete) this.markedForDelete = [];
    this.markedForDelete.push(this.files.splice(index, 1)[0]);
    this.selectFile(index);
  }

  moveFile(from: number, to: number) {
    this.files.splice(to, 0, this.files.splice(from, 1)[0]);
  }
  moveFileByOffset(offset) {
    this.moveFile(this.selectedIndex, this.selectedIndex + offset);
    this.selectedIndex = this.selectedIndex + offset;
  }
  selectFile(i: number) {
    this.selectedFile = this.files[i];
    this.selectedIndex = i;
  }
  toggleFullScreen() {
    this.fullscreen = !this.fullscreen;
    this.fullscreenMessage = this.fullscreen;
    setTimeout(() => (this.fullscreenMessage = false), 1500);
  }
  toggleForm(a) {
    this.details.toggleForm(a);
  }
  toggleEdit() {
    console.log(this.details.showMinForm);
    console.log(this.details.showForm);
    if (this.details.showMinForm == true) {
      this.details.showMinForm = false;
      this.details.showMinFormChange.emit(false);
    } else {
      this.details.showMinForm = true;
      this.details.showMinFormChange.emit(true);
    }
  }
}
