import { ErrorHandler, Injectable } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Platform } from '@ionic/angular';
import { environment } from './../../environments/environment';
@Injectable()
export class CustomErrorHandler extends ErrorHandler {

  constructor(private ga: GoogleAnalytics, private platform: Platform) {
    super();
  }
  parse(error: any): ParsedError {
 
    // get best available error message
    let parsedError: ParsedError = {
        message: error.message ? error.message as string : error.toString()
    };
 
    // include HTTP status code
    if (error.status != null) {
        parsedError.status = error.status;
    }
 
    // include stack trace
    if (error.stack != null) {
        parsedError.stack = error.stack;
    }
 
    return parsedError;
  }
  handleError(error: any): void {
    super.handleError(error);

  // unroll errors from promises
  if (error.rejection) {
    error = error.rejection;
  }

  let parsedError = this.parse(error);
  // if platform is ready then log error
  this.platform.ready().then(() => {
    // using google analytics id
    this.ga.startTrackerWithId(environment.analyticsID).then(() => {
        this.ga.trackException(JSON.stringify(parsedError), false);
        });
    });
  }
}
export interface ParsedError {
    message: string;
    status?: number;
    stack?: string;
  }
 
