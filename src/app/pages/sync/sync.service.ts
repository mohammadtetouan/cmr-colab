import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Layer, DataBase } from '../../interfaces/layer.model';
import { DataBaseService } from '../../dataBase/data-base.service';
import { DomainNameService } from '../../domain-name.service';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private dbService: DataBaseService,
    public domainNameService: DomainNameService,


  ) { }
  setLayers(layers) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db)  {
          db.layers = layers;
          this.dbService.updateDataBase(db)
          .then((updatedDb) => {
            if (updatedDb) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    }));
  }
  setLayersData(layersData) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db)  {
          db.layersData = layersData;
          this.dbService.updateDataBase(db)
          .then((updatedDb) => {
            if (updatedDb) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    }));
  }
  getLayer(layerId) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          if (db.layers.length) {
            const qLayer = db.layers.filter((layer) => layer.id === layerId);
            if (qLayer.length) {
              console.log('qLayer', qLayer[0]);
              resolve(qLayer[0]);
            }
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    })
    );
  }
  getData(id) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          if (db.layersData.length) {
            const qLayer = db.layersData.filter((layerData) => layerData.id === id);
            if (qLayer.length) {
              console.log('qLayer', qLayer[0]);
              resolve(qLayer[0]);
            }
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    })
    );
  }
  getLayers(): Observable<any> {
    return this.http.get<any>(this.domainNameService.layers);

  }

  // getLayers(): Observable<any> {
  //   const req = new HttpRequest('GET', this.domainNameService.layers, {
  //     reportProgress: true
  //   });
  //   this.http.request(req).subscribe((event: HttpEvent<any>) => {
  //     switch (event.type) {
  //       case HttpEventType.Sent:
  //         console.log('Request sent!');
  //         break;
  //       case HttpEventType.ResponseHeader:
  //         console.log('Response header received!');
  //         break;
  //       case HttpEventType.DownloadProgress:
  //         const kbLoaded = Math.round(event.loaded / 1024);
  //         const progress = Math.round((100 * event.loaded) / event.total);
  //         console.log(`Download in progress! ${ kbLoaded }Kb loaded`);
  //         console.log(`Download in progress Percentage! ${ event.loaded } , ${ progress }%`);
  //         break;
  //       case HttpEventType.Response:
  //         console.log('😺 Done!', event.body);
  //     }
  //   });
  //   return of(req);

  // }
  getLayersData(): Observable<any> {
    return this.http.get<any>(this.domainNameService.data, {
      reportProgress: true
    });

  }
}
