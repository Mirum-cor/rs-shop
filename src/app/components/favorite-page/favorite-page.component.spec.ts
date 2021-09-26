import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { RSSState } from 'src/app/store/rss.state';

import { FavoritePageComponent } from './favorite-page.component';

describe('FavoritePageComponent', () => {
  let component: FavoritePageComponent;
  let fixture: ComponentFixture<FavoritePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoritePageComponent],
      imports: [NgxsModule.forRoot([RSSState])],
      providers: [HttpClient, HttpHandler],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
