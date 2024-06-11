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
  companyDescription = 'nothing';
  jobTitles: string[] = [];
  selectedJobTitles: { [key: string]: number } = {};

  questionIndex = 0;
  dialogue =
    'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';

  constructor(private http: HttpClient) {}

  onButtonClick(event: Event): void {
    event.preventDefault();
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
        this.jobTitles = [];
        this.showButton = false;
        this.collectJobTitles();
        this.startInterviewProcess();
        break;
      case 4:
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

  collectJobTitles() {
    const inputs = document.querySelectorAll('ion-input[type="number"]');
    inputs.forEach((input: any, index) => {
      const jobTitle = this.jobTitles[index];
      const count = parseInt(input.value, 10) || 0;
      if (count > 0) {
        this.selectedJobTitles[jobTitle] = count;
      }
    });
  }

  startInterviewProcess() {
    const jobTitle = Object.keys(this.selectedJobTitles)[0];
    this.dialogue = `Interviewing potential ${jobTitle}s...`;
    this.generateJobSkills(jobTitle);
  }

  generateJobSkills(jobTitle: string) {
    const url = 'https://fa-groundfloor.azurewebsites.net/api/skills';
    const body = { job_title: jobTitle };

    this.http.post<{ skills: string[] }>(url, body).subscribe(
      (response) => {
        this.dialogue = `The skills required for ${jobTitle} are: ${response.skills.join(
          ', '
        )}`;
        this.showButton = true;
        this.buttonLabel = 'Next';
      },
      (error) => {
        console.error('Error generating job skills:', error);
        this.dialogue =
          'There was an error generating job skills. Please try again.';
      }
    );
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  refresh() {
    this.inputText = '';
    this.companyName = 'your company';
    this.companyDescription = 'nothing';
    this.jobTitles = [];
    this.questionIndex = 0;
    this.dialogue =
      'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
    this.showTextInput = false;
    this.showButton = true;
    this.buttonLabel = 'Start';
  }
}
