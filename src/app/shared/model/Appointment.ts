/**
 * Class for appointment defination
 */
export class Appointment {
   // unique id for each event. required for PouchDB
   public _id:string;
   // revision id when edited. required for PouchDB
   public _rev: string;
   // title of event 
   public title: string;
   // location of event
   public location: string;
   // start time of appointment
   public startTime: string;
   // end time of appointment
   public endTime: string;
   // mark if event is all day event
   public allDay: boolean;
}