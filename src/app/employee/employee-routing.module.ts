import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { FormEmployeeComponent } from './form-employee/form-employee.component';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  { path: '', component: EmployeeComponent },
  { path: 'create', component: FormEmployeeComponent },
  { path: 'update/:username', component: FormEmployeeComponent },
  { path: 'detail/:username', component: DetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
