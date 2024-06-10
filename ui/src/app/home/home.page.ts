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
  companyName = '';
  questionIndex = 0;

  constructor() {}

  onSubmit() {
    if (this.questionIndex === 0) {
      this.companyName = this.inputText;
      this.dialogue = `What does ${this.companyName} do?`;
      this.inputText = '';
      this.questionIndex++;
    } else {
      console.log(
        `Company Name: ${this.companyName}, Company Description: ${this.inputText}`
      );
    }
  }
}
