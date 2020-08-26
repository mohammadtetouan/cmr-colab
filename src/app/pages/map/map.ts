
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import Fill from 'ol/style/Fill';

import Style from 'ol/style/Style';

import Stroke from 'ol/style/Stroke';

import Collection from 'ol/Collection';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape';
import Map from 'ol/Map';
import View from 'ol/View';
import WKT from 'ol/format/WKT';
import {Tile as TileLayer, Vector as VectorLayer, Group, Tile} from 'ol/layer';
import {Vector as VectorSource, XYZ, OSM} from 'ol/source';


import { TinyColor } from '@ctrl/tinycolor';
import { CmrMapService } from './cmr-Map/cmr-map.service';
import Geometry from 'ol/geom/Geometry';
import { Feature, MapBrowserEvent } from 'ol';
import { fromLonLat, transform } from 'ol/proj';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, PopoverController, AlertController, ToastController } from '@ionic/angular';
import { ToolsPage } from './tools/tools.page';
// import LayerSwitcher from 'ol-layerswitcher';
import { BaseMap, Layer, LayerData, DataBase } from '../../interfaces/layer.model';
import { SyncService } from '../sync/sync.service';
import { LayersService } from '../layers/layers.service';
import { EditPage } from '../layers/edit/edit.page';
import { DataBaseService } from '../../dataBase/data-base.service';
import { MaptoolsService } from './maptools.service';
import { ToolsService } from '../../generic/tools.service';
import { AddOnePage } from '../layers/add-one/add-one.page';
import { DetailPage } from '../layers/detail/detail.page';
import Projection from 'ol/proj/Projection';

