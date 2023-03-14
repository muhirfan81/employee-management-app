import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: any;
  @Input() totalPage: any;
  @Output() pageChange = new EventEmitter<any>();
  
  hidePages(pageNumber: any) {
    let willShowPage = []
    let tempMaxShowPage = Number(this.currentPage) + 2
    let tempCurrentPage = Number(this.currentPage) 
    if(tempMaxShowPage >= Number(this.totalPage)) {
      for (let index = Number(this.totalPage) - 2; index <= Number(this.totalPage); index++) {
        willShowPage.push(index)
      }
    } else {
      for (let index = tempCurrentPage; index <= tempMaxShowPage; index++) {
        if(index <= this.totalPage) {
          willShowPage.push(index)
        }
      }
    }

    if(willShowPage.includes(pageNumber)) {
      return false
    }
    return true
  }

  hideDotsLeftItem() {
    if(Number(this.currentPage)+2 <= 3 || Number(this.totalPage) == 3) {
      return true
    }
    return false
  }

  hideDotsRigthItem() {
    if(Number(this.currentPage)+2 >= Number(this.totalPage)) {
      return true
    }
    return false
  }

  nextPage() {
    if (this.currentPage != this.totalPage) {
      this.currentPage++
      this.pageChange.emit(this.currentPage)
    }
  }
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--
      this.pageChange.emit(this.currentPage)
    }
  }

  toPage(page: any) {
    if(this.currentPage != page) {
      this.currentPage = page
      this.pageChange.emit(this.currentPage)
    }
  }

  isDisabledNext() {
    if(this.currentPage == this.totalPage) {
      return true
    }
    return false
  }

  isDisabledPrev() {
    if(this.currentPage == 1) {
      return true
    }
    return false
  }

}
