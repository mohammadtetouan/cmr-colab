import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthActionsPage } from './auth-actions.page';

describe('AuthActionsPage', () => {
  let component: AuthActionsPage;
  let fixture: ComponentFixture<AuthActionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthActionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
