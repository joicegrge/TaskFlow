import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from './layout/top-bar.component';
@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet, TopBarComponent], templateUrl: './app.html', styleUrl: './app.scss' })
export class App {}
