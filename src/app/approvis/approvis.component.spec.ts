import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovisComponent } from './approvis.component';

describe('ApprovisComponent', () => {
  let component: ApprovisComponent;
  let fixture: ComponentFixture<ApprovisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
