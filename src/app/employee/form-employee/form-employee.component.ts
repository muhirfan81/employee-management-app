import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '@app/_components/select-search/item.model';
import { AlertService, EmployeeService } from '@app/_services';
import { first } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isNullOrEmpty, validateEmail } from '@app/_helpers';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-employee',
  templateUrl: './form-employee.component.html',
  styleUrls: ['./form-employee.component.scss']
})
export class FormEmployeeComponent implements OnInit {
  mode = "Create"
  form!: FormGroup;
  currentUsername?: any;

  items: Item[] = [];
  currentSelectedItem?: Item;
  showSearch = true;
  showError = false;
  showStatus = true;
  submitted = false;
  loading = false
  today = "";

  inValidEmail = false
  inValidUsername = false

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private alertService: AlertService,
    private location: Location,
    private route: ActivatedRoute) { }

  get formEmployee() { return this.form.controls; }

  ngOnInit() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      description: ['', Validators.required],
      group: ['', Validators.required]
    });
    this.setToday()
    this.fetchGroupList();
    this.currentUsername = this.route.snapshot.paramMap.get('username');
    if (!isNullOrEmpty(this.currentUsername)) {
      this.mode = "Update"
      this.employeeService.getEmployeeByUsername(this.currentUsername)
        .pipe(first())
        .subscribe((employee: any) => {
          console.log('emp', employee)
          this.currentSelectedItem = this.items.find(item => item.id == employee?.group)
          this.form.patchValue(employee);
        });
    }
  }

  onItemChange(item: Item) {
    this.form.controls['group'].setValue(item.id);
    this.currentSelectedItem = item;
  }

  onToggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onToggleError() {
    this.showError = !this.showError;
  }

  onToggleStatus() {
    this.showStatus = !this.showStatus;
  }

  setToday() {
    const padL = (nr: any, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
    var d = new Date
    this.today = [
      d.getFullYear(),
      padL(d.getMonth() + 1),
      padL(d.getDate()),
    ].join('-') + 'T' + [
      padL(d.getHours()),
      padL(d.getMinutes())
    ].join(':');
  }

  fetchGroupList() {
    this.employeeService.getListGroup()
      .pipe(first())
      .subscribe((groups: any) => {
        this.items = groups.map((group: any) => ({
          id: group.id,
          name: group.name
        } as Item));
      });
  }

  doSave() {
    this.submitted = true
    this.loading = true
    this.inValidUsername = false
    this.inValidEmail = false

    if (this.form.invalid) {
      this.loading = false
      return;
    }

    if(!this.validateUsername()) {
      this.inValidUsername = true
    }

    if(isNullOrEmpty(validateEmail(this.form.value.email))) {
      this.inValidEmail = true
    }

    if(this.inValidEmail && this.inValidUsername) {
      this.loading = false
      return ;
    }

    this.postEmployee()
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Success saved data', { keepAfterRouteChange: true });
          this.location.back();
        },
        error: error => {
          this.alertService.error(error);
          this.submitted = false
          this.loading = false
        }
      })
  }
  postEmployee() {
    return this.currentUsername
      ? this.employeeService.updateEmployee(this.currentUsername, this.form.value)
      : this.employeeService.createEmployee(this.form.value);
  }

  back() {
    this.location.back();
  }

  validateUsername() {
    const res = /^[a-zA-Z0-9_\.]+$/.exec(this.form.value.username);
    const valid = !!res;
    return valid;
  }
}
