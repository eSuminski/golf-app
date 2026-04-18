import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Organize } from './organize';

describe('Organize', () => {
  let component: Organize;
  let fixture: ComponentFixture<Organize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Organize],
    }).compileComponents();

    fixture = TestBed.createComponent(Organize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
