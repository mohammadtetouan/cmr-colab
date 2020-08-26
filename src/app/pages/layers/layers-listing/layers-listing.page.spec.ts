import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LayersListingPage } from './layers-listing.page';

describe('LayersListingPage', () => {
  let component: LayersListingPage;
  let fixture: ComponentFixture<LayersListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayersListingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LayersListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
