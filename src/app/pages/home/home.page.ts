import { CalendarComponent } from 'ionic2-calendar/calendar';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID, HostListener, ElementRef } from '@angular/core';
import { AlertController, ModalController, Platform, IonContent } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { Appointment } from '../../shared/model/Appointment';
import { AppointmentService } from '../../shared/services/appointment.service';
import { FormAppointmentComponent } from '../../shared/component/form-appointment/form-appointment.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
/**
 * Home page component
 */
export class HomePage implements OnInit {
  // min date for picker
  minDate = new Date().toISOString();
  // selected date from calender
  selectedDate: Date;
  // list of appointments
  eventSource: [];
  // title to show between calender arrows
  viewTitle = '';
  // calender object for base settings
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  // dom object of ionic content
  @ViewChild(IonContent, null) content: IonContent;
  // dom object of calender component
  @ViewChild(CalendarComponent, null) calenderComponent: CalendarComponent;
  
  // constructor
  constructor(private alertCtrl: AlertController, 
    public modalController: ModalController,public platform:Platform, @Inject(LOCALE_ID) private locale: string, public dataService: AppointmentService) { 
  }
  /**
   * Ionic view did load event
   */
  ionViewDidLoad(){
    // load events in calender
    this.loadEvents();
    window.addEventListener("deviceorientation", this.handleOrientation, true);
  }
  /**
   * Scroll to specified element id in DOM
   * @param elementId 
   */
  scrollTo(elementId: string) {
    // get element from document and then scroll to point
    let y = document.getElementById(elementId).offsetTop;
    this.content.scrollToPoint(0, y);
  }
  /**
   * function to call after orientation change to refresh calender view
   */
  handleOrientation() {
    this.calenderComponent.currentDate = this.selectedDate;
    this.calenderComponent.loadEvents();
  }
  /**
   * Load events and assign to calender
   */
  loadEvents() {
    // load events from dataservice
    this.dataService.getAppointments().then((result: []) => {
      this.eventSource = result;
      // load events in calender
      this.calenderComponent.loadEvents();
    });
}
  /**
   * Show appointment form for add/edit
   * @param event event object for edit else null to add new appointment
   */
  async showAppointmentFormModal(event?:Appointment) {
    // create modal instance
    const modal = await this.modalController.create({
      component: FormAppointmentComponent,
      componentProps: {
        event: JSON.stringify(event)
      }
    });
    // modal dismiss event
    modal.onDidDismiss().then((dataReturned) => {
      this.loadEvents();
    });
    // show modal
    return await modal.present();
  }
  /**
   * Angular onInit lifecycle event
   */
  ngOnInit() {
    // load events and bind device orientation event
    this.loadEvents();
  }
  /**
   * Change current calender month to next month
   */
  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }
  /**
   * Change current calender month to previous month
   */
  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
 
 /**
  * Set today's date as selected date in calender
  */
  setToday() {
    this.calendar.currentDate = new Date();
    this.calenderComponent.currentDate = new Date();
  }
  /**
   * Set updated title for calender
   * @param title 
   */
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  /**
   * Event when event is selected on calender 
   * @param event Appointment object
   */
  async onEventSelected(event: Appointment) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
    // show alert with details
    const alert = await this.alertCtrl.create({
      header: 'Appointment Details',
      subHeader: '',
      cssClass:'alert-button-group',
      message: 'Title: ' + event.title + '<br><br>Location: ' + event.location,
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            // edit appointment
            this.showAppointmentFormModal(event);
            }
          }, {
          text: 'Delete',
          handler: () => {
            // delete appointment
            this.presentAppointmentRemoveConfirm(event);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // hide popup
          }
      }]
    });
    // show alert
    alert.present();
  }
  /**
   * Show confirm box if appointment delete event is triggered
   * @param event 
   */
  async presentAppointmentRemoveConfirm(event:Appointment) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Are you sure you want to delete <strong>'+event.title+'?</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.deleteAppointment(event);
          }
        }
      ]
    });

    await alert.present();
  }
  /**
   * Delete appointment from calender and DB
   * @param event selected event
   */
  deleteAppointment(event:Appointment) {
    this.dataService.removeAppointment(event).then((status) => {
      this.loadEvents();
    });
  }
  /**
   * Event when date from calender is selected
   * @param ev selected event from calender
   */
  onTimeSelected(ev: any) {
    this.selectedDate =  ev.selectedTime;
  }
}
