import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomainNameService {
  // DOMAIN_NAME = 'http://105.159.250.165/auc/public/geoportail/api/';
  // DOMAIN_NAME = 'https://essuq.com/api/v2/cmr/api/';

  // layers = this.DOMAIN_NAME + 'layers';
  // data = this.DOMAIN_NAME + 'data';

  // get From assets JSON file

  layers = 'assets/data/layers.json';
  data = 'assets/data/data.json';


  constructor() { }
}
