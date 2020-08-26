import { Component, OnInit } from '@angular/core';
import { SyncService } from './sync.service';
import { AlertController, ModalController } from '@ionic/angular';
import { DataBaseService } from '../../dataBase/data-base.service';
import { Enregistrement } from '../../interfaces/layer.model';
import { EditPage } from '../layers/edit/edit.page';
import { ToolsService } from '../../generic/tools.service';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {
  today: number = Date.now();

  startLayersDownloading = false;
  startDataDownloading = false ;
  saveFilesToLocalLoder = false;
  saveFilesToServerLoder = false;
  recordsToUpload = [];
  formItems = [];
  layers = [];
  colors = [
    'ionic',
    'angular',
    'communication',
    'tooling',
    'services',
    'design',
    'workshop',
    'food',
    'documentation',
    'navigation'
  ];

  constructor(
    public syncService: SyncService,
    public alertController: AlertController,
    private db: DataBaseService,
    public modalController: ModalController,
    private tools: ToolsService

  ) { }

  ngOnInit() {
    this.getToUploadList();
  }
  setLayers() {
    this.startLayersDownloading = true;
    this.syncService.getLayers()
    .subscribe(
      (layers) => {
      // this.layers = layers;
      this.syncService.setLayers(layers)
      .then((copmleted) => {
        if (copmleted) {
          this.startLayersDownloading = false;

          this.presentAlert('Succès',  'Opération de synchronisation terminée avec succès');
        } else {
          this.startLayersDownloading = false;
          this.presentAlert('Error',  "Échec de l'opération de synchronisation, essayez plus tard");
        }
      });
    }, (err) => {
      this.startLayersDownloading = false;
    }
    );
  }
  setLayersData() {
    this.startDataDownloading = true;

    this.syncService.getLayersData()
    .subscribe((layersData) => {
      console.log('data', layersData);
      this.syncService.setLayersData(layersData)
      .then((copmleted) => {
        if (copmleted) {
          this.startDataDownloading = false;

          this.presentAlert('Succès',  'Opération de synchronisation terminée avec succès');
        } else {
          this.startDataDownloading = false;

          this.presentAlert('Error',  "Échec de l'opération de synchronisation, essayez plus tard");
        }
      });
    }, (err) => {
      this.startDataDownloading = false;
    }
    );
  }
  getLayer(id?) {
    this.syncService.getLayer(id)
    .then((lr) => console.log('getLayer', lr));
  }
  getLayerData(id?) {
    this.syncService.getData(26218)
    .then((lr) => console.log('getLayerData', lr));
  }
  async presentAlert(headerText, messageText) {
    const alert = await this.alertController.create({
      // header: 'Terminé',
      header: headerText,
      // message: 'Opération de synchronisation terminée avec succès',
      message: messageText,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async (blah) => {
            // pass
          }
        }
      ]
    });
    await alert.present();
  }
  saveFilesToLocal() {
    this.saveFilesToLocalLoder = true;
    setTimeout(() => {
      this.saveFilesToLocalLoder = false;

      this.presentAlert('Succès', 'sauvegarde des données pour consultation ultérieure terminée');
    }, 5000);
  }
  saveFilesToServer() {
    this.saveFilesToServerLoder = true;
    setTimeout(() => {
      this.saveFilesToServerLoder = false;

      // this.presentAlert('Succès', 'sauvegarde des données sur le serveur distant terminée');
      this.tools.presentAlert('Succès', 'sauvegarde des données sur le serveur distant terminée')
    }, 5000);
    this.recordsToUpload
    .map((record) => {
      setTimeout(() => {
        return record.isnew = false;
      }, 5000);
    });

  }
  getToUploadList() {
    this.db.getRecordsToUploadList()
    .then((records: Enregistrement[]) => {
      if (records) {
        this.recordsToUpload = records;
        records.forEach((rc) => {
          this.formEdit(rc);
        })
      }
    });
  }
  ionViewDidEnter() {
    this.getToUploadList();
  }
  removeRecord(i) {
    this.tools.alertConfirmation(
      "Attention!", "êtes-vous sûr de vouloir supprimer cet enregistrement ?",
      "D'accord",
      "Annuler")
    .then((res) => {
      if (res) {
        this.recordsToUpload = this.recordsToUpload.filter((record, index, array) => {
          if ( i !== index ) {
            return record;
          }
        });
      }
    });

    // this.recordsToUpload = this.recordsToUpload.filter((record, index, array) => {
    //   if ( i !== index ) {
    //     return record;
    //   }
    // });
    // pass
  }
  editeRecord(record, i) {
    this.syncService.getLayer(record.layer_id)
    .then((selectedLayer) => {
      this.EditLayerRecord(record, selectedLayer);
    });
    // const selectedLayer =  this.layers.find((l) => l.id === record.layer_id);
    // console.log('selectedLayer', this.layers.find((l) => l.id === record.layer_id));
    // console.log('this.layers', this.layers);
    // console.log('record, selectedLayer', record, selectedLayer);
    
    // this.EditLayerRecord(record, selectedLayer);
    // pass
  }
  formEdit(object) {
    const newDoc = document;
    const fields = Object.keys(object);
    const values =  Object.values(object);
    console.log('kes ', fields );
    console.log('vals ', values );

    // fields.forEach((field) => {

    // });
    // fields.forEach(field => {
    //   this.formItems.push({
    //     label: field.name,
    //     type: field.type === 1 ? 'text' : field.type === 2 ? 'number' : field.type === 3 ? 'date' : 'text',
    //     required: field.required,
    //     // required: true,
    //     value: (object.donnees)[field.name]
    //   });
    // });

  }
  // getLayerAndRecord(layerId, recordId) {
  //   const lr = this.layersList.find((layer) => layer.id === layerId);
  //   const record = lr.enregistrements.find((en) => en.id === recordId);
  //   console.log('layer =>', lr, record);
  //   // this.EditLayerRecord(record, lr);
  //   this.detailLayerRecord(record, lr);
  // }

  async EditLayerRecord(selectedRecord, selectedLayer) {
    console.log('row ', selectedRecord);

    const modal = await this.modalController.create({
      component: EditPage,
      componentProps: {
        layer: selectedLayer,
        record: selectedRecord
      }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log(data);

    // if (data) {
    //   this.itineraire(data.record.shapeastext, data.layer);
    // }
  }
}
