import { NgModule, ErrorHandler } from '@angular/core';
import { CustomErrorHandler } from './error.handler';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

@NgModule({
  imports: [
    
  ],
  exports: [],
  declarations: [],
  providers: [ {provide: ErrorHandler, useClass: CustomErrorHandler }, GoogleAnalytics]
})
export class CoreModule {
   
}