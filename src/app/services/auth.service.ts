import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  private _currentUser: BehaviorSubject<boolean | User | any> =
    new BehaviorSubject(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('event --> ', event);
      console.log('session --> ', session);

      if (event === 'SIGNED_IN') {
        this._currentUser.next(session?.user);
      } else {
        this._currentUser.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      }
    });

    this.loadUser();
  }

  async loadUser() {
    if (this._currentUser.value) {
      // user is set, so no need for further actions
      return;
    }

    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      this._currentUser.next(user.data.user);
    } else {
      this._currentUser.next(false);
    }
  }

  signInWithEmail(email: string) {
    return this.supabase.auth.signInWithOtp({
      email,
    });
  }

  logout() {
    this.supabase.auth.signOut();
  }

  get currentUser() {
    return this._currentUser.asObservable();
  }
}
