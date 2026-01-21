import { Component, input, output, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-button',
  imports: [],
  templateUrl: './star-button.html',
  styleUrl: './star-button.css',
})
export class StarButton {
  disabled = input<boolean>();
  selected = input<boolean>();
  clickEvent = output<Event>();

  protected onClick(event: Event) {
    this.clickEvent.emit(event);
  }
}
