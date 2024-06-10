import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showSupportingDetails = false;
  showTextInput = false;

  buttonLabel = 'Start';
  imageFilename = 'bricks';
  inputText = '';
  companyName = 'your company';
  companyDescription = '';

  questionIndex = 0;
  dialogue =
    'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';

  constructor() {}

  onButtonClick() {
    switch (this.questionIndex) {
      case 0:
        this.dialogue = "What's your company's name?";
        this.showTextInput = true;
        this.buttonLabel = 'Next';
        break;
      case 1:
        this.companyName = this.inputText;
        this.dialogue = `What does ${this.companyName} do?`;
        this.inputText = '';
        break;
    }
    this.questionIndex++;
  }
}
