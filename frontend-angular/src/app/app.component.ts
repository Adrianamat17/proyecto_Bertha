import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'GameVault';

  constructor(private router: Router) { }

  irAlInicio(): void {
    this.router.navigate(['/lista']);
  }
}
