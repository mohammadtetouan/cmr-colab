import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-layer',
  templateUrl: './select-layer.page.html',
  styleUrls: ['./select-layer.page.scss'],
})
export class SelectLayerPage implements OnInit {
  @Input()  layers: any;

  constructor(
    public popoverController: ModalController
  ) { }

  ngOnInit() {
  }
  dismiss(selectedLayer?) {
    if (selectedLayer) {
      this.popoverController.dismiss({
        layer: selectedLayer
      });
    } else {
      this.popoverController.dismiss({
        layer: false
      });
    }
  }
}
