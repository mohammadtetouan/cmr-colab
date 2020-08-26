import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataBaseService } from '../../dataBase/data-base.service';
import { SyncService } from '../sync/sync.service';
import { Layer, DataBase } from '../../interfaces/layer.model';
import { DomainNameService } from '../../domain-name.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  
  constructor(
    private http: HttpClient,
    private dbService: DataBaseService,
    private syncService: SyncService,
    public domainNameService: DomainNameService,



  ) { }
  getLayers(): Observable<any> {
    return this.http.get<any>(this.domainNameService.layers);
  }

  getLayersData(): Observable<any> {
    return this.http.get<any>(this.domainNameService.data);

  }
  async addRecord(layer) {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        const newLayers = db.layers.map((l) => {
          if (l.id === layer.id) {
            return layer;
          }
          return l;
        });
        db.layers = newLayers;
        console.log('db');
        this.dbService.updateDataBase(db);
      });
  }
  getLocalLayers() {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          resolve(db.layers);
        } else {
          resolve(false);
        }
      });
    }));
  }
  getLocalLayersData() {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.dbService.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          resolve(db.layersData);
        } else {
          resolve(false);
        }
      });
    }));
  }
}
