import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'https://fa-groundfloor.azurewebsites.net/api';

  constructor(private http: HttpClient) {}

  generateJobTitles(description: string): Observable<{ jobs: string[] }> {
    return this.http.post<{ jobs: string[] }>(`${this.apiUrl}/jobs`, {
      company_description: description,
    });
  }

  fetchNames(): Observable<string[]> {
    return this.http
      .get('assets/names.txt', { responseType: 'text' })
      .pipe(
        map((data) => data.split('\n').filter((name) => name.trim() !== ''))
      );
  }

  fetchPersonality(name: string): Observable<{ personality: string }> {
    return this.http.post<{ personality: string }>(
      `${this.apiUrl}/personalities`,
      { name }
    );
  }

  fetchSalary(
    jobTitle: string,
    skills: { [key: string]: number }
  ): Observable<{ salary: number }> {
    return this.http.post<{ salary: number }>(`${this.apiUrl}/salaries`, {
      job_title: jobTitle,
      skills,
    });
  }

  generateJobSkills(jobTitle: string): Observable<{ skills: string[] }> {
    return this.http.post<{ skills: string[] }>(`${this.apiUrl}/skills`, {
      job_title: jobTitle,
    });
  }
}
