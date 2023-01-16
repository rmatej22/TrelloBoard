import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export const BOARDS_TABLE = 'boards';
export const USER_BOARDS_TABLE = 'user_boards';
export const LISTS_TABLE = 'lists';
export const CARDS_TABLE = 'cards';
export const USERS_TABLE = 'users';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseUrl
    );
  }

  async startBoard() {
    return this.supabase.from(BOARDS_TABLE).insert({});
  }

  async getBoards() {
    const boards = await this.supabase.from(USER_BOARDS_TABLE).select('*');
    return boards.data || [];
  }
}
