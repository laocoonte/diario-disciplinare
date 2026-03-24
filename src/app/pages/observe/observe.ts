import { MemberService } from '../../services/member.service';
import { Component, inject, OnInit, computed } from '@angular/core';
import { AppwriteService } from '../../services/appwrite.service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-observe',
  imports: [TuiButton],
  templateUrl: './observe.html',
  styleUrl: './observe.less',
})
export class Observe implements OnInit {
  private appWrite = inject(AppwriteService);
  private memberService = inject(MemberService);
  protected members = computed(() => 
    this.memberService.members()?.filter(member => member.userEmail !== this.appWrite.loggedInUser()?.email)
  );

  ngOnInit() {
    this.memberService.getMembers();
  }

}
