import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ToolsService } from '../../../generic/tools.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @Input()  layer: any;
  @Input()  record: any;
  formItems = [];

  constructor(
    public modalController: ModalController,
    public popoverController: PopoverController,
    public tools: ToolsService

  ) { }

  ngOnInit() {
    this.formEdit(this.record);
  }
  dismiss() {
    this.popoverController.dismiss({
      dismissed: true
    });
  }
  formEdit(object) {
    const newDoc = document;
    const fields = this.layer.champs;
    fields.forEach(field => {
      this.formItems.push({
        label: field.name,
        type: field.type === 1 ? 'text' : field.type === 2 ? 'number' : field.type === 3 ? 'date' : 'text',
        required: field.required,
        // required: true,
        value: (object.donnees)[field.name]
      });
    });

  }
  itineraire(first, second) {
    // pass
  }
  EditLayerRecord() {
    this.popoverController.dismiss({
      edit: true,
      layer: this.layer,
      record: this.record
    });
  }
  deleteRecord() {
    // this.tools.presentAlert("Attention!", "êtes-vous sûr de vouloir supprimer cet enregistrement avec l'ID: " + this.record.id);
    this.tools.alertConfirmation(
      "Attention!", "êtes-vous sûr de vouloir supprimer cet enregistrement ?",
      "D'accord",
      "Annuler")
      .then((res) =>  {
        if (res) {
          this.tools.presentAlert('Supprimé', 'Votre article a été supprimé avec succès');
          this.dismiss();
        }
      });

  }
}
