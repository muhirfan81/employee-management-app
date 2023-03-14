import { Component, OnInit } from '@angular/core';
import { GlobalService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  summaryData?: any[]

  constructor(
    private globalService: GlobalService,
  ) {

  }
  ngOnInit() {
    this.globalService.getSummary()
      .pipe(first())
      .subscribe(summary => this.summaryData = summary);
  }
}
