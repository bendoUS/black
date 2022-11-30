import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandedetailComponent } from './commandedetail.component';

describe('CommandedetailComponent', () => {
  let component: CommandedetailComponent;
  let fixture: ComponentFixture<CommandedetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandedetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandedetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
