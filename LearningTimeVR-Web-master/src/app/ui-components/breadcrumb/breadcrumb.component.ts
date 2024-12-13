import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Breadcrumb } from 'app/models/Interfaces/Breadcrumb';
import { NavigationService } from 'app/services/navigationService/navigation.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() currentPage: string | null;

  @Output() buttonClickEvent = new EventEmitter();

  constructor(
    public navigationService: NavigationService
  ) {}

  ngOnInit() {

  }

  public onButtonClick(url: string) {
    this.navigationService.navigate(url);
    // console.log(url);
    // this.buttonClickEvent.emit();
  }
}
