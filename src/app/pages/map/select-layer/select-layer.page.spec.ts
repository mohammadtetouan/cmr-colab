import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLayerPage } from './select-layer.page';

describe('SelectLayerPage', () => {
  let component: SelectLayerPage;
  let fixture: ComponentFixture<SelectLayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLayerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
