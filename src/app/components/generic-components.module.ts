import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyLoaderComponent } from './my-loader/my-loader.component';
import { LoaderService } from '../generic/loader.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderInterceptor } from '../interceptors/loader-interceptor.service';



@NgModule({
  declarations: [
    MyLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [
    MyLoaderComponent
  ],
  providers: [
    LoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
})
export class GenericComponentsModule { }
