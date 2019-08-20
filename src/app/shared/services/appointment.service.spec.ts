import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AppointmentService } from './appointment.service';
import PouchDB from 'pouchdb';
import * as moment from 'moment';
import { Appointment } from '../model/Appointment';
import { Observable } from 'rxjs';

// fake pouchdb object
export class MockPouchDB {
  // fake list of records for pouch db
  fakeList ={ rows: [
    {doc:{
     _id: 'hasg8q72geo1i2e',
      _rev: 'rev_asudnbub12312',
      title: 'Complete 4 production',
      location: 'Pune',
      startTime: '2019-19-08 01:26:21',
      endTime: '2019-21-08 01:26:21',
      allDay:true
    }
  },
  {doc:{
      _id: 'hasg8q72geo1i2e',
      _rev: 'rev_asudnbub12312',
      title: 'Complete 4 production',
      location: 'Pune',
      startTime: '2019-19-08 01:26:21',
      endTime: '2019-21-08 01:26:21',
      allDay:true
    }},
    {doc:{
      _id: 'hasg8q72geo1i2e',
      _rev: 'rev_asudnbub12312',
      title: 'Complete 4 production',
      location: 'Pune',
      startTime: '2019-19-08 01:26:21',
      endTime: '2019-21-08 01:26:21',
      allDay:true
    }}
  ]};
  /**
   * Fake sync function
   */
  sync() { 
    return Promise.resolve(this.fakeList);
  }
  /**
   * Fake addDocs function
   */
  allDocs() {
    return Promise.resolve(this.fakeList);
  }
  /**
   * fake change function
   */
  changes() {}
  /**
   * fake get times function
   */
  getItem() { return []; }
}

describe('AppointmentService', () => {
  var promiseResolveSpy = Promise.resolve();
  beforeEach(() => 
    {
      TestBed.configureTestingModule({});
      var originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    }
  );
  // Service should be initialized
  it('should be created', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    expect(service).toBeTruthy();
  });
  // Service should initialize global variables
  it('should initialize variables', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    service.db = new MockPouchDB();
    expect(service.remote).toBeTruthy();
    expect(service.username).toBeTruthy();
    expect(service.password).toBeTruthy();
    expect(service.db).toBeTruthy();
  });
  // should sync database
  it('should sync database', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    service.db = new MockPouchDB();
    service.syncDatabase().then((result) => {
      expect(service.db.sync).toHaveBeenCalled();
    });
  });
  // should post an object to database
  it('should post object to database', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    var appointment: Appointment = {
      _id: 'hasg8q72geo1i2e',
      _rev: 'rev_asudnbub12312',
      title: 'Complete 4 production',
      location: 'Pune',
      startTime: '2019-19-08 01:26:21',
      endTime: '2019-21-08 01:26:21',
      allDay:true
    };
    const dbSpy = jasmine.createSpyObj('db', { post: promiseResolveSpy });
    service.addAppointment(appointment).then((result) => {
      expect(service.db.post).toHaveBeenCalled();
    });
  });
  // should get all objects from db
  it('should get all objects from database', () => {
    const service: AppointmentService = TestBed.get(AppointmentService);
    service.db = new MockPouchDB();
    service.getAppointments().then((result:any) => {
      expect(service.db.allDocs).toHaveBeenCalled();
    });
  });
});
