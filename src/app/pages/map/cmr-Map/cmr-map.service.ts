import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataBaseService } from '../../../dataBase/data-base.service';
import { DataBase } from '../../../interfaces/layer.model';

@Injectable({
  providedIn: 'root'
})
export class CmrMapService {

  constructor(
    private http: HttpClient,
    private dbService: DataBaseService,


  ) { }
  // getLayers(): Observable<any> {
  //   // return this.http.get<any>('http://105.159.250.165/auc/public/geoportail/api/layers');
  //   return this.http.get<any>('assets/data/data.json');
  // }
  getLayers() {
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
}
