import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import $ from 'jquery';
import { Storage } from '@ionic/storage';
import { WKT } from 'ol/format';
// import Tile from 'ol/Tile';
import { XYZ, Vector as vectorSource, OSM} from 'ol/source';
import { View, Feature, Collection } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Vector } from 'ol/layer';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Draw from 'ol/interaction/Draw';
import Snap from 'ol/interaction/Snap';
import TileLayer from 'ol/layer/Tile';
import { LayersService } from '../layers.service';
import { DataBaseService } from '../../../dataBase/data-base.service';
import { DataBase, BaseMap, Layer } from '../../../interfaces/layer.model';
import { Vector as VectorLayer, Group, Tile} from 'ol/layer';
import GeometryType from 'ol/geom/GeometryType';
import Geometry from 'ol/geom/Geometry';
import RegularShape from 'ol/style/RegularShape';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import { TinyColor } from '@ctrl/tinycolor';
import { ToolsService } from '../../../generic/tools.service';


@Component({
  selector: 'app-add-one',
  templateUrl: './add-one.page.html',
  styleUrls: ['./add-one.page.scss'],
})
export class AddOnePage implements OnInit {
  @Input()  layer: any;
  @Input()  shapeAsText: string;
  segmentValue = 'Infos';
  // public myForm: FormGroup;
  playerCount = 1;
  mapShape: string;
  map: Map;
  vectorSource = new VectorSource();
  spinner = false;
  formItems = [];
  layers = [];

  // Data passed in by componentProps

  constructor(
    private storage: Storage,
    public modalController: ModalController,
    private layersService: LayersService,
    public alertController: AlertController,
    private db: DataBaseService,
    private tools: ToolsService


  ) { }

