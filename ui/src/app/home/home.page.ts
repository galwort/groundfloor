import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageFilename = 'bricks';
  supportingDetails = false;
  dialogue = "What's your company's name?";
  inputText = '';

  constructor() {}

  onSubmit() {
    this.inputText = '';
  }
}
