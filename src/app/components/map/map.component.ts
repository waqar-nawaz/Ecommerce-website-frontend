import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private map!: L.Map;

  // Define multiple locations with latitude, longitude, and title
  locations = [
    { lat: 30.3753, lng: 69.3451, title: "Pakistan" },
    { lat: 20.5937, lng: 78.9629, title: "India" },
    { lat: -25.2744, lng: 133.7751, title: "Australia" },
    { lat: 35.8617, lng: 104.1954, title: "China" },
    { lat: 51.1657, lng: 10.4515, title: "Germany" }
  ];

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.initializeLeaflet();
    }
  }

  // Dynamically load Leaflet library
  private initializeLeaflet(): void {
    import('leaflet').then(L => {
      this.initializeMap(L);
    });
  }

  // Initialize the Leaflet map with Google Maps layer
  private initializeMap(L: any): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 2); // Centered on India

    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: 'Map data &copy; <a href="https://www.google.com/intl/en_ALL/mapfiles/terms.html">Google</a>',
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);

    this.addMarkers(L);
  }

  // Load all markers onto the map
  private addMarkers(L: any): void {
    this.locations.forEach(location => {
      L.marker([location.lat, location.lng]).addTo(this.map)
        .bindPopup(location.title)
        .openPopup();
    });
  }
}
