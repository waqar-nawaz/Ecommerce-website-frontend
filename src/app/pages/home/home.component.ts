import { Component, OnInit } from '@angular/core';
import { LoaderComponent } from '../../loader/loader.component';
import { CardsComponent } from '../../components/cards/cards.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { AboutComponent } from '../productlist/about.component';
import Prodcutdata from '../../../../dummy.json';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoaderComponent,
    CardsComponent,
    ModalComponent,
    AboutComponent,
    SharedModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  data: any[] = [];
  filter: string = '';
  ngOnInit(): void {
    this.data = Prodcutdata;
  }

  deletes(item: any) {
    console.log(item);
  }
  edit(item: any) {
    console.log(item);
  }
}
