import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovComponent } from './approv.component';

describe('ApprovComponent', () => {
  let component: ApprovComponent;
  let fixture: ComponentFixture<ApprovComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
