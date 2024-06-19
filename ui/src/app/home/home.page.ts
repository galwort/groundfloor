import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  showImage = true;
  showSupportingDetails = false;
  showTextInput = false;
  showListInput = true;
  showButton = true;
  showInterviewActions = false;

  buttonLabel = 'Start';
  imageFilename = 'assets/bricks.png';
  inputText = '';
  companyName = 'your company';
  companyDescription = 'nothing';
  list: string[] = [];
  selectedJobTitles: { [key: string]: number } = {};
  hiredCount: { [key: string]: number } = {};
  skills: { name: string; level: number }[] = [];

  questionIndex = 0;
  dialogue =
    'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
  currentJobTitleIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setVH();
    window.addEventListener('resize', this.setVH);
    window.addEventListener('orientationchange', this.setVH);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setVH);
    window.removeEventListener('orientationchange', this.setVH);
  }

  setVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  onButtonClick(event: Event): void {
    event.preventDefault();
    switch (this.questionIndex) {
      case 0:
        this.showImage = false;
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
        this.list = [];
        this.showButton = false;
        this.collectJobTitles();
        this.startInterviewProcess();
        break;
      case 4:
        this.showImage = false;
        this.dialogue = 'More content coming soon!';
        this.showButton = true;
        this.buttonLabel = 'Play Again';
        break;
      case 5:
        this.showImage = true;
        this.imageFilename = 'assets/bricks.png';
        this.showButton = true;
        this.dialogue =
          'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
        this.list = [];
        this.selectedJobTitles = {};
        this.skills = [];
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
        this.list = response.jobs;
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

  onJobTitleChange(jobTitle: string, count: number) {
    if (count > 0) {
      this.selectedJobTitles[jobTitle] = count;
    } else {
      delete this.selectedJobTitles[jobTitle];
    }
  }

  collectJobTitles() {
    const inputs = document.querySelectorAll('ion-input[type="number"]');
    inputs.forEach((input: any, index) => {
      const jobTitle = this.list[index];
      const count = parseInt(input.value, 10) || 0;
      if (count > 0) {
        this.selectedJobTitles[jobTitle] = count;
      } else {
        delete this.selectedJobTitles[jobTitle];
      }
    });
    this.showSupportingDetails = true;
  }

  startInterviewProcess() {
    this.currentJobTitleIndex = 0;
    this.interviewNextJobTitle();
  }

  interviewNextJobTitle() {
    if (
      this.currentJobTitleIndex >= Object.keys(this.selectedJobTitles).length
    ) {
      this.dialogue = 'More content coming soon!';
      this.showSupportingDetails = false;
      this.showImage = false;
      this.showButton = true;
      this.buttonLabel = 'Play Again';
      return;
    }
    const jobTitle = Object.keys(this.selectedJobTitles)[
      this.currentJobTitleIndex
    ];
    this.dialogue = `Interviewing potential ${jobTitle}s...`;
    this.generateJobSkills(jobTitle);
  }

  fetchNames(): Promise<string[]> {
    return this.http
      .get('assets/names.txt', { responseType: 'text' })
      .toPromise()
      .then((data) => {
        if (data) {
          return data.split('\n').filter((name) => name.trim() !== '');
        } else {
          return [];
        }
      });
  }

  async generateJobSkills(jobTitle: string) {
    const url = 'https://fa-groundfloor.azurewebsites.net/api/skills';
    const body = { job_title: jobTitle };

    try {
      const names = await this.fetchNames();
      const randomName = names[Math.floor(Math.random() * names.length)];

      this.http.post<{ skills: string[] }>(url, body).subscribe(
        (response) => {
          const maxSkillLength = Math.max(
            ...response.skills.map((skill) => skill.length)
          );
          const skillsWithLevels = response.skills.map((skill) => {
            const level = Math.floor(Math.random() * 10) + 1;
            const paddedSkill = skill.padEnd(maxSkillLength + 2, ' ');
            return `${paddedSkill}${'■'.repeat(level)}`;
          });
          this.dialogue = `${randomName}\n\n${skillsWithLevels.join('\n')}`;
          this.fetchRandomCandidateImage();
          this.showInterviewActions = true;
        },
        (error) => {
          console.error('Error generating job skills:', error);
          this.dialogue =
            'There was an error generating job skills. Please try again.';
        }
      );
    } catch (error) {
      console.error('Error fetching names:', error);
      this.dialogue = 'There was an error fetching names. Please try again.';
    }
  }

  fetchRandomCandidateImage() {
    this.imageFilename = 'https://thispersondoesnotexist.com';
    this.showImage = true;
  }

  hireCandidate() {
    const jobTitle = Object.keys(this.selectedJobTitles)[
      this.currentJobTitleIndex
    ];
    this.hiredCount[jobTitle] = (this.hiredCount[jobTitle] || 0) + 1;
    if (this.hiredCount[jobTitle] === this.selectedJobTitles[jobTitle]) {
      this.currentJobTitleIndex++;
    }
    this.showInterviewActions = false;
    this.interviewNextJobTitle();
  }

  passCandidate() {
    this.showInterviewActions = false;
    this.interviewNextJobTitle();
  }

  getObjectKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  refresh() {
    this.showImage = true;
    this.imageFilename = 'assets/bricks.png';
    this.inputText = '';
    this.companyName = 'your company';
    this.companyDescription = 'nothing';
    this.list = [];
    this.selectedJobTitles = {};
    this.hiredCount = {};
    this.skills = [];
    this.questionIndex = 0;
    this.dialogue =
      'Ground Floor is a Sims like game for building your own company that uses LLMs to generate elements of the game.';
    this.showTextInput = false;
    this.showButton = true;
    this.buttonLabel = 'Start';
  }
}
