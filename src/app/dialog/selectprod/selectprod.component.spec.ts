import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectprodComponent } from './selectprod.component';

describe('SelectprodComponent', () => {
  let component: SelectprodComponent;
  let fixture: ComponentFixture<SelectprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectprodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
