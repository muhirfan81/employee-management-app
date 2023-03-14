import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { User } from '@app/_models';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit {
  @Input() userDetail?: User | null;
  @Output("logout") logout: EventEmitter<any> = new EventEmitter();

  currentUrl = "/";
  showSidebar = false;

  constructor(private location: Location) {

    this.location.onUrlChange(path => this.urlChange(path));
  }

  ngOnInit() {

  }

  urlChange(path: string) {
    this.currentUrl =  path.split("?")[0]
  }
  doLogout() {
    this.logout.emit();
  }
  openSideBar() {
    this.showSidebar = !this.showSidebar
  }
  

}
