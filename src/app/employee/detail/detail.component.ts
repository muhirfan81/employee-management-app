import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { EmployeeService } from '@app/_services';
import { ActivatedRoute } from '@angular/router';
import { Employee } from '@app/_models';
import { first } from 'rxjs';
import { isNullOrEmpty } from '@app/_helpers';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  dataEmployee?: Employee
  groupData: any
  loading = true



  constructor(
    private employeeService: EmployeeService,
    private location: Location,
    private route: ActivatedRoute) { }

  get fullName() { return this.dataEmployee?.firstName + " " + this.dataEmployee?.lastName }
  get email() { return this.dataEmployee?.email }
  get group() { return this.groupData.find((group: any) => group.id == this.dataEmployee?.group) }
  get status() { return this.dataEmployee?.status }
  get description() { return this.dataEmployee?.description }

  get birthDate() {
    let bDate: any = this.dataEmployee?.birthDate
    let dt = new Date(bDate)
    const mon = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${dt.getDate()} ${mon[dt.getMonth()]}, ${dt.getFullYear()}`
  }
  get age() {
    let birthDate: any = this.dataEmployee?.birthDate
    var ageDifMs = Date.now() - new Date(birthDate).getTime();
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  get basicSalary() {
    let number = ("" + this.dataEmployee?.basicSalary).split(".")
    if (isNullOrEmpty(number[0])) {
      return 'Rp. -';
    }
    var number_string: any = number[0].replace(/[^,\d]/g, '').toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return 'Rp. ' + rupiah + "," + (isNullOrEmpty(number[1]) ? "00" : number[1]);
  }

  ngOnInit() {
    const username = this.route.snapshot.paramMap.get('username');
    this.fetchGroup()
    this.employeeService.getEmployeeByUsername(username)
      .pipe(first())
      .subscribe((employee: any) => {
        this.dataEmployee = employee
        this.loading = false
      });
  }

  fetchGroup() {
    this.employeeService.getListGroup()
      .pipe(first())
      .subscribe((response: any) => {
        this.groupData = response
      })
  }

  back() {
    this.location.back();
  }
}
