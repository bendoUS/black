import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovdtlComponent } from './aprovdtl.component';

describe('AprovdtlComponent', () => {
  let component: AprovdtlComponent;
  let fixture: ComponentFixture<AprovdtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprovdtlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovdtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
