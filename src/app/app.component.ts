import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppointmentService } from './shared/services/appointment.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
/**
 * Application component
 */
export class AppComponent {
  // constructor
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dataService: AppointmentService
  ) {
    // initialize app
    this.initializeApp();
  }
  /**
   * Initialize application
   */
  initializeApp() {
    // when cordova platform is ready
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // sync database and then hide splash screen
      this.dataService.syncDatabase().then((response) => {
        this.splashScreen.hide();
      });
    });
  }
}
