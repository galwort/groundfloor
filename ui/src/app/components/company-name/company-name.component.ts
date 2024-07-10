import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
})
export class CompanyNameComponent {
  @Output() nameSubmitted = new EventEmitter<string>();
  companyName = '';

  onSubmit() {
    this.nameSubmitted.emit(this.companyName);
  }
}
