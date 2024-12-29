import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map: any;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.loadLeaflet();
    }
  }

  private loadLeaflet(): void {
    import('leaflet').then(L => {
      this.initMap(L);
    });
  }

  private initMap(L: any): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.addMarker(L);
  }

  private addMarker(L: any): void {
    const marker = L.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  }
}