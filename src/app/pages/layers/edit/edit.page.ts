import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { XYZ, Vector as vectorSource, OSM} from 'ol/source';
import Map from 'ol/Map';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { Vector } from 'ol/layer';
import { fromLonLat } from 'ol/proj';
import View from 'ol/View';
import WKT from 'ol/format/WKT';
// import TileLayer from 'ol/layer/Tile';
import Snap from 'ol/interaction/Snap';


import Collection from 'ol/Collection';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import RegularShape from 'ol/style/RegularShape';
import {Tile as TileLayer, Vector as VectorLayer, Group, Tile} from 'ol/layer';
import {Vector as VectorSource} from 'ol/source';


import { TinyColor } from '@ctrl/tinycolor';
import Geometry from 'ol/geom/Geometry';
import { Feature } from 'ol';
import Draw from 'ol/interaction/Draw';
import { LayersService } from '../layers.service';
import { DataBaseService } from '../../../dataBase/data-base.service';
import { DataBase } from '../../../interfaces/layer.model';
import { ToolsService } from '../../../generic/tools.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  segmentValue = 'Infos';
  @Input()  layer: any;
  @Input()  record: any;
  map: Map;
  spinner = false;
  formItems = [];
  mapShape: string;

  // vectorSource = new VectorSource();

  constructor(
    private storage: Storage,

    public modalController: ModalController,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private layersService: LayersService,
    private db: DataBaseService,
    private tools: ToolsService

  ) { }

  ngOnInit() {
    this.formEdit(this.record);
  }
  dismiss(updated?) {
    if (updated) {
      this.modalController.dismiss({
        dismissed: true,
        record: this.record,
        layer: this.layer
      });
    } else {
      this.modalController.dismiss();
    }
  }
  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;
    if (ev.detail.value === 'Situation') {
      this.spinner = true;
      setTimeout(() => {
        if (!this.map) {
          this.initMapForm();
          this.spinner = false;

        } else {
          this.spinner = false;

        }
      }, 2000);
    }
  }
  formEdit(object) {

    const newDoc = document;
    const fields = this.layer.champs;

    // const span = newDoc.createElement('span');
    // this.setAttributesElement(span, {textContent: '&times;', class: 'close'});
    // const tagForm = document.getElementById('formElement'); // newDoc.createElement("form");
    // while (tagForm.firstChild) {
    //     tagForm.removeChild(tagForm.lastChild);
    // }

    // const shapeInput = newDoc.createElement('ion-input');
    // this.setAttributesElement(shapeInput, {type: 'hidden', name: 'shape', value: '', id: 'shape'});
    fields.forEach(field => {
      this.formItems.push({
        label: field.name,
        type: field.type === 1 ? 'text' : field.type === 2 ? 'number' : field.type === 3 ? 'date' : 'text',
        required: field.required,
        // required: true,
        value: (object.donnees)[field.name]
      });
      // const property = field.name;
      // const required = field.required;
      // console.log('required => ', required);
      // const elementDivFormGroup = newDoc.createElement('ion-item');
      // const elementLabel = newDoc.createElement('ion-label'); // input element, text
      // let innerHTML = field.alias ? field.alias : property;
      // if (required === true) { innerHTML += '&nbsp;<span style=\'background: red\'>*</span>'; }
      // elementLabel.innerHTML = innerHTML;
      // elementLabel.setAttribute('position', 'floating');
      // const elementInput = newDoc.createElement('ion-input');         // elementInput.required = required;
      // const type = field.type;
      // const typeLabel = type === 1 ? 'text' : type === 2 ? 'number' : type === 3 ? 'date' : 'text';
      // this.setAttributesElement(elementInput, {
      //   type: typeLabel,
      //   name: property,
      //   class: 'form-control',
      //   value: (object['donnees'])[property],
      //   required : field.required
      // });
      // elementDivFormGroup.appendChild(elementLabel);
      // elementDivFormGroup.appendChild(elementInput);
      // tagForm.appendChild(elementDivFormGroup);
    });

    // const inputShape = newDoc.createElement('ion-input');
    // this.setAttributesElement(inputShape, {type: 'hidden', name: 'shape', value: 'submit', id: 'shape'});
    // tagForm.appendChild(inputShape);
    // const btnOK = newDoc.createElement('ion-input'); // input element, Submit button
    // this.setAttributesElement(btnOK, {
    //     type: 'submit',
    //     innerHTML: '<span><i class=\'material-icons left\'>save</i>  OK</span>',
    //     class: 'waves-effect waves-light btn modal-trigger'
    // });
    // tagForm.appendChild(btnOK);
    // tagForm.appendChild(span);
  }
  setAttributesElement(element, tab) {
    for (const key in tab) {
        if (tab.hasOwnProperty(key)) {
            element.setAttribute(key, tab[key]);
        }
    }
  }
  async onSubmit() {
    console.log('this.formItems', this.formItems);
    const form2 = $( '#form2' );
    const values = form2.serializeArray();
    console.log('form2 ', values);

    // const form = $( '#formElement' );
    // const values = form.serializeArray();
    // console.log('form ', values);
    // $( 'formElement' ).submit(function( event ) {
    //   console.log( 'form 2', $( this ).serializeArray() );
    //   event.preventDefault();
    // });
    const element = {
      donnees: {},
    };
    const donnees = {};
    // this.layer['champs'].forEach(champs => {
    //      donnees[champs['name']] = this.layer['enregistrements'].filter(function (el) {
    //     return el['champ_id'] && el['champ_id'].toString() == element['id'].toString();
    //    })
    //   });
    values.forEach(val => {
        donnees[val.name] = val.value;
    });
    donnees['isnew'] = true;
    element.donnees = donnees;
    element['isnew'] = true;
    this.record.modified = true ;
    this.record.donnees = donnees;
    if (this.mapShape) {
      element['shapeastext'] = this.mapShape;
      this.record.shapeastext = this.mapShape;

    } else {
      element['shapeastext'] = donnees['shape'];
    }
    const newRecord = element;
    this.layer.enregistrements = this.layer.enregistrements.map(
      (el) => {
        if (el.id === this.record.id) {
          return this.record;
        } else {
          return el;
        }

      });
    await this.layersService.addRecord(this.layer);

    this.db.addRecordToUploadList(element)
      .then((record) => {
        if (record) {
          this.db.getorCreateDataBase()
          .then((dtb: DataBase) => {
            console.log('dtb.recordsToUpload ', dtb.recordsToUpload);
          });
          this.storage.set('layers', [this.layer]).then((ls) => {
            this.tools.presentAlert('Merci', 'Votre article a été mis à jour avec succès');
          });
          this.dismiss(true);
        }
      });
    //  alert(vector[0]['enregistrements'].length);

    // this.presentAlertcreated(this.layer);
    // this.dismiss();
  }
  // async presentAlertcreated(layer) {
  //   const alert = await this.alertController.create({
  //     header: 'Merci',
  //     message: 'Votre article a été mis à jour avec succès',
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: async (blah) => {
  //           this.storage.set('layers', [layer]).then((ls) => {
  //             console.log(' stored layers => ', ls);
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }
  initMapForm() {
    const format = new WKT();
    const osm = new TileLayer({
      preload: Infinity,
      source: new XYZ({
                attributions: '',
                url: 'https:\/\/mt1.google.com\/vt\/lyrs=r&x={x}&y={y}&z={z}',
                crossOrigin: 'anonymous'
            }),
      visible: true
    });
    // const osm = new Tile({
    //     preload: Infinity,
    //     source: new XYZ({
    //         attributions: '',
    //         url: 'https:\/\/mt1.google.com\/vt\/lyrs=r&x={x}&y={y}&z={z}',
    //         crossOrigin: 'anonymous'
    //     }),
    //     visible: true
    // });
    const view = new View({
        center: fromLonLat([-7.638537, 33.5774929]),
        zoom: 10
    });

    this.map = new Map({
        target: document.getElementById('mapElement'),
        layers: [osm],
        view
    });
    const vector = new Vector({
        source: new vectorSource({
            wrapX: false,
            features: []
        }),
        style: new Style({
            fill: new Fill({
                color: [0, 0, 255, 0.2]
            }),
            stroke: new Stroke({
                color: [0, 0, 255, 1],
                width: 1
            }),
        })
    });
    this.map.addLayer(vector);
    const vector2 = new Vector({
        source: new vectorSource({
            wrapX: false,
            features: []
        }),
        style: new Style({
            fill: new Fill({
                color: [255, 0, 0, 0.2]
            }),
            stroke: new Stroke({
                color: [255, 0, 0, 1],
                width: 1
            }),
        })
    });
    this.map.addLayer(vector2);
    // const draw = new Draw({
    //     source: vector2.getSource(),
    //     type: 'Polygon'
    //   });
    // draw.on('drawend', (evt) => {
    //     const wkt = format.writeFeature(evt.feature);
    //     $('#shape').val(wkt);
    // });
    // this.map.addInteraction(draw);
    const snap = new Snap({source: vector.getSource()});
    this.map.addInteraction(snap);
    // M.toast({
    //     html: ' <i class="material-icons">refresh</i>&nbsp;Initialisation des composants...',
    //     classes: ['rounded', 'toast']
    // });
    this.map.updateSize();
    this.itineraire(this.record['shapeastext'], this.layer);
    return this.map;
  }


  itineraire(shapetext, layer?) {
    // this.showSearchbar = false ;
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
  async populateLayers(layer, format) {
    return Promise.resolve(new Promise((resolve) => {

    const data = layer.enregistrements;
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
            })
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
                })
            });
        }
        // tslint:disable-next-line:no-shadowed-variable
        const vectorLayer = new VectorLayer({
                source: new VectorSource({
                  features: new Collection()
            }),
            style: defaultStyle
        });
        this.map.addLayer(vectorLayer);
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
          if (Style != null && Style.getText() != null && layer.style.label !== '') {
              Style.getText().setText(
                  feature.get(layer.style.label)
              );
          }
          return [Style];
      }

    });

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
    resolve(vectorLayer);
    this.map.addLayer(vectorLayer);
    }));
  }

  editMap() {
    const format = new WKT();
    // const osm = new Tile({
    //   preload: Infinity,
    //   source: new XYZ({
    //     attributions: '',
    //     url: "https:\/\/mt1.google.com\/vt\/lyrs=r&x={x}&y={y}&z={z}",
    //     crossOrigin: 'anonymous'
    //   }),
    //   visible: true
    // });
    // const view1 = new View({
    //     center: fromLonLat([-7.638537, 33.5774929]),
    //     zoom: 10
    // });

    // this.map = new Map({
    //     target: document.getElementById('mapElement'),
    //     layers: [osm],
    //     view: view1
    // });
    const vector = new Vector({
        source: new vectorSource({
            wrapX: false,
            features: []
        }),
        style: new Style({
            fill: new Fill({
                color: [0, 0, 255, 0.2]
            }),
            stroke: new Stroke({
                color: [0, 0, 255, 1],
                width: 1
            }),
        })
    });
    this.map.addLayer(vector);

    const vector2 = new Vector({
        source: new vectorSource({
            wrapX: false,
            features: []
        }),
        style: new Style({
            fill: new Fill({
                color: [255, 0, 0, 0.2]
            }),
            stroke: new Stroke({
                color: [255, 0, 0, 1],
                width: 1
            }),
        })
    });
    this.map.addLayer(vector2);

    const draw = new Draw({
        source: vector2.getSource(),
        type: 'Polygon'
    });

    draw.on("drawend", (evt) => {
        let wkt = format.writeFeature(evt.feature);
        $("#shape").val(wkt);
        // console.log('WKT', wkt );
        this.mapShape = wkt;
    });
    this.map.addInteraction(draw);
    const snap = new Snap({source: vector.getSource()});
    this.map.addInteraction(snap);
    // M.toast({
    //     html: ' <i class="material-icons">refresh</i>&nbsp;Initialisation des composants...',
    //     classes: ['rounded', 'toast']
    // });
    this.map.updateSize();
    return this.map;
  }
}
