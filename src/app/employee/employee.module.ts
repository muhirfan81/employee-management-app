import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import { TableComponent } from '@app/_components/table/table.component';
import { PaginationComponent } from '@app/_components/pagination/pagination.component';
import { SelectSearchComponent } from '@app/_components/select-search/select-search.component';
import { FormEmployeeComponent } from './form-employee/form-employee.component';
import { DetailComponent } from './detail/detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EmployeeComponent,
    TableComponent,
    PaginationComponent,
    SelectSearchComponent,
    FormEmployeeComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeeModule { 
  
}
