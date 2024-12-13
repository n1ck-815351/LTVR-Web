import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { YoutubemodalComponent } from '../modals/youtubemodal/youtubemodal.component';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {
  @Input() src: any;
  @Input() yt: boolean;
  @Input() title:string|null;
  id: string;

  constructor(private sanitizer: DomSanitizer, public modalService: NgbModal) {

  }
  transform(url: any) {
    let result: any = this.getId(url);
    result = this.sanitizer.bypassSecurityTrustResourceUrl('//www.youtube.com/embed/' + result);
    // console.log(result);
    return result;
  }

  getId(url: any) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;

  }

  isModalOpen = false;

  getThumbnailUrl(): string {
    this.id = this.getId(this.src);
    return `https://img.youtube.com/vi/${this.id}/0.jpg`;
  }

  getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  openVideoModal() {
    const modalRef = this.modalService.open(YoutubemodalComponent, { centered: true, size:'xl' });
    
    modalRef.componentInstance.url = this.transform(this.src);
    modalRef.componentInstance.title = this.title;
  }

  closeVideoModal() {
    this.isModalOpen = false;
  }

  getYouTubeVideoId(url: string): string {
    const videoIdRegex = /[?&]v=([^&#]+)/;
    const match = url.match(videoIdRegex);
    if (match && match[1]) {
      this.id = match[1];
      return match[1];
    } else {
      throw new Error('Invalid YouTube URL');
    }
  }
}