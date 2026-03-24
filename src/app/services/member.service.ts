import { inject, Injectable, signal } from '@angular/core';
import { Models, Teams } from 'appwrite';
import { AppwriteService } from './appwrite.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private appwrite = inject(AppwriteService);
  private teams = new Teams(this.appwrite.client);

  members = signal<Models.Membership[]>([]);
  teamList = signal<Models.Team[]>([]);

  async getMembers(): Promise<Models.Membership[]> {
    const res = await this.teams.listMemberships({
      teamId: environment.appwrite.teamId,
    });
    this.members.set(res.memberships);
    return res.memberships;
  }

  async getTeams(): Promise<Models.Team[]> {
    const result = await this.teams.list();
    this.teamList.set(result.teams);
    return result.teams;
  }
}
