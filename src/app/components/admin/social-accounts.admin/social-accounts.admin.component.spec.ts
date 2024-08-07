import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialAccountsAdminComponent } from './social-accounts.admin.component';

describe('SocialAccountsAdminComponent', () => {
  let component: SocialAccountsAdminComponent;
  let fixture: ComponentFixture<SocialAccountsAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialAccountsAdminComponent]
    });
    fixture = TestBed.createComponent(SocialAccountsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
