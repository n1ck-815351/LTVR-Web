

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { HeaderbarComponent } from './pages/headerbar/headerbar.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { environment } from 'environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AuthService } from './services/firebase/auth.service';
import { DialogModule } from '@angular/cdk/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { LessonmoduleModalComponent } from './modals/lessonmodule-modal/lessonmodule-modal.component';
import { NgbActiveModal, NgbModule, NgbProgressbarConfig, NgbProgressbar } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadListComponent } from './uploads/upload-list/upload-list.component';
import { UploadFormComponent } from './uploads/upload-form/upload-form.component';
import { ContentComponent } from './pages/classroom/subject/lesson/components/content-viewer/content-component.component';
import { ModelComponent } from './content-viewers/model/model.component';
import { ImageComponent } from './content-viewers/image/image.component';
import { VideoComponent } from './content-viewers/video/video.component';
import { BrowserComponent } from './content-viewers/browser/browser.component';
import { EmersionVideoComponent } from './content-viewers/emersion-video/emersion-video.component';
import { EmersionImageComponent } from './content-viewers/emersion-image/emersion-image.component';
import { ClassEditorModalComponent } from './modals/editors/class-editor-modal/class-editor-modal.component';
import { NoSelectionComponent } from './modals/editors/no-selection/no-selection.component';
import { LessonmoduleEditorModalComponent } from './modals/editors/lessonmodule-editor-modal/lessonmodule-editor-modal.component';
import { ValidationDialogComponent } from './modals/validation-dialog/validation-dialog.component';
import { ContentclusterEditorModalComponent } from './modals/editors/contentcluster-editor-modal/contentcluster-editor-modal.component';
import { ContentEditorModalComponent } from './modals/editors/content-editor-modal/content-editor-modal.component';
import { GenericCreatorModalComponent } from './modals/creators/generic-creator-modal/generic-creator-modal.component';
import { GenericEditorModalComponent } from './modals/editors/generic-editor-modal/generic-editor-modal.component';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { YoutubemodalComponent } from './content-viewers/modals/youtubemodal/youtubemodal.component';
import { ImagemodalComponent } from './content-viewers/modals/imagemodal/imagemodal.component';
import { ConfirmationModalComponent } from './modals/confirmations/confirmation-modal/confirmation-modal.component';
import { BaseCreatorComponent } from './modals/creators/base-creator/base-creator.component';
import { ClassCreatorModalComponent } from './modals/creators/elements/class-creator-modal/class-creator-modal.component';
import { SubjectCreatorModalComponent } from './modals/creators/elements/subject-creator-modal/subject-creator-modal.component';
import { LessonCreatorModalComponent } from './modals/creators/elements/lesson-creator-modal/lesson-creator-modal.component';
import { ContentCreatorModalComponent } from './modals/creators/elements/content-creator-modal/content-creator-modal.component';
import { UploadQueueComponent } from './overlays/download-queue/download-queue.component';
import { UploadQueueService } from './services/uploads/upload-queue.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SchoolComponent } from './pages/school/school.component';
import { RegisterComponent } from './pages/account/register/register.component';
import { AdminComponent } from './pages/account/admin/admin.component';
import { InfoModalComponent } from './modals/confirmations/info-modal/info-modal.component';
import { AscentxrAdminContentComponent } from './pages/account/admin/components/admin-page/ascentxr-admin-content.component';
import { UserAdminAdminContentComponent } from './pageContent/general/admin-page/user-admin-admin-content/user-admin-admin-content.component';
import { UserModeratorAdminContentComponent } from './pageContent/general/admin-page/user-moderator-admin-content/user-moderator-admin-content.component';
import { UserTeacherAdminContentComponent } from './pageContent/general/admin-page/user-teacher-admin-content/user-teacher-admin-content.component';
import { LoginfallbackComponent } from './pages/fallbacks/loginfallback/loginfallback.component';
import { AdminUserPageComponent } from './pages/users/admin-user-page/admin-user-page.component';
import { RestrictedComponent } from './pages/fallbacks/restricted/restricted.component';
import { LinkGeneratorComponent } from './pages/account/admin/components/link-generator/link-generator.component';
import { OrganizationManagerComponent } from './pages/account/admin/components/organization-manager/organization-manager.component';
import { DeviceManagerComponent } from './pages/account/admin/components/device-manager/device-manager.component';
import { GridComponent } from './pages/users/admin-user-page/user-display-types/grid/grid.component';
import { ExpandedGridComponent } from './pages/users/admin-user-page/user-display-types/expanded-grid/expanded-grid.component';
import { ListComponent } from './pages/users/admin-user-page/user-display-types/list/list.component';
import { UserPreviewCardModalComponent } from './modals/user-preview-card-modal/user-preview-card-modal.component';
import { InvalidUserComponent } from './pages/fallbacks/invalid-user/invalid-user.component';
import { HttpClientModule } from '@angular/common/http';
import { AscentDeviceMoveModalComponent } from './pages/account/admin/components/device-manager/modals/ascent-device-move-modal/ascent-device-move-modal.component';
import { GlobalConfirmationModalComponent } from './modals/global/global-confirmation-modal/global-confirmation-modal.component';
import { RpmCreatorComponent } from './pages/profile/components/ready-player-me/rpm-creator.component';
import { OrganizationEditorComponent } from './pages/account/admin/components/organization-manager/modals/organization-editor/organization-editor.component';
import { LinkHelperModalComponent } from './modals/link-helper-modal/link-helper-modal.component';
import { InviteHelperPageComponent } from './pages/invite-helper-page/invite-helper-page.component';
import { StudentClassAssignModalComponent } from './modals/student-class-assign-modal/student-class-assign-modal.component';
import { BuildIndicatorComponent } from './pages/global/components/build-indicator/build-indicator.component';
import { ContentCardComponent } from './ui-components/content-card/content-card.component';
import { ClassroomComponent } from './pages/classroom/classroom.component';
import { ClassroomViewerComponent } from './pages/classroom/components/classroom-viewer/classroom-viewer.component';
import { ClassroomViewerStudentComponent } from './pages/home/components/classroom-viewer-student/classroom-viewer-student.component';
import { ClassroomViewerEducatorComponent } from './pages/home/components/classroom-viewer-educator/classroom-viewer-educator.component';
import { SubjectComponent } from './pages/classroom/subject/subject.component';
import { SubjectViewerComponent } from './pages/classroom/subject/components/subject-viewer/subject-viewer.component';
import { LessonComponent } from './pages/classroom/subject/lesson/lesson.component';
import { LessonViewerComponent } from './pages/classroom/subject/lesson/components/lesson-viewer/lesson-viewer.component';
import { SearchBarComponent } from './ui-components/search-bar/search-bar.component';

