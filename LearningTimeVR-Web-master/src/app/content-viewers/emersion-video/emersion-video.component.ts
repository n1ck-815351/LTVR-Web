import { Component, Input } from '@angular/core';
import * as AFrame from 'aframe';

@Component({
  selector: 'app-emersion-video',
  templateUrl: './emersion-video.component.html',
  styleUrls: ['./emersion-video.component.scss']
})
export class EmersionVideoComponent {
  @Input() src: string | null;
  @Input() contentIndex: number | null;
}