  ngOnInit() {
    if (this.layer) {
      this.formAdd(this.layer);
    } else {
      this.getLayersList();
    }
  }
  getLayersList() {
    this.layersService.getLocalLayers().then(
      (layers: Layer[]) => {
        console.log('layers: -> ', layers);
        if (layers) {
        this.layers = layers;
        }
      }
    );
  }
  onLayerChange(event: any, id?: any) {
    if (id) {
      this.changeLayerSelection(id);
    } else if (event.target.value !== 0) {
      console.log('value ', event.target.value);
      this.changeLayerSelection(event.target.value);
    }
  }
  changeLayerSelection(value) {
    const vector = this.layers.filter((el) => {
      return el.id && el.id.toString() === value.toString();
    });
    this.layer = vector[0];
    console.log('selectedLayer', this.layer);
    this.formAdd(this.layer);
  }
  addControl() {
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
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
  formAdd(layer) {
    this.formItems = [];
    const newDoc = document;
    const fields = layer.champs;

    const span = newDoc.createElement('span');
    this.setAttributesElement(span, {textContent: '&times;', class: 'close'});
    const tagForm = document.getElementById('formElement'); // newDoc.createElement("form");
    while (tagForm.firstChild) {
        tagForm.removeChild(tagForm.lastChild);
    }
    const shapeInput = newDoc.createElement('ion-input');
    this.setAttributesElement(shapeInput, {type: 'hidden', name: 'shape', value: '', id: 'shape'});
    fields.forEach(field => {
      this.formItems.push({
        label: field.name,
        type: field.type === 1 ? 'text' : field.type === 2 ? 'number' : field.type === 3 ? 'date' : 'text',
        required: field.required,
        // required: true,
        value: '',
      });

      // const property = field.name;
      // const required = field.required;
      // const elementDivFormGroup = newDoc.createElement('ion-item');
      // elementDivFormGroup.setAttribute('position', 'floating');
      // const elementLabel = newDoc.createElement('ion-label'); // input element, text
      // let innerHTML = field.alias ? field.alias : property;
      // if (required === true) { innerHTML += '&nbsp;<span style=\'background: red\'>*</span>'; }
      // elementLabel.innerHTML = innerHTML; // camelize(property);
      // elementLabel.setAttribute('for', property);
      // const elementInput = newDoc.createElement('ion-input');         // elementInput.required = required;
      // const type = field.type;
      // const typeLabel = type === 1 ? 'text' : type === 2 ? 'number' : type === 3 ? 'date' : 'text';
      // this.setAttributesElement(elementInput, {
      //     type: typeLabel,
      //     name: property,
      //     class: 'form-control',            //   'value': $object[property],
      //     required
      // });
      // elementDivFormGroup.appendChild(elementInput);
      // elementDivFormGroup.appendChild(elementLabel);
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
    // $('#myModal').modal('open'); // ;modal('show');
    // setTimeout(() => {
    //     mapElement.updateSize();
    // }, 2000);
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
    const element = {
      donnees: {},
    };
    const donnees = {};
    values.forEach(val => {
        donnees[val.name] = val.value;
    });
    donnees['isnew'] = true;
    element.donnees = donnees;
    element['isnew'] = true;
    element['shapeastext'] = donnees['shape'];
    element['local'] = true;
    element['layer_id'] = this.layer.id;
    element['layer_name'] = this.layer.name;
    element['shapeastext'] = this.mapShape;
    console.log('shapeastext',  this.mapShape, element['shapeastext']);
    this.layer.enregistrements.unshift(element);
    await this.layersService.addRecord(this.layer);
    this.db.addRecordToUploadList(element)
    .then((record) => {
      if (record) {
        this.db.getorCreateDataBase()
        .then((dtb: DataBase) => {
          console.log('dtb.recordsToUpload ', dtb.recordsToUpload);
        });
        // this.presentAlertcreated(this.layer);
        this.storage.set('layers', [this.layer]).then((ls) => {
          this.tools.presentAlert('Merci', 'Votre article a été créé avec succès');
        });
        this.dismiss();
      }
    });
    //  alert(vector[0]['enregistrements'].length);
  }
  // async presentAlertcreated(layer) {
  //   const alert = await this.alertController.create({
  //     header: 'Merci',
  //     message: 'votre élément a été créé avec succès',
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
    const osm = new Tile({
      preload: Infinity,
      source: new XYZ({
        attributions: '',
        url: "https:\/\/mt1.google.com\/vt\/lyrs=r&x={x}&y={y}&z={z}",
        crossOrigin: 'anonymous'
      }),
      visible: true
    });
    const view1 = new View({
        center: fromLonLat([-7.638537, 33.5774929]),
        zoom: 10
    });

    this.map = new Map({
        target: document.getElementById('mapElement'),
        layers: [osm],
        view: view1
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
    this.itineraire(this.shapeAsText, this.layer);

    return this.map;
  }

  itineraire(shapetext, layer?) {
    // this.showSearchbar = false ;
    if (shapetext && 0 !== shapetext.length) {
      console.log('itiniraire');
      const format = new WKT();
      this.populateLayers(layer , format, shapetext);
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
  async populateLayers(layer, format, featuresToAdd) {
    return Promise.resolve(new Promise((resolve) => {

    const data = layer.enregistrements;
    let defaultStyle = null;
    if (layer.style && layer.style.fillcolor) {
      const fillcolor = new TinyColor(layer.style.fillcolor); // '#ff0000'
      const c = fillcolor.toRgb();
      let fill = null;
      if (layer.style.option === 1) {
          fill = new Fill({
            color: [255, 0, 0	, 1]
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
            color: [255, 0, 0	, 1],
            width: 2
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
                        color: [255, 0, 0	, 1]
                    }),
                    stroke: new Stroke({
                        color: [255, 0, 0	, 1],
                        width: 2
                    }),
                    points: 1,
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
                                  color: [255, 0, 0	, 1]
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
    vectorLayer.setVisible(true);

    if (featuresToAdd) {
      const nextFeature: Feature<Geometry>[] = [];
      data.forEach((d) => {
        const str = featuresToAdd ;
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
          nextFeature.push(feature);
        }
      });
      vectorLayer.getSource().addFeatures(nextFeature);
    }
    resolve(vectorLayer);
    this.map.addLayer(vectorLayer);
    }));
  }
}
