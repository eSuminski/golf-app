import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Finalize } from './finalize';

describe('Finalize', () => {
  let component: Finalize;
  let fixture: ComponentFixture<Finalize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Finalize],
    }).compileComponents();

    fixture = TestBed.createComponent(Finalize);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
