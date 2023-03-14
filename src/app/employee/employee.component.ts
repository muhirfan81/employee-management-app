import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isNullOrEmpty } from '@app/_helpers';
import { EmployeeService } from '@app/_services';
import { first } from 'rxjs';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {
  column = [
    {
      key: 'name',
      text: "Name",
      canSort: true,
    },
    {
      key: 'email',
      text: "Email",
    },
    {
      key: 'status',
      text: "Status",
      style: {
        width: "15%"
      }
    },
    {
      key: 'group',
      text: "Group",
      style: {
        width: "200px"
      },
      filter: {
        dataSource: []
      },
    },
    {
      key: 'action',
      text: "Action",
      style: {
        width: "25%"
      }
    }
  ]
  employeeData: any = []
  loading = true
  limit = 10
  currentPage = 1
  totalPage = 1
  filterData: any = {}
  sortData: any = {}

  searchKeyword = null
  debounce: any = null

  confirmModalShow = false
  willDeleteUsername: any

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {

  }
  ngOnInit() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    this.limit = params.limit ? params.limit : 10
    this.currentPage = params.page ? params.page : 1
    this.searchKeyword = params.search ? params.search : null
    this.fetchGroup()
    this.fetchEmployee()

  }

  onChangeLimit() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    let buildQuery: any = {}
    if (params.page) {
      buildQuery.page = params.page
    }
    if (params.sort) {
      buildQuery.sort = params.sort
    }
    if (params.filter) {
      buildQuery.filter = params.filter
    }
    buildQuery.limit = this.limit
    var query = new URLSearchParams(buildQuery);
    window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
    this.fetchEmployee()
  }

  onChangePage(data: any) {
    this.currentPage = data
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    let buildQuery: any = {}
    if (params.search) {
      buildQuery.search = params.search
    }
    if (params.limit) {
      buildQuery.limit = params.limit
    }
    if (params.sort) {
      buildQuery.sort = params.sort
    }
    if (params.filter) {
      buildQuery.filter = params.filter
    }
    buildQuery.page = this.currentPage
    var query = new URLSearchParams(buildQuery);
    window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
    this.fetchEmployee()
  }

  doUpdate(username = "") {
    this.router.navigate(['/employee/update', username])
  }

  doFilter(data: any) {
    this.currentPage = 1
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    let buildQuery: any = {}
    let queriedFilter: any = {}
    if (params.search) {
      buildQuery.search = params.search
    }
    if (params.sort) {
      buildQuery.sort = params.sort
    }
    if (params.limit) {
      buildQuery.limit = params.limit
    }
    if (params.filter) {
      queriedFilter = JSON.parse(params.filter)
    }
    let assignFilter = Object.assign({ ...queriedFilter }, { ...data })
    Object.keys(assignFilter).forEach(key => {
      if (assignFilter[key] === null) {
        delete assignFilter[key]
      }
    });
    if (Object.keys(assignFilter)?.length) {
      buildQuery.filter = JSON.stringify(assignFilter)
    }

    var query = new URLSearchParams(buildQuery);
    window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
    this.fetchEmployee()
  }

  doSort(data: any) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    let buildQuery: any = {}
    if (params.page) {
      buildQuery.page = params.page
    }
    if (params.search) {
      buildQuery.search = params.search
    }
    if (params.limit) {
      buildQuery.limit = params.limit
    }
    if (params.filter) {
      buildQuery.filter = params.filter
    }
    if (data) {
      buildQuery.sort = JSON.stringify(data)
    }

    var query = new URLSearchParams(buildQuery);
    window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
    this.fetchEmployee()
  }

  doSearch() {
    this.loading = true
    if (!isNullOrEmpty(this.debounce)) {
      clearTimeout(this.debounce);
    }
    this.debounce = setTimeout(() => {
      this.currentPage = 1
      const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams: any, prop: any) => searchParams.get(prop),
      });
      let buildQuery: any = {}
      if (!isNullOrEmpty(this.searchKeyword)) {
        buildQuery.search = this.searchKeyword
      }
      if (params.sort) {
        buildQuery.sort = params.sort
      }
      if (params.limit) {
        buildQuery.limit = params.limit
      }
      if (params.filter) {
        buildQuery.filter = params.filter
      }
      var query = new URLSearchParams(buildQuery);
      window.history.replaceState(null, '', `${window.location.pathname}?${query.toString()}`);
      this.fetchEmployee()
    }, 3000)
  }

  doDelete() {
    this.employeeService.deleteEmployee(this.willDeleteUsername)
      .pipe(first())
      .subscribe(() => {
        this.confirmModalShow = false
        this.fetchEmployee()
      });
  }


  navigateToDetail(username = "") {
    this.router.navigate(['/employee/detail', username])
  }

  fetchEmployee() {
    this.loading = true
    this.employeeData = []
    let queryParams: any = {
      limit: this.limit,
      page: this.currentPage
    }
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    if (params.filter) {
      queryParams.filter = params.filter
    }
    if (params.sort) {
      queryParams.sort = params.sort
    }
    if (!isNullOrEmpty(this.searchKeyword)) {
      queryParams.search = this.searchKeyword
    }

    this.employeeService.getEmployeeList(queryParams)
      .pipe(first())
      .subscribe((response: any) => {
        this.totalPage = response?.totalPage
        response?.data.map((resp: any) => {
          this.employeeData.push({
            name: `${resp.firstName} ${resp.lastName}`,
            email: resp.email,
            group: resp.groupName,
            status: resp.status,
            action: [
              {
                type: "button",
                text: "Detail",
                class: "btn btn-primary",
                event: {
                  click: () => this.navigateToDetail(resp.username)
                }
              },
              {
                type: "button",
                text: "Edit",
                class: "btn btn-secondary",
                event: {
                  click: () => this.doUpdate(resp.username)
                }
              },
              {
                type: "button",
                text: "Delete",
                class: "btn btn-danger",
                event: {
                  click: () => this.openCloseConfirm(resp.username)
                }
              }
            ],
            style: {
              name: {
                "vertical-align": "middle",
              },
              email: {
                "text-align": "center",
                "vertical-align": "middle",
              },
              group: {
                "text-align": "center",
                "vertical-align": "middle",
              },
              status: {
                "text-align": "center",
                "vertical-align": "middle",
              },
              action: {
                "text-align": "center",
                "vertical-align": "middle",
              }
            },
          })
        })
        this.loading = false
      });
  }

  fetchGroup() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    let currentFilter = JSON.parse(params.filter)
    this.employeeService.getListGroup()
      .pipe(first())
      .subscribe((response: any) => {
        response.map((resp: any) => {
          resp.checked = false
          if (currentFilter?.group) {
            resp.checked = currentFilter.group.includes(resp.id)
          }
        })
        this.column.map((col: any) => {
          if (col.key == 'group') {
            col.filter.dataSource = response
          }
        })
      })
  }

  openCloseConfirm(username = "") {
    this.willDeleteUsername = username
    this.confirmModalShow = !this.confirmModalShow
  }


}
