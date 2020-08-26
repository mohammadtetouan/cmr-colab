import { Component, OnInit } from '@angular/core';
import { LayersService } from '../layers.service';
import { Observable } from 'rxjs';
import { AddOnePage } from '../add-one/add-one.page';
import { ModalController, AlertController } from '@ionic/angular';
import { WKT } from 'ol/format';
import { NavigationExtras, Router } from '@angular/router';
import { EditPage } from '../edit/edit.page';
import { Layer, LayerData } from '../../../interfaces/layer.model';
import { SyncService } from '../../sync/sync.service';
import { ToolsService } from '../../../generic/tools.service';

@Component({
  selector: 'app-layers-listing',
  templateUrl: './layers-listing.page.html',
  styleUrls: ['./layers-listing.page.scss'],
})
export class LayersListingPage implements OnInit {
  startLayersDownloading = false;
  startDataDownloading = false;
  layers = [];
  layersData = [];
  cols = [];
  news = [];
  selectedLayer ;
  fields = [];
  search = '';
  searchText: string;


  segmentValue = 'Table';

  constructor(
    public layersService: LayersService,
    public modalController: ModalController,
    private router: Router,
    public alertController: AlertController,
    public syncService: SyncService,
    private tools: ToolsService



  ) { }

  ngOnInit() {
    // this.syncLayers();
    // this.syncData();
    this.getLayersList();
    this.getLayersData();
    // this.ios = this.config.get('mode') === 'ios';

  }
  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;
  }
  getLayersList() {
    this.layersService.getLocalLayers().then(
      (layers: Layer[]) => {
        console.log('layers: -> ', layers);
        if (layers) {
        this.layers = layers;
        } else {
          this.syncLayers();
        }
      }
    );
  }

  getLayersData() {
    this.layersService.getLocalLayersData().then(
      (data: LayerData[]) => {
        console.log('data: -> ', data);
        if (data) {
          this.layersData = data;
        } else {
          this.syncData();
        }
      }
    );
  }

  onCityChange(event: any, id?: any) {
    if (id) {
      this.changeLayerSelection(id);
    } else if (event.target.value !== 0) {
      console.log('value ', event.target.value);
      this.changeLayerSelection(event.target.value);
    }
  }

// Fonction 3 : Changer la couche selectionnée
changeLayerSelection(value) {
  if (value === '') {
    this.cols = null;
    this.news = null;
    return;
  }

  const vector = this.layers.filter((el) => {
      return el.id && el.id.toString() === value.toString();
  });

  this.selectedLayer = vector[0];
  console.log('selectedLayer', this.selectedLayer);

  if (!vector[0]) {
    this.cols = null;
    this.news = null;
    return;
  }
  // $scope.options = mapOptions;

  this.fields = vector[0].champs;
  this.cols = this.fields;
  console.log('cols', this.cols);

  const enregistrements = vector[0].enregistrements;
  this.news = enregistrements;

  const donnees = {};

  enregistrements.forEach(element => {
      const dataEnregistrement = this.layersData.filter(
          (el) => {
              return el.enregistrement_id && el.enregistrement_id.toString() === element.id.toString();
          });
      // console.log('dataEnregistrement===' + dataEnregistrement.length + '  enregistrement_id ==' + element.id.toString());

      this.fields.forEach(champs => {
          const champsRow = dataEnregistrement.filter((el) => {
              return el.champ_id && el.champ_id.toString() === champs.id.toString();
          });
          if (champsRow) {
              donnees[champs.name] = champsRow[0].value;
          } else { donnees[champs.name] = ''; }
      });
      element.donnees = donnees;

  });
  const rows = vector[0].enregistrements;
  this.news = rows;
  console.log('news', this.news);

  // map=initMap(fields);
  // loadData(map, data,fields,'shape_text');
  }
  async AddLayerRecord() {
    const modal = await this.modalController.create({
      component: AddOnePage,
      componentProps: {
        layer: this.selectedLayer,
      }
    });
    return await modal.present();
  }
  async EditLayerRecord(selectedRecord) {
    console.log('row ', selectedRecord);

    const modal = await this.modalController.create({
      component: EditPage,
      componentProps: {
        layer: this.selectedLayer,
        record: selectedRecord
      }
    });
    return await modal.present();
  }
  itineraire(shapetext) {
    if (shapetext && 0 !== shapetext.length) {
      const navigationExtras: NavigationExtras = {
        state: {
          shapetext_ : shapetext,
          layer: this.selectedLayer
        }
      };
      this.router.navigate(['/', 'app', 'tabs', 'map'], navigationExtras);

    } else {
        console.log('Aucune information géométrique');
        this.presentAlert('Désolé', 'Aucune information géométrique')
    }
  }
  deleteRecord(record) {
    // console.log(record);
    // this.presentAlert("Attention!", "êtes-vous sûr de vouloir supprimer cet enregistrement avec l'ID: " + record.id);
    this.tools.alertConfirmation(
      "Attention!", "êtes-vous sûr de vouloir supprimer cet enregistrement avec l'ID: " + record.id + ' ?',
      "D'accord",
      "Annuler")
      .then((res) => {
        if (res) {
          this.news = this.news.filter((row, index, array) => {
            if ( row.id !== record.id ) {
              return record;
            }
          });
        }
      });
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
        },
        {
          text: 'ok',
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
  ionViewDidEnter() {
    // console.log('ionViewWillEnter');
    // this.enter();
    this.getLayersList();
    this.getLayersData();
  }
  syncLayers() {
    this.startLayersDownloading = true;
    this.syncService.getLayers()
    .subscribe(
      (layers) => {
      this.syncService.setLayers(layers)
      .then((copmleted) => {
        if (copmleted) {
          this.getLayersList();
          this.startLayersDownloading = false;
        } else {
          this.startLayersDownloading = false;
        }
      });
    }, (err) => {
      this.startLayersDownloading = false;
    }
    );
  }
  syncData() {
    this.startDataDownloading = true;

    this.syncService.getLayersData()
    .subscribe((layersData) => {
      console.log('data', layersData);
      this.syncService.setLayersData(layersData)
      .then((copmleted) => {
        if (copmleted) {
          this.getLayersData();
          this.startDataDownloading = false;
        } else {
          this.startDataDownloading = false;
        }
      });
    }, (err) => {
      this.startDataDownloading = false;
    }
    );
  }
}
