import { Injectable } from '@angular/core';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  myLoader: boolean;

  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public router: Router,
    public loadingController: LoadingController,
    private loaderService: LoaderService
  ) { }
  async presentLoading() {
    // this.myLoader = true;
    console.log('loding present');
    
    this.loaderService.isLoading.next(true);
    const loading = await this.loadingController.create({
      message: 'chargement...',
    });
    await loading.present();

    // const { role, data } = await loading.onDidDismiss();
    // console.log('Loading dismissed!');
  }
  async dismissLoading() {
    // this.myLoader = false;
    console.log('loding dismissed');

    this.loaderService.isLoading.next(false);

     await this.loadingController.dismiss();
  }

  async presentToast(title, msg) {
    const toast = await this.toastController.create({
      animated: true,
      header: title,
      message: msg,
      duration: 1000,
      position: 'middle',
      color: 'medium'
    });
    toast.present();
  }
  // async presentAlert(headerText, messageText) {
  //   const alert = await this.alertController.create({
  //     // header: 'Terminé',
  //     header: headerText,
  //     // message: 'Opération de synchronisation terminée avec succès',
  //     message: messageText,
  //     buttons: [
  //       {
  //         text: 'Annuler',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: async (blah) => {
  //           // pass
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // change from alert to toast 

  async presentAlert(headerText, messageText) {
    const toast = await this.toastController.create({
      header: headerText,
      message: messageText,
      position: 'bottom',
      buttons: [
        {
          side: 'end',
          // icon: 'alert-circle-outline',
          text: 'Ok',
          handler: () => {
            // pass
          }
        }
      ]
    });
    toast.present();
  }

  // async presentAlertLinked(headerText, messageText, buttonText, link) {
  //   const alert = await this.alertController.create({
  //     // header: 'Terminé',
  //     header: headerText,
  //     // message: 'Opération de synchronisation terminée avec succès',
  //     message: messageText,
  //     buttons: [
  //       {
  //         text: buttonText,
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: async (blah) => {
  //           this.router.navigate([link]);
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }

  // change from alert to toast
  async presentAlertLinked(headerText, messageText, buttonText, link) {
    const toast = await this.toastController.create({
      header: headerText,
      message: messageText,
      position: 'bottom',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          // text: buttonText,
          text: 'Ok',
          handler: () => {
            this.router.navigate([link]);
          }
        }
      ]
    });
    toast.present();
  }
  alertConfirmation(headerText, messageText, okButtonText, cancelButtonText) {
    return Promise.resolve(new Promise(async (resolve, reject) => {
      const toast = await this.alertController.create({
        header: headerText,
        message: messageText,
        buttons: [
          {
            text: okButtonText,
            handler: () => {
              resolve(true);
            }
          }, {
            // text: cancelButtonText,
            text: 'Fermer',
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          }
        ]
      });
      toast.present();
    }));

  }
}
