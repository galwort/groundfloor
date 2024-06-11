import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  showSupportingDetails = false;
  showTextInput = false;
  showButton = true;

  buttonLabel = 'Start';
  imageFilename = 'bricks';
  inputText = '';
  companyName = 'your company';
  companyDescription = '';
  jobTitles: string[] = [];

  questionIndex = 0;
  dialogue =
    'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';

  constructor(private http: HttpClient) {}

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
      case 2:
        this.companyDescription = this.inputText;
        this.generateJobTitles(this.companyDescription);
        this.showButton = false;
        this.dialogue = `Generating job titles for ${this.companyName}...`;
        this.inputText = '';
        this.showTextInput = false;
        break;
      case 3:
        this.dialogue =
          'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
        this.jobTitles = [];
        this.questionIndex = -1;
        this.showTextInput = false;
        this.buttonLabel = 'Start';
        break;
    }
    this.questionIndex++;
  }

  generateJobTitles(description: string) {
    const url = 'https://fa-groundfloor.azurewebsites.net/api/jobs';
    const body = { company_description: description };

    this.http.post<{ jobs: string[] }>(url, body).subscribe(
      (response) => {
        this.jobTitles = response.jobs;
        this.dialogue = `Which positions would you like to hire for?`;
        this.showButton = true;
        this.buttonLabel = 'Interview';
      },
      (error) => {
        console.error('Error generating job titles:', error);
        this.dialogue =
          'There was an error generating job titles. Please try again.';
      }
    );
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  refresh() {
    this.companyName = 'your company';
    this.companyDescription = '';
    this.jobTitles = [];
    this.questionIndex = 0;
    this.dialogue =
      'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
    this.showTextInput = false;
    this.showButton = true;
    this.buttonLabel = 'Start';
  }
}
