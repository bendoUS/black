import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddoptComponent } from './addopt.component';

describe('AddoptComponent', () => {
  let component: AddoptComponent;
  let fixture: ComponentFixture<AddoptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddoptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddoptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
