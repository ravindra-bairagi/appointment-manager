import { Injectable, NgZone } from '@angular/core';
import PouchDB from 'pouchdb';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';
import { Appointment } from '../model/Appointment';
@Injectable({
  providedIn: 'root'
})
/**
 * Appointment data service
 */
export class AppointmentService {
  data: any;
  db: any;
  username: string;
  password: string;
  remote: string;  
  dbOptions: any;
  constructor(public zone: NgZone) {
    // initialize variables
    this.db = new PouchDB(environment.databaseName);
    this.username = environment.username;
    this.password = environment.password;
    this.remote = environment.apiURL;

    // set db options 
    this.dbOptions = {
      live: true,
      retry: true,
      continuous: true,
      auth: {
        username: this.username,
        password: this.password
      }
    };
    // sync database at time of initialization - RB - Not required now
    // this.db.sync(this.remote, this.dbOptions);

  }
  /**
   * Sync database and return promise once sync is complete
   */
  syncDatabase() {
    return new Promise((resolve, reject) => {
    this.db.sync(this.remote, this.dbOptions).on('complete', (info) => {
        resolve(true);
    }).on('error', (err) => {
        resolve(false);
      });
    });
  }
  /**
   * Edit appointment object
   * @param appointment appointment object to update
   */
  editAppointment(appointment: Appointment) {
    return new Promise((resolve, reject) => {
      this.db.put(appointment,{force: true}).then(function (response) {
        if(response.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  /**
   * Add new appointment
   * @param appointment new appointment to insert
   */
  addAppointment(appointment: Appointment){
    return new Promise((resolve, reject) => {
      this.db.post(appointment).then(function (response) {
        if(response.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  /**
   * Delete appointment
   * @param appointment appointment to delete 
   */
  removeAppointment(appointment: Appointment) {
    return new Promise((resolve, reject) => {
      this.db.remove(appointment).then((result) => {
            if(result.ok) {
              resolve(true);
            } else {
              resolve(false);
            }
      });
    });
  }
  /**
   * Get appointments based on given date, if date is null then return all appointments
   * @param date appointment date or null
   */
  getAppointments(date?: Date){

    return new Promise(resolve => {
      // get all docs from PouchDB
      this.db.allDocs({

        include_docs: true

      }).then((result:any) => {
        this.data = [];
        // if no records are there then return empty array
        if(result.rows.length === 0) {
          resolve(this.data);
        }
        // convert start and end date from string to date as data is returned in string format.
        let docs = result.rows.map((row) => {
          row.doc.startTime = new Date(row.doc.startTime);
          row.doc.endTime = new Date(row.doc.endTime);
          // if events by date
          if(date) {
            if(moment(date).isBetween(row.doc.startTime, row.doc.endTime)) {
              this.data.push(row.doc);
            }
          } else {
            this.data.push(row.doc);
          }
          resolve(this.data);
        });
        // sync db with cloud
        this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
          this.handleChange(change);
        });

      }).catch((error) => {
        console.log(error);
      }); 
    });
  }
  /**
   * Handle db change event.
   * @param change databse change event
   */
  handleChange(change){
    // this event is called from plugin so to run it in angular context, we need to run within angular zone.
    this.zone.run(() => {

      let changedDoc = null;
      let changedIndex = null;
      // set current document
      this.data.forEach((doc, index) => {
        if(doc._id === change.id){
          changedDoc = doc;
          changedIndex = index;
        }
      });

      //A document was deleted
      if(change.deleted){
        this.data.splice(changedIndex, 1);
      } 
      else {

        //A document was updated
        if(changedDoc){
          this.data[changedIndex] = change.doc;
        } 
        //A document was added
        else {
          this.data.push(change.doc);        
        }

      }
    });
  }
}
