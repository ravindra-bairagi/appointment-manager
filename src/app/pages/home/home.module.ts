import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgCalendarModule  } from 'ionic2-calendar';
import { HomePage } from './home.page';
import { AppointmentService } from '../../shared/services/appointment.service';
import { FormAppointmentComponent } from '../../shared/component/form-appointment/form-appointment.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    NgCalendarModule
  ],
  declarations: [HomePage, FormAppointmentComponent],
  entryComponents: [FormAppointmentComponent],
  providers:[AppointmentService, ScreenOrientation]
})
export class HomePageModule {}
