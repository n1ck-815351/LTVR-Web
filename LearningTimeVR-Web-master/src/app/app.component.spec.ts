import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { environment } from 'environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HeaderbarComponent } from './pages/headerbar/headerbar.component';
import { LoginComponent } from './pages/login/login.component';
import { UploadQueueComponent } from './overlays/download-queue/download-queue.component';
import { BuildIndicatorComponent } from './pages/global/components/build-indicator/build-indicator.component';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from './ui-components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        FormsModule,
        MatIconModule
      ],
      declarations: [
        AppComponent,
        HeaderbarComponent,
        LoginComponent,
        UploadQueueComponent,
        BuildIndicatorComponent,
        ButtonComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'LearningTimeVR'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('LearningTimeVR');
  });

  it('should have a sidebar', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-sidebar')).toBeDefined();
  });
});
