import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {
  @ViewChild("restOfContacts") restOfContacts: ElementRef = { nativeElement: '' };

  toggleRestOfContacts(): void {
    this.restOfContacts.nativeElement.classList.toggle('invisible');
  }
}
