import { Component } from '@angular/core';
import { LoaderComponent } from '../../loader/loader.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AboutComponent } from '../productlist/about.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoaderComponent, CardsComponent, ModalComponent, AboutComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
