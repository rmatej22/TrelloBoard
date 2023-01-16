import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private dataService: DataService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.boards = await this.dataService.getBoards();
  }

  async startBoard() {
    const data = await this.dataService.startBoard();
    this.boards = await this.dataService.getBoards();

    if (this.boards.length > 0) {
      const newBoard = this.boards.pop();

      if (newBoard.boards) {
        this.router.navigateByUrl(`/workspace/${newBoard.boards.id}`);
      }
    }
  }

  signOut() {
    this.authService.logout();
  }
}
