import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OutilsPage } from './outils.page';

describe('OutilsPage', () => {
  let component: OutilsPage;
  let fixture: ComponentFixture<OutilsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutilsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OutilsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
