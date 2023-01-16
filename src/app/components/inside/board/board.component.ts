import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  lists: any[] = [];
  boardId: string | null = null;
  editTitle: any = {};
  editCard: any = {};
  boardInfo: any = false;
  titleChanged = false;

  listCards: any = {};
  addUserEmail = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id');
    if (this.boardId) {
      this.boardInfo = (await this.dataService.getBoardInfo(this.boardId)).data;

      this.lists = await this.dataService.getBoardLists(this.boardId);

      // get cards for all lists
      for (let list of this.lists) {
        this.listCards[list.id] = await this.dataService.getListCards(list.id);
      }

      this.handleRealtimeUpdates();
    }
  }

  async saveBoardTitle() {
    await this.dataService.updateBoard(this.boardInfo);
    this.titleChanged = false;
  }

  async deleteBoard() {
    await this.dataService.deleteBoard(this.boardInfo);
    this.router.navigateByUrl('/workspace');
  }

  async addList() {
    const newList = await this.dataService.addBoardList(
      this.boardId!,
      this.lists.length
    );
  }

  editingTitle(list: any, edit = false) {
    this.editTitle[list.id] = edit;
  }

  async updateListTitle(list: any) {
    await this.dataService.updateBoardList(list);
    this.editingTitle(list, false);
  }

  async deleteBoardList(list: any) {
    await this.dataService.deleteBoardList(list);
  }

  async addCard(list: any) {
    await this.dataService.addListCard(
      list.id,
      this.boardId!,
      this.listCards[list.id].length
    );
  }

  editingCard(card: any, edit = false) {
    this.editCard[card.id] = edit;
  }

  async updateCard(card: any) {
    await this.dataService.updateCard(card);
    this.editingCard(card, false);
  }

  async deleteCard(card: any) {
    await this.dataService.deleteCard(card);
  }

  async addUser() {
    await this.dataService.addUserToBoard(this.boardId!, this.addUserEmail);
    this.addUserEmail = '';
  }

  handleRealtimeUpdates() {}

  // cancel editing title on ecs 
  @HostListener('document:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.keyCode === 27) {
      this.titleChanged = false;

      Object.keys(this.editCard).map((item) => {
        this.editCard[item] = false;
        return item;
      });

      Object.keys(this.editTitle).map((item) => {
        this.editTitle[item] = false;
        return item;
      });
    }
  }
}
