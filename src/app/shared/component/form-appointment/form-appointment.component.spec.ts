import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { FormAppointmentComponent } from './form-appointment.component';
import { AppointmentService } from 'src/app/shared/services/appointment.service';
import {  NavParams, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { IonicModule } from '@ionic/angular'
describe('FormAppointmentComponent', () => {
  let component: FormAppointmentComponent;
  let fixture: ComponentFixture<FormAppointmentComponent>;
  // spy for modal controller
  let eventJSON = '{"_id":"3339f0a3-6d87-422d-9021-982867abed5d","_rev":"6-c4330a5d038d411fa335246f72a479e7","title":"another event12","location":"Pune1","startTime":"2019-08-16T00:00:00.000Z","endTime":"2019-08-26T00:00:00.000Z","allDay":true}';
  let modalSpy = jasmine.createSpyObj('Modal', ['present']);
  let modalCtrlSpy = jasmine.createSpyObj('ModalController', ['create','dismiss']);
  modalCtrlSpy.create.and.callFake(function () {
      return modalSpy;
  });
  // spy for navparams
  let navSpy = jasmine.createSpyObj('Nav', ['get']);
  let navCtrlSpy = jasmine.createSpyObj('NavParams', ['get']);
  navCtrlSpy.get.and.callFake( (paramName: string) => {
      if(paramName=='notevent') {
        return eventJSON;
      } else 
      return '';
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAppointmentComponent ],
      imports: [ReactiveFormsModule, FormsModule, IonicModule, RouterTestingModule],
      providers:[AppointmentService, {
        provide: ModalController,
        useValue: modalCtrlSpy
      },
      {
        provide: NavParams,
        useValue: navCtrlSpy
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize variables', () => {
    expect(component.appointmentForm).toBeTruthy();
  });
  // close modal action
  it('should close modal when close is called', async() => {
    await component.closeModal();
    expect(component.modalController.dismiss).toHaveBeenCalled();
  });
  // form validity
  it('form invalid when empty', () => {
    expect(component.appointmentForm.valid).toBeFalsy();
  });
  // field validity
  it('title field validity', () => {
    let errors = {};
    let title = component.appointmentForm.controls['title'];
    expect(title.valid).toBeFalsy();

    // Title field is required
    errors = title.errors || {};
    expect(errors['required']).toBeTruthy();

    // Set title to something
    title.setValue("test");
    errors = title.errors || {};
    expect(errors['required']).toBeFalsy();

    // Title max length
    title.setValue('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ac tortor sollicitudin, dapibus nibh vitae, euismod mauris. Cras quis nisi nec leo tincidunt suscipit. Suspendisse iaculis magna ac arcu sollicitudin, ac tempor felis viverra. Integer suscipit elit quis pulvinar mollis. Vivamus sem odio, viverra quis posuere quis, malesuada non tortor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi ut vehicula dolor, sed rhoncus neque.');
    errors = title.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['maxlength']).toBeTruthy();


    // Set title to something correct
    title.setValue("test@example.com");
    errors = title.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  });

  it('form save action', () => {
      // set form values
      component.appointmentForm.setValue(JSON.parse(eventJSON));
      const appointmentService = fixture.debugElement.injector.get(AppointmentService);
      // after setting form values, call api save details
      let spy = spyOn(appointmentService, "editAppointment").and.returnValue(
        Promise.resolve(true)
      );
      component.onSave();
      expect(appointmentService.editAppointment).toHaveBeenCalled();
  });
});
