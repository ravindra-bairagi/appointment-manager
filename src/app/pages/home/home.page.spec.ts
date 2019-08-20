import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import {  NavParams, ModalController } from '@ionic/angular';
import { HomePage } from './home.page';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { NgCalendarModule  } from 'ionic2-calendar';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePage ],
      imports: [IonicModule.forRoot(), NgCalendarModule],
      providers:[AppointmentService]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should fetch data for calender', () => {
    const appointmentService = fixture.debugElement.injector.get(AppointmentService);
    // after setting form values, call api save details
    let spy = spyOn(appointmentService, "getAppointments").and.returnValue(
      Promise.resolve(true)
    );
    component.loadEvents();
    expect(appointmentService.getAppointments).toHaveBeenCalled();
  });
});
