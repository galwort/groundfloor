import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HomePageRoutingModule } from './home-routing.module';

import { CompanyNameComponent } from '../components/company-name/company-name.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  declarations: [HomePage, CompanyNameComponent],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class HomePageModule {}
