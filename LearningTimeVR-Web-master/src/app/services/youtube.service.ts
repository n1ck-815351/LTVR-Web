import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  
  // NOTE: Developers that work on this project will need to work with the API key. This is available from drennen's ascentxr google developer account.
  // NOTE 2: If a domain is added to this website (other than https://learningtimevr-2023.firebaseapp.com) you will be required to add that domain to the yt data v3 api key
  private apiUrl = 'https://www.googleapis.com/youtube/v3';
  
  constructor(private http: HttpClient) { }
  
  getVideoInfo(videoId: string): Observable<any> {
    const params = {
      part: 'snippet',
      id: videoId,
      key: 'AIzaSyDYIqQBq_Pgk_xdCgnMPL6iO2dKv6nPmAI' // google dev account: drennen@ascentxr.com
    };
    
    const url = `${this.apiUrl}/videos`;
    return this.http.get(url, { params }).pipe(
      map((response: any) => response.items[0])
    );
  }
}
