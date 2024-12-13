import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirestoreService } from 'app/services/firebase/firestore.service';
import { UserService } from 'app/services/firebase/user.service';

@Component({
  selector: 'app-rpm-creator',
  templateUrl: './rpm-creator.component.html',
  styleUrls: ['./rpm-creator.component.scss']
})
export class RpmCreatorComponent implements OnInit {
  rpmDataUrl: string = '';
  isFrameHidden: boolean = true;
  @Output() rpmEmitter: EventEmitter<string> = new EventEmitter<string>();

  constructor(private userService: UserService, private fs: FirestoreService) { }

  ngOnInit(): void {
    this.openAvatarCreator();
  }

  canSave: boolean = false;
  openAvatarCreator() {
    this.canSave = false;
    this.isFrameHidden = false;

    window.addEventListener('message', (event) => {
      console.log(event);
      if (event.data.toString().includes('.glb')) {
        this.rpmDataUrl = event.data;
        this.rpmEmitter.emit(event.data);
      }
      this.canSave = true;
    });

    const frame = document.getElementById('readyPlayerMeFrame') as HTMLIFrameElement;
    const subdomain = 'personal-htm2dp'; // Replace with your custom subdomain

    frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi&preset=half`;
    frame.contentWindow?.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'subscribe',
        eventName: 'v1.**'
      }),
      '*'
    );
  }

  parse(event: MessageEvent): any {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  }
}