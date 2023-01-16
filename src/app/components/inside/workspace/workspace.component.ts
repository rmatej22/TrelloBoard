import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
  boards: any[] = [];
  user = this.authService.currentUser;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  async ngOnInit() {
    this.boards = await this.dataService.getBoards();
  }

  async startBoard() {
    const data = await this.dataService.startBoard();
  }

  signOut() {
    this.authService.logout();
  }
}
