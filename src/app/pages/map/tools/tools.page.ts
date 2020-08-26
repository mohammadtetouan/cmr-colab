import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import LayerSwitcher from 'ol-layerswitcher';
import Map from 'ol/Map';
import { BaseMap } from '../../../interfaces/layer.model';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.page.html',
  styleUrls: ['./tools.page.scss'],
})
export class ToolsPage implements OnInit {
  @Input()  map: Map;
  @Input()  baseMap: BaseMap[];


  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController


  ) { }

  ngOnInit() {
    this.addSwitcher(this.map);
  }
  dismiss() {
    this.popoverController.dismiss({
      dismissed: true
    });
  }
  addSwitcher(map) {
    const switcher = new  LayerSwitcher({
      target: $("#layerSwitcher").get(0),
      // displayInLayerSwitcher: function (l) { return false; },
      show_progress: true,
      extent: true,
      trash: true,
      oninfo:  (l) => {
        // Swal.fire(
        //   l.get("name"),
        //   l.get("description"),
        //   "info"
        // )
      }
    });
    map.addControl(switcher);
  }
  activeLayer(index) {
    console.log( index, this.baseMap);
    const lt = this.baseMap.length;

    for (var i = 0; i < this.baseMap.length; i++) {
      console.log(i, index, this.baseMap);
      this.baseMap[i].layer.setVisible(false);
    }
    this.baseMap[index].layer.setVisible(true);
    this.dismiss();
  }
}
