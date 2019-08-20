import { Component } from '@angular/core';
import {  NavParams, ModalController } from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { Constants } from '../../constants';
import * as moment from 'moment';

@Component({
  selector: 'app-form-appointment',
  templateUrl: './form-appointment.component.html',
  styleUrls: ['./form-appointment.component.scss'],
})
export class FormAppointmentComponent {
  // current event for edit
  currentEvent = null;
  // max date for datepicker
  maxDate=moment().add(1, 'year').format('YYYY-MM-DD');
  // appointment form
  appointmentForm: FormGroup;
  // validation messages json
  validationMessages = {};
  // constructor
  constructor(public modalController : ModalController, public navParams: NavParams, public formBuilder: FormBuilder, public dataService: AppointmentService) { 
    // initialize form object
    this.appointmentForm = formBuilder.group({
      _id: [''],
      _rev: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      allDay:['true',Validators.required]
    });
    // set validation messages from constants
    this.validationMessages = Constants.VALIDATION_MESSAGE;

    // check if event object is there in request, if yes means its edit request.
    if(navParams.get('event')) {
      // parse json as value shared is in json
      this.currentEvent = JSON.parse(navParams.get('event'));
      // set form values
      this.appointmentForm.setValue( {
        _id:this.currentEvent._id,
        _rev:this.currentEvent._rev,
        title: this.currentEvent.title,
        location:this.currentEvent.location,
        startTime:this.currentEvent.startTime,
        endTime:this.currentEvent.endTime,
        allDay:true
      });
    }
  }
  /**
   * close current modal
   * @param result status of edit/delete operation else undefined
   */
  async closeModal(result?:any) {
    await this.modalController.dismiss(result);
  }
  /**
   * Save event details
   */
  onSave() {
    // if appointment form is valid then save details
    if(this.appointmentForm.valid) {
      let eventCopy = this.appointmentForm.value;
       // if event is all day event
      if (eventCopy.allDay) {
        let start = moment(new Date(eventCopy.startTime)).startOf('day').set('hour', 7).toDate(); // set to 7:00 am today for business hours
        let end = moment(new Date(eventCopy.endTime)).endOf('day').set('hour', 20).toDate(); // set to 20:00 pm today for business hours
        eventCopy.startTime = start;
        eventCopy.endTime = end;
      }
      // if no id is present in event object means its new appointment
      if(!eventCopy._id) {
        this.dataService.addAppointment(eventCopy).then((result) => {
          this.closeModal(result);
        });
      } else {
        this.dataService.editAppointment(eventCopy).then((result) => {
          this.closeModal(result);
        });
      }
    }
  }
}
