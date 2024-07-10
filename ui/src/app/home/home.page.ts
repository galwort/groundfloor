import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  companyName = '';
  currentPhase = 'companyName';

  constructor(private gameService: GameService) {}

  setVH = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  openLink(link: string) {
    window.open(link, '_blank');
  }

  refresh() {
    this.currentPhase = 'companyName';
  }

  onCompanyNameSubmitted(name: string) {
    this.companyName = name;
    this.currentPhase = 'companyDescription';
  }
}