// BEGIN Angular Material component imports
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddButtonComponent } from './ui-components/add-button/add-button.component';
import { ButtonComponent } from './ui-components/button/button.component';
import { EditButtonComponent } from './ui-components/edit-button/edit-button.component';
import { DeleteButtonComponent } from './ui-components/delete-button/delete-button.component';
import { SlideToggleComponent } from './ui-components/slide-toggle/slide-toggle.component';
import { DropdownComponent } from './ui-components/dropdown/dropdown.component';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { BreadcrumbComponent } from './ui-components/breadcrumb/breadcrumb.component';
import { InputComponent } from './ui-components/input/input.component';

// END Angular Material component imports

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SidebarComponent,
    HeaderbarComponent,
    LoginComponent,
    ProfileComponent,
    LessonmoduleModalComponent,
    UploadListComponent,
    UploadFormComponent,
    ClassroomViewerComponent,
    SubjectComponent,
    LessonComponent,
    SubjectViewerComponent,
    LessonViewerComponent,
    ContentComponent,
    ModelComponent,
    ImageComponent,
    VideoComponent,
    BrowserComponent,
    EmersionVideoComponent,
    EmersionImageComponent,
    ClassEditorModalComponent,
    NoSelectionComponent,
    LessonmoduleEditorModalComponent,
    ValidationDialogComponent,
    ContentclusterEditorModalComponent,
    ContentEditorModalComponent,
    GenericCreatorModalComponent,
    GenericEditorModalComponent,
    YoutubemodalComponent,
    ImagemodalComponent,
    ClassCreatorModalComponent,
    ConfirmationModalComponent,
    BaseCreatorComponent,
    SubjectCreatorModalComponent,
    LessonCreatorModalComponent,
    ContentCreatorModalComponent,
    UploadQueueComponent,
    SchoolComponent,
    RegisterComponent,
    AdminComponent,
    InfoModalComponent,
    AscentxrAdminContentComponent,
    UserAdminAdminContentComponent,
    UserModeratorAdminContentComponent,
    UserTeacherAdminContentComponent,
    LoginfallbackComponent,
    AdminUserPageComponent,
    RestrictedComponent,
    LinkGeneratorComponent,
    OrganizationManagerComponent,
    DeviceManagerComponent,
    GridComponent,
    ExpandedGridComponent,
    ListComponent,
    UserPreviewCardModalComponent,
    InvalidUserComponent,
    AscentDeviceMoveModalComponent,
    GlobalConfirmationModalComponent,
    RpmCreatorComponent,
    OrganizationEditorComponent,
    LinkHelperModalComponent,
    InviteHelperPageComponent,
    StudentClassAssignModalComponent,
    BuildIndicatorComponent,
    ContentCardComponent,
    ClassroomComponent,
    ClassroomViewerEducatorComponent,
    ClassroomViewerStudentComponent,
    SearchBarComponent,
    AddButtonComponent,
    ButtonComponent,
    EditButtonComponent,
    DeleteButtonComponent,
    SlideToggleComponent,
    DropdownComponent,
    BreadcrumbComponent,
    InputComponent,
  ],
  imports: [
    // BEGIN Angular Material component imports
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatListModule,
    MatTableModule,
    // END Angular Material component imports
    BrowserModule,
    AppRoutingModule,
    DialogModule,
    ScrollingModule,
    CdkVirtualScrollViewport,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    FormsModule, ReactiveFormsModule,
    AngularFireModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    NgbAlertModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbProgressbar,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
  ],
  providers: [
    ScreenTrackingService, UserTrackingService, AuthService, NgbProgressbarConfig, NgbProgressbar, UploadQueueService, NgbActiveModal
  ],
  bootstrap: [AppComponent],
  schemas: []
})
export class AppModule { }
