import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddOnePage } from './add-one.page';

describe('AddOnePage', () => {
  let component: AddOnePage;
  let fixture: ComponentFixture<AddOnePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddOnePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
