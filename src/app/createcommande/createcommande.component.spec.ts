import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatecommandeComponent } from './createcommande.component';

describe('CreatecommandeComponent', () => {
  let component: CreatecommandeComponent;
  let fixture: ComponentFixture<CreatecommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatecommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatecommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
