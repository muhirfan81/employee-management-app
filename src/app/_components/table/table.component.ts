import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent {
  @Input() Column?: any
  @Input() DataSource?: any
  @Input() loading = true
  @Output("filter") filter: EventEmitter<any> = new EventEmitter();
  @Output("sort") sort: EventEmitter<any> = new EventEmitter();

  filterData = {
    test: true
  }
  filterModal = false
  filterDataSource: any = []
  filterKey: any = ''

  sortData: any = {}

  ifArray(data: any) {
    if(typeof data == 'object' && data.length > 0) {
      return true
    }
    return false
  }

  ifString(data: any) {
    if(typeof data == 'string') {
      return true
    }
    return false
  }

  ifNumber(data: any) {
    if(typeof data == 'number') {
      return true
    }
    return false
  }

  callEvent(ev: any) {
    ev;
  }

  doFilter() {
    let dataFilter: any = {}
    let checkedData = this.filterDataSource.filter((dt: any) => dt.checked).map((dt: any) => (dt.id))
    if(checkedData?.length) {
      dataFilter[this.filterKey] = checkedData
      this.filter.emit(dataFilter);
    } else {
      dataFilter[this.filterKey] = null
      this.filter.emit(dataFilter)
    }
    this.filterModal = false
  }

  doSort(key: string) {
    if(this.sortData[key]) {
      if(this.sortData[key] == "ASC") {
        this.sortData[key] = "DESC"
      } else  {
        delete this.sortData[key] 
      } 
    } else {
      this.sortData[key] = "ASC"
    }
    if(Object.keys(this.sortData)?.length) {
      this.sort.emit(Object.assign(this.sortData))
    } else {
      this.sort.emit(null)
    }
    // this.filter.emit(Object.assign(this.filterData, dataSort))
  }

  openCloseFilterModal(datasrc = null, filterKey = null) {
    this.filterKey = ''
    this.filterDataSource = []
    if(datasrc) {
      this.filterDataSource = datasrc
      this.filterKey = filterKey
      this.filterModal = !this.filterModal
    } else {
      this.filterModal = false
    }
  }

  isSorted(key: any) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    if(params.sort) {
      this.sortData = JSON.parse(params.sort)
    }
    if(this.sortData[key]) {
      if(this.sortData[key] == "ASC") {
        return 'asc'
      } else {
        return 'desc'
      }
    } 
    return false
  }
}