import LayerSwitcher from 'ol-ext/control/LayerSwitcher';
import SearchNominatim from 'ol-ext/control/SearchNominatim';
import GeoBookmark from 'ol-ext/control/GeoBookmark';
import Geolocation from 'ol/Geolocation';
import Geoportail from 'ol-ext/layer/Geoportail';
import Circle from 'ol/style/Circle';
import GeoJSON from 'ol/format/GeoJSON';
import {getCenter} from 'ol/extent';
import Point from 'ol/geom/Point';
import { SelectLayerPage } from './select-layer/select-layer.page';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  dayIndex = 0;
  queryText = '';
  queryId: number;
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: any = [];
  groups: any = [];
  confDate: string;
  showSearchbar: boolean;
  layersList = [];
  results = [];
  layersData = [];
  searchSpinner: boolean;
  noResults = false;
  startLayersDownloading = false;
  startDataDownloading = false;
  preInintloading = false;
  indexx = 1;
  baseLayerGroup = new Group({
    layers: []
  });
  groupLayers = [];
  map: Map;
  vectorSource = new VectorSource();
  basemaps = [
    ({
        id: 1,
        nom: 'Google Maps',
        url: 'https:\/\/mt1.google.com\/vt\/lyrs=r&x={x}&y={y}&z={z}',
        visible: true,
        maps_id: 1,
        created_at: null,
        updated_at: null,
        layer: new TileLayer()
      } as BaseMap),
    ({
        id: 2,
        nom: 'Satellite',
        url: 'https:\/\/services.arcgisonline.com\/ArcGIS\/rest\/services\/World_Imagery\/MapServer\/tile\/{z}\/{y}\/{x}',
        visible: false,
        maps_id: 2,
        created_at: null,
        updated_at: null,
        layer: new TileLayer()
    } as BaseMap)
  ];
  mapShape: string;
  selectedLayer: Layer;

  drawformat: any;
  drawVector: any;
  draw: any;
  snap: any;
  drawVector2: any;
  constructor(
    public cmrMapService: CmrMapService,
    private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    public popoverController: PopoverController,
    public syncService: SyncService,
    public layersService: LayersService,
    private db: DataBaseService,
    public alertController: AlertController,
    public toastController: ToastController,
    private tools: ToolsService,
    public http: HttpClient

  ) {
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        const shapetext = this.router.getCurrentNavigation().extras.state.shapetext_;
        const layer = this.router.getCurrentNavigation().extras.state.layer;
        this.getLayersGroup().then(() => {
          this.itineraire(shapetext, layer);
          this.map.setSize([100, 100]);
          this.map.updateSize();
        });
      }
    });

    this.setLayers();
    this.setDrawLayers();








    // this.map = new Map({
    //   target:  document.getElementById('map'),
    //   // layers: this.BaseLayers(),
    //   view: new View({
    //     center: fromLonLat([-7.638537, 33.5774929]),
    //     zoom: 12
    //   })
    // });
    // this.BaseLayers().forEach((layerGp) => {
    //   this.map.setLayerGroup(layerGp);
    // });

   
    // this.cmrMapService.getLayers().then((ls: Layer[]) => {
    //   if (ls) {
    //     this.layersList = ls;
    //     console.log('layers _ y ', this.layersList);

    //     this.customInit();
    //     setTimeout(() => {
    //       this.getLayersData();
    //     }, 2000);
    //   } else {
    //     this.syncLayers().then((bool) => {
    //       if (bool) {
    //         this.customInit();
    //         setTimeout(() => {
    //           this.getLayersData();
    //         }, 2000);
    //       }
    //     });
    //   }
    // });
  }
  updateReults() {
    this.noResults = false;

    this.results = [];
  }
  updateSearch() {
    // Close any open sliding items when the schedule updates
    // if (this.scheduleList) {
    //   this.scheduleList.closeSlidingItems();
    // }

    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownSessions = data.shownSessions;
    //   this.groups = data.groups;
    // });

    this.searchSpinner = true;
    if (!this.queryText) {
      this.results = [];
      // this.searchSpinner = false ;
    }
    for (const [i, lr] of this.layersList.entries()) {
      if (this.results && (this.results.length < 2)) {
        // this.filterList(lr.enregistrements, this.queryText, 'donnees', lr);
        this.filterById(lr.enregistrements, this.queryId, lr);

      } else if (!this.results) {
        // this.filterList(lr.enregistrements, this.queryText, 'donnees', lr);
        this.filterById(lr.enregistrements, this.queryId, lr);

      } else {
        this.searchSpinner = false ;
        console.log('break ', i);
        break;
      }

      if ((i + 1) == this.layersList.length) {
        if (!this.results.length) {
          this.noResults = true;
        }
        console.log('break 2', i);

        this.searchSpinner = false ;
        break;
      }
    }
    // this.layersList.forEach((lr) => {
    //   this.filterList(lr.enregistrements, this.queryText, 'donnees');
    //   console.log('results => ' ,  this.results);
    // });
  }
  customInit() {
    this.map = new Map({
      target:  document.getElementById('map'),
      layers: this.BaseLayers(),
      view: new View({
        // center: fromLonLat([-7.638537, 33.5774929]),
        center: fromLonLat([-7.618419, 33.6005713]),
        zoom: 14
      })
    });
    // this.BaseLayers().forEach((layerGp) => {
    //   this.map.setLayerGroup(layerGp);
    // });
    this.getLayersGroup().then(() => {
      this.addSwitcher(this.map);
    });
    // this.map.setSize([100, 100]);
    this.map.on('click', (e) => {
      this.myOnclickListener(e);
    });
    // this.map.on('click', this.myOnclickListener);

    // this.setSearchNominatim();

    this.setGeoBookmark();

    this.setGeolocation();
    
    
  }
  myOnclickListener(e: MapBrowserEvent) {
    if (!this.selectedLayer) {
      this.addForm(e);
    } else {
      console.log('click ', e);
    }
    // console.log('click ecent ', e);

  }
  // myOnclickListener(e) {
  //   return (e) => {
  //     console.log('click e', e);
  //     this.addForm(e);
  //   };
  // }
  addForm(e: MapBrowserEvent) {
    const iconFeatureA = this.map.getFeaturesAtPixel(e.pixel);
    if (iconFeatureA !== null) {
        console.log('iconFeatureA ', iconFeatureA[0].getProperties());
        // this.EditLayerRecord(this.layersList[0].enregistrements[0], this.layersList[0]);
        this.getLayerAndRecord(iconFeatureA[0].get('layer_id'), iconFeatureA[0].getId());
        // formEdit(iconFeatureA[0].getProperties());  //iconFeatureA[0].get("code");
        // e.preventDefault(); // avoid bubbling
    }
  }
  syncLayers() {
    this.startLayersDownloading = true;
    return Promise.resolve(new Promise((resolve) => {
      this.syncService.getLayers()
      .subscribe(
        (layers) => {
          if (layers) {
            this.syncService.setLayers(layers)
            .then((copmleted) => {
              if (copmleted) {
                console.log('syncLayers() Completed');
                this.startLayersDownloading = false;
                resolve(true);
              } else {
                console.log('syncLayers() Faild');
                // setTimeout( () => {
                //   this.syncLayers();
                // }, 500);
                this.startLayersDownloading = false;
                resolve(false);
              }
            });
          }
      }, (e) => {
        console.log('syncLayers() Error', e);
        this.tools.presentAlert('Erreur', e);
        this.startLayersDownloading = false;
        resolve(false);
      }
      );
    }));
  }
  getLayersGroup() {
    return Promise.resolve(new Promise((resolve) => {
      this.cmrMapService.getLayers().then(
        (layers: Layer[]) => {
          if (this.layersList) {
            const format = new WKT();
            this.layersList.forEach(async (layer, index) => {
              await this.populateLayers(layer , format)
              .then((vecLayer: VectorLayer) => {
                this.baseLayerGroup.getLayersArray().push(vecLayer);
                if ((index + 1) === (layers.length)) {
                  this.baseLayerGroup.getLayersArray().push(this.drawVector);
                  this.baseLayerGroup.getLayersArray().push(this.drawVector2);
                  // this.map.addLayer(this.drawVector);
                  // this.map.addLayer(this.drawVector2);
                  this.preInintloading = false;
                  // this.tools.dismissLoading();

                  resolve(this.baseLayerGroup);
                }
              });
            });
          } else {
            this.layersList = layers;
            const format = new WKT();
            layers.forEach(async (layer, index) => {
              await this.populateLayers(layer , format)
              .then((vecLayer: VectorLayer) => {
                this.baseLayerGroup.getLayersArray().push(vecLayer);
                if ((index + 1) === (layers.length)) {
                  this.baseLayerGroup.getLayersArray().push(this.drawVector);
                  this.baseLayerGroup.getLayersArray().push(this.drawVector2);
                  // this.map.addLayer(this.drawVector);
                  // this.map.addLayer(this.drawVector2);
                  this.preInintloading = false;
                  // this.tools.dismissLoading();

                  resolve(this.baseLayerGroup);
                }
              });
            });
          }
        }
      );
    }));

  }
  async populateLayers(layer, format) {
    return Promise.resolve(new Promise((resolve) => {

    const data = layer.enregistrements;
    console.log('data => ', data);

    let defaultStyle = null;
    if (layer.style && layer.style.fillcolor) {
      const fillcolor = new TinyColor(layer.style.fillcolor); // '#ff0000'
      const c = fillcolor.toRgb();
      let fill = null;
      if (layer.style.option === 1) {
          fill = new Fill({
            color: [c.r, c.g, c.b, layer.style.opacity]
          });
      } else {
          fill = new Fill({
              color: [255, 165, 0, 100]
          });
          // fill = new FillPattern({
          //     pattern: layer.style.hatch_pattern,
          //     color: layer.style.hatch_color,
          //     offset: layer.style.hatch_offset,
          //     scale: layer.style.hatch_scale,
          //     fill: new Fill({
          //         color: layer.style.hatch_fill
          //     }),
          //     size: layer.style.hatch_size,
          //     spacing: layer.style.hatch_spacing,
          //     angle: layer.style.hatch_angle
          // });
      }
      defaultStyle = new Style({
        fill,
        stroke: new Stroke({
            color: layer.style.strokecolor,
            width: layer.style.strokewidth
        }),
        text: new Text({
            font: '12px Calibri,sans-serif',
            overflow: true,
            fill: new Fill({
                color: '#000'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 3
            }),
            // text: 'label',
        })
      });

      if (layer.type === 0 || layer.type === 3) {
        if (layer.style.icon !== '' && layer.style.icon != null) {
            defaultStyle = new Style({
                image: new Icon({
                    anchor: [24, 24],
                    size: [64, 64],
                    scale: 0.5,
                    src: 'storage/' + layer.style.icon
                })
            });
        } else {
            defaultStyle = new Style({
                image: new RegularShape({
                    fill: new Fill({
                        color: [c.r, c.g, c.a, layer.style.opacity]
                    }),
                    stroke: new Stroke({
                        color: layer.style.strokecolor,
                        width: layer.style.strokewidth
                    }),
                    points: layer.style.points,
                    radius2: layer.style.radius2,
                    radius: layer.style.radius
                }),
            });
        }
        // tslint:disable-next-line:no-shadowed-variable
        const vectorLayer = new VectorLayer({
                source: new VectorSource({
                  features: new Collection()
            }),
            style: defaultStyle
        });
        vectorLayer.setZIndex(99);
        // vectorLayer.setMap(this.map);
        this.map.addLayer(vectorLayer);
        resolve(vectorLayer);
      }
    }

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: new Collection()
      }),
      style(feature) {
          // tslint:disable-next-line:no-shadowed-variable
          let Style = null;
          const styles = layer.style == null ? null : layer.style.classes;
          let layerstyle = null;
          if (
              layer.style.classified_column !== '' &&
              layer.style.classified_column != null
          ) {
              const value = feature.get(
                  layer.style.classified_column
              );
              if (styles != null) {
                  styles.forEach(style => {
                      if (style.value === value) {
                          layerstyle = new Style({
                              fill: new Fill({
                                  color: style.color
                              }),
                              stroke: defaultStyle.stroke
                          });
                      }
                  });
              }
              if (layerstyle != null) {
                  Style = layerstyle;
              } else {
                  Style = defaultStyle;
              }
          } else {
              Style = defaultStyle;
          }
          if (Style != null && Style.getText() != null && layer.style.label) {

              Style.getText().setText(
                  feature.get(layer.style.label)
              );
          }
          return [Style];
      }

    });
    console.log('style => ', layer.style.label);

    vectorLayer.set('name', layer.name);
    vectorLayer.set('title', layer.name);
    vectorLayer.set('text_id', layer.text_id);
    vectorLayer.set('layer_id', layer.id);
    vectorLayer.set('url', layer.url);
    vectorLayer.set('type', layer.type);
    vectorLayer.set('champs', layer.champs);
    vectorLayer.set('description', layer.description);
    vectorLayer.set('altitudeMode', 'clampToGround');
    vectorLayer.set('crossOrigin', 'anonymous');
    vectorLayer.setVisible(layer.visible);
    // vectorLayer.setVisible(true);
    if (data) {
      const featuresToAdd: Feature<Geometry>[] = [];
      data.forEach((d) => {
        const str = d.shapeastext ;
        if (str) {

          const feature = format.readFeature(str, {
              dataProjection: 'EPSG:3857',
              featureProjection: 'EPSG:3857'
          });
          feature.setId(d.id);
          feature.set('layer_id', layer.id);
          feature.set('layer_name', layer.name);
          feature.set('edited', false);
          feature.set('added', false);
          feature.on('change', () => {
              feature.set('edited', true);
          });
          featuresToAdd.push(feature);
        }
      });
      vectorLayer.getSource().addFeatures(featuresToAdd);
    }
    vectorLayer.setZIndex(99);
    this.map.addLayer(vectorLayer);
    resolve(vectorLayer);
    }));
  }
  itineraire(shapetext, layer?) {
    this.showSearchbar = false ;
    if (shapetext && 0 !== shapetext.length) {
      console.log('itiniraire');
      const format = new WKT();
      this.populateLayers(layer , format);
      const feature = format.readFeature(shapetext,
          {
              dataProjection: 'EPSG:3857',
              featureProjection: 'EPSG:3857'
          });
      const ext = feature.getGeometry().getExtent();
      this.map.getView().fit(ext);
      setTimeout(() => {
        this.map.updateSize();
      }, 2000);
    } else {
      // M.toast({
      //     html: 'Aucune information géométrique',
      //     classes: ['rounded', 'toast']
      // });
    }
    // this.map.updateSize();

  }
  ionViewDidEnter() {
    this.map.updateSize();
  }
  async toolsPopover() {
    const popover = await this.popoverController.create({
      component: ToolsPage,
      componentProps: {
        map: this.map,
        baseMap: this.basemaps,
      },
      translucent: true
    });
    return await popover.present();
  }
  addSwitcher(map) {
    const switcher = new  LayerSwitcher({
      // target: $('#layerSwitcher').get(0),
      target: $('#sidebar').get(0),
      // displayInLayerSwitcher: function (l) { return false; },
      show_progress: true,
      Extent: true,
      trash: true,
      collapsed: true,
      reordering: true,
      oninfo:  () => {
        // Swal.fire(
        //   l.get("name"),
        //   l.get("description"),
        //   "info"
        // )
      }
    });
    // const  sidebar = new Sidebar({ element: $('#sidebar') , position: 'left' });

    map.addControl(switcher);
    // setTimeout(() => {
    //   this.map.updateSize();
    // }, 2000);
    setTimeout(() => {
      this.tools.dismissLoading();
      const view = this.map.getView();
      view.animate({
        center: view.getCenter(),
        duration: 2000,
        zoom: 15
      });
    }, 2000);
  }
  BaseLayers() {
    const bl = [];
    this.basemaps.forEach(l => {
        const layer = new Tile({
            preload: Infinity,
            title: l.nom,
            source: new XYZ({
                attributions: '',
                url: l.url,
                crossOrigin: 'anonymous'
            }),
            visible: l.visible });
        bl.push(
            layer
        );
        l.layer = layer;
    });
    return [
        new Group({
            title: 'Fonds de plan',
            openInLayerSwitcher: true,
            layers: bl
        })
    ];
  }
  filterList(items: any[], searchText: string, fieldName: string, layer: any): any[] {

    // return empty array if array is falsy
    if (!items) { return []; }

    // return the original array if search text is empty
    if (!searchText) { return items; }

    // convert the searchText to lower case
    searchText = searchText.toLowerCase();
    console.log('searchText', searchText, 'items', items);
    // retrun the filtered array
    return items.filter(item => {
      if (item && item[fieldName]) {
        return Object.values(item[fieldName]).find( (value: string) => {
          console.log('value', value);
          if (value && typeof value.valueOf() === 'string') {
            // s is a string
            console.log('value.toLowerCase().includes(searchText)', value.toLowerCase().includes(searchText));
            if (value.toLowerCase().includes(searchText)) {
              const key = Object.keys(item[fieldName]).find(k => {
                return item[fieldName][k] === value;
              });
              if (this.results.length && (this.results.length < 20)) {
                this.results.push({couche: layer, record: item, val: value, field: key});
              } else if (!this.results.length) {
                this.results.push({couche: layer, record: item, val: value, field: key});
              } else {
              }
            }
            return value.toLowerCase().includes(searchText) ? item : false;
          }

        });
      }
      return false;
    });
  }
  filterById(items: any[], id: number, layer: any) {
    // items.filter((item) => {
    //   console.log('items.filter((item) ', id, item);
    //   if (item.id == id) {
    //     console.log('Find (item) ', item);
    //     return this.results.push({couche: layer, record: item});
    //   }
    // });

    const result = items.find((ite, index , array) => {
      if (ite.id == id) {
        this.results.push(
          {
            couche:  layer,
            record: ite 
          }
        );
        return ite;
      }
    });

  }
  addDonneeToLayer(layers, data) {
    // $scope.options = mapOptions;
    return Promise.resolve(new Promise((resolve, reject) => {

      layers.forEach((layer) => {
        const donnees = {};
        layer.enregistrements.forEach((element, index, array) => {
          const dataEnregistrement = data.filter(
              (el) => {
                  return el.enregistrement_id && el.enregistrement_id.toString() === element.id.toString();
              });
          // console.log('dataEnregistrement===' + dataEnregistrement.length + '  enregistrement_id ==' + element.id.toString());
          layer.champs.forEach(champs => {
              const champsRow = dataEnregistrement.filter((el) => {
                  return el.champ_id && el.champ_id.toString() === champs.id.toString();
              });
              if (champsRow) {
                  donnees[champs.name] = champsRow[0].value;
              } else { donnees[champs.name] = ''; }
          });
          element.donnees = donnees;
          if ((index + 1) === layer.length) {
            resolve(true);
          }

        });
      });
  }));
  }
  async getLayersData() {
    this.layersService.getLocalLayersData().then(
      async (data: LayerData[]) => {
        console.log('data: -> ', data);
        if (data) {
          this.layersData = data;
          await this.addDonneeToLayer(this.layersList, data);
        } else {
          this.syncData();
        }
      }
    );
  }
  syncData() {
    this.startDataDownloading = true;
    this.syncService.getLayersData()
    .subscribe((layersData) => {
      console.log('data', layersData);
      this.syncService.setLayersData(layersData)
      .then( (copmleted) => {
        if (copmleted) {
           this.getLayersData();
           this.startDataDownloading = false;
        } else {
          setTimeout( () => {
             this.getLayersData();
          }, 500);
          this.startDataDownloading = true;
        }
      });
    }, (err) => {
      this.startDataDownloading = true;
      this.tools.presentAlert('Erreur', err);
      setTimeout(() => {
        this.getLayersData();
      }, 500);
    }
    );
  }
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

    if (data) {
      this.itineraire(data.record.shapeastext, data.layer);
    }
  }
  getLayerAndRecord(layerId, recordId) {
    const lr = this.layersList.find((layer) => layer.id === layerId);
    const record = lr.enregistrements.find((en) => en.id === recordId);
    console.log('layer =>', lr, record);
    // this.EditLayerRecord(record, lr);
    this.detailLayerRecord(record, lr);
  }
  setLayers() {
    this.tools.presentLoading();
    this.preInintloading = true;
    this.startLayersDownloading = true;
    this.syncService.getLayers()
    .subscribe(
      (layers) => {
      this.syncService.setLayers(layers)
      .then((copmleted) => {
        if (copmleted) {
          // this.tools.presentToast('Succès',  'Opération de synchronisation terminée avec succès');
          this.startLayersDownloading = false;
          this.setLayersData();
        } else {
          this.startLayersDownloading = false;
          this.tools.presentToast('Error',  'Échec de l\'opération de synchronisation, essayez plus tard');
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
          this.preInit();
          // this.tools.presentToast('Succès',  'Opération de synchronisation terminée avec succès');
        } else {
          this.startDataDownloading = false;

          this.tools.presentToast('Error',  'Échec de l\'opération de synchronisation, essayez plus tard');
        }
      });
    }, (err) => {
      this.startDataDownloading = false;
    }
    );
  }
  preInit() {
    this.cmrMapService.getLayers().then((ls: Layer[]) => {
      if (ls) {
        this.layersList = ls;
        console.log('layers _ y ', this.layersList);

        this.customInit();
        setTimeout(() => {
          this.getLayersData();
        }, 2000);
      } else {
        this.syncLayers().then((bool) => {
          if (bool) {
            this.customInit();
            setTimeout(() => {
              this.getLayersData();
            }, 2000);
          }
        });
      }
    });
  }
  async AddLayerRecord() {
    const modal = await this.modalController.create({
      component: AddOnePage,
      componentProps: {
        shapeAsText: this.mapShape,
        layer: this.selectedLayer
      }
    });
    await modal.present();
    // const { data } = await modal.onWillDismiss();
    await modal.onWillDismiss().then((e) => this.map.removeInteraction(this.draw));
    // console.log(data);

    // if (data) {
    //   // this.itineraire(data.record.shapeastext, data.layer);
    //   this.draw.removeInteraction();
    // }
  }
  async editLayerRecord(selectedRecord, selectedLayer) {
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

    if (data) {
      this.itineraire(data.record.shapeastext, data.layer);
    }
  }
  async detailLayerRecord(selectedRecord, selectedLayer) {
    const popover = await this.popoverController.create({
      component: DetailPage,
      componentProps: {
        layer: selectedLayer,
        record: selectedRecord
      },
      translucent: true
    });
    await popover.present();
    const { data } = await popover.onWillDismiss();
    if (data.edit) {
      this.editLayerRecord(data.record, data.layer);
    }
  }
  setGeoBookmark() {
      const geobookmark = new GeoBookmark({
      editable: false,
      marks: {
          Agadir: {
              pos: transform(
                  [-1047575.6563230174, 3545167.3331474583],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 13,
              permanent: true
          },
          'Beni Mellal': {
              pos: transform(
                  [-703507.7279748617, 3816485.8236886347],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 14,
              permanent: true
          },
          'Bou Arfa': {
              pos: transform(
                  [-220694.4129511558, 3831336.779779231],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 14,
              permanent: true
          },
          Essaouira: {
              pos: transform(
                  [-1078052.0679126885, 3684832.5510087614],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 14,
              permanent: true
          },
          'Mohammed V': {
              pos: transform(
                  [-843406.1700986353, 3943946.828606006],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 12,
              permanent: true
          },
          Tanger: {
              pos: transform(
                  [-660571.9833409702, 4262826.185015933],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 14,
              permanent: true
          },
          'Tit melil': {
              pos: transform(
                  [-830208.0431418316, 3974623.5546942567],
                  'EPSG:3857',
                  'EPSG:3857'
              ),
              zoom: 14
          }
      }
      });
      this.map.addControl(geobookmark);
  }
  setSearchNominatim() {
    const search = new SearchNominatim({
        // target: $(".options").get(0),
        polygon: true,
        position: true // Search, with priority to geo position
    });
    this.map.addControl(search);
    search.on('select', (e) => {
        Geoportail.sLayer.getSource().clear();
        if (e.search.geojson) {
            const format = new GeoJSON();
            const f = format.readFeature(e.search.geojson, {
                dataProjection: 'EPSG:4326',
                featureProjection: Geoportail.map.getView().getProjection()
            });
            Geoportail.sLayer.getSource().addFeature(f);
            const view = Geoportail.map.getView();
            const resolution = view.getResolutionForExtent(
                f.getGeometry().getExtent(),
                Geoportail.map.getSize()
            );
            const zoom = view.getZoomForResolution(resolution);
            const centerr = getCenter(f.getGeometry().getExtent());
            setTimeout(() => {
                view.animate({
                    center: centerr,
                    zoom: Math.min(zoom, 16)
                });
            }, 100);
        } else {
            Geoportail.map.getView().animate({
                center: e.coordinate,
                zoom: Math.max(Geoportail.map.getView().getZoom(), 16)
            });
        }
    });

  }
  setGeolocation() {
    const geolocation = new Geolocation({
        projection: this.map.getView().getProjection(),
        trackingOptions: {
            maximumAge: 10000,
            enableHighAccuracy: true,
            timeout: 600000
        }
    });

    geolocation.on('error', (error) => {
        const info = document.getElementById('info');
        alert(error.message);
    });

    const accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', () => {
        Geoportail.accuracyFeature.setGeometry(
            Geoportail.geolocation.getAccuracyGeometry()
        );
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(
        new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({
                    color: '#3399CC'
                }),
                stroke: new Stroke({
                    color: '#fff',
                    width: 2
                })
            })
        })
    );
    geolocation.on('change:position', function() {
        this.coordinates = Geoportail.geolocation.getPosition();
        Geoportail.positionFeature.setGeometry(
            this.coordinates ? new Point(this.coordinates) : null
        );
    });
    const layer = new VectorLayer({
        map: this.map,
        source: new VectorSource({
            features: [accuracyFeature, positionFeature]
        })
    });
    geolocation.setTracking(false);

  }
  async selectLayerPopOver() {
    const mdl = await this.modalController.create({
      component: SelectLayerPage,
      componentProps: {
        layers: this.layersList,
        // record: selectedRecord
      },
      // translucent: true
    });
    await mdl.present();
    const { data } = await mdl.onWillDismiss();
    if (data.layer) {
      console.log('data', data.layer);
      this.selectedLayer = data.layer;
      this.addDrawLayer();

    }
  }

  addDrawLayer() {
    this.map.addInteraction(this.draw);
    this.map.addInteraction(this.snap);
    // this.map.updateSize();

  }
  setDrawLayers() {
    this.drawformat = new WKT();
    this.drawVector = new VectorLayer({
        visible: true,

        source: new VectorSource({
            wrapX: false,
            features: []
        }),
        style: new Style({
            zIndex: 2,
            fill: new Fill({
                color: [0, 0, 255, 0.2]
            }),
            stroke: new Stroke({
                color: [0, 0, 255, 1],
                width: 1
            }),
        })
    });
    this.drawVector2 = new VectorLayer({
      visible: true,
      source: new VectorSource({
          wrapX: false,
          features: []
      }),
      style: new Style({
          zIndex: 1,
          fill: new Fill({
              color: [255, 0, 0, 0.2]
          }),
          stroke: new Stroke({
              color: [255, 0, 0, 1],
              width: 1
          }),
      })
    });
    this.drawVector2.set('title', 'vector 2');
    this.drawVector.set('title', 'vector 1');
    this.drawVector2.setZIndex(1);
    this.drawVector.setZIndex(2);

    this.draw = new Draw({
        source: this.drawVector2.getSource(),
        type: 'Polygon',
    });
    this.draw.on('drawend', (evt) => {
        const wkt = this.drawformat.writeFeature(evt.feature);
        $('#shape').val(wkt);
        // console.log('WKT', wkt );
        this.mapShape = wkt;
        // this.draw.finishDrawing();
        this.AddLayerRecord();
        // this.map.removeInteraction(this.draw);
        // this.map.removeInteraction(this.snap);
        console.log('shape ', this.mapShape);
    });
    this.snap = new Snap({source: this.drawVector.getSource()});
  }




  makeHttpCall() {
    this.http.get('https://jsonplaceholder.typicode.com/comments')
      .subscribe((r) => {
        console.log(r);
      });
  }
}

