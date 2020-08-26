import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
// import { FilterPipe } from './filter.pipe';


import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MyLoaderComponent } from './components/my-loader/my-loader.component';
import { LoaderService } from './generic/loader.service';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { GenericComponentsModule } from './components/generic-components.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    NgxDatatableModule,
    GenericComponentsModule

  ],
  declarations: [
    AppComponent,
    // MyLoaderComponent
  ],
  providers: [
    // LoaderService,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    InAppBrowser, SplashScreen, StatusBar, AngularFirestoreModule, AndroidPermissions],
  bootstrap: [AppComponent]
})
export class AppModule {}
