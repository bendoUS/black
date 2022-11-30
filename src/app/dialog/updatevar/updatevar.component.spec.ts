import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatevarComponent } from './updatevar.component';

describe('UpdatevarComponent', () => {
  let component: UpdatevarComponent;
  let fixture: ComponentFixture<UpdatevarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatevarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatevarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
