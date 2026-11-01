import L from 'leaflet';
import { CollectionRequest } from '../types';

export interface MapMarkerOptions {
  onClick?: (req: CollectionRequest) => void;
}

export class EcoMap {
  private map: any = null;
  private markersLayer: any = null;
  private routeLine: any = null;
  private userLocationMarker: any = null;

  init(
    containerId: string,
    initialLat = 24.7136,
    initialLng = 46.6753,
    zoom = 12,
    onMapClick?: (lat: number, lng: number) => void
  ): boolean {
    const container = document.getElementById(containerId);
    if (!container) return false;

    // Clean up if already exists on element
    if (this.map) {
      try {
        this.map.remove();
      } catch (e) {
        console.warn('Map cleanup error:', e);
      }
      this.map = null;
    }

    try {
      this.map = L.map(containerId, {
        center: [initialLat, initialLng],
        zoom,
        zoomControl: true,
      });

      // Free OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(this.map);

      this.markersLayer = L.layerGroup().addTo(this.map);

      if (onMapClick) {
        this.map.on('click', (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }

      // Invalidate size after DOM settles
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 250);

      return true;
    } catch (err) {
      console.warn('Leaflet map initialization warning:', err);
      return false;
    }
  }

  renderRequests(requests: CollectionRequest[], options?: MapMarkerOptions) {
    if (!this.map || !this.markersLayer) return;

    this.markersLayer.clearLayers();

    requests.forEach((req) => {
      if (!req.latitude || !req.longitude) return;

      const isCompany = req.customerType === 'company';
      // Prompt Rule: Yellow marker for Citizen, Blue marker for Company
      const markerColor = isCompany ? '#3288D8' : '#F9D342';
      const markerBorder = isCompany ? '#1E40AF' : '#D97706';
      const iconLetter = isCompany ? '🏢' : '👤';

      const customHtmlIcon = L.divIcon({
        className: 'eco-map-marker',
        html: `
          <div style="
            background: ${markerColor};
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            border: 2px solid ${markerBorder};
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 18px;
              line-height: 1;
            ">${iconLetter}</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([req.latitude, req.longitude], { icon: customHtmlIcon });

      const totalKg = req.totalEstimatedWeight;
      const statusLabel = req.status;

      const popupContent = document.createElement('div');
      popupContent.style.fontFamily = 'Cairo, sans-serif';
      popupContent.style.minWidth = '200px';
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px;">
          <strong style="color: ${isCompany ? '#1E40AF' : '#B45309'}; font-size: 15px;">
            ${req.requestNumber} • ${isCompany ? 'منشأة تجارية' : 'مواطن'}
          </strong>
          <span style="background: #E2E8F0; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: bold;">
            ${statusLabel}
          </span>
        </div>
        <p style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #1E293B;">
          ${req.customerName}
        </p>
        <p style="margin: 0 0 6px; font-size: 12px; color: #64748B;">
          📍 ${req.address}
        </p>
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; font-size: 12px;">
          ⚖️ الوزن التقديري: <strong>${totalKg} كجم</strong>
        </div>
        <button id="btn-popup-${req.id}" style="
          width: 100%;
          background: #43B96B;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: bold;
          font-size: 13px;
          cursor: pointer;
        ">
          عرض تفاصيل الطلب
        </button>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${req.id}`);
        if (btn) {
          btn.onclick = () => {
            options?.onClick?.(req);
            marker.closePopup();
          };
        }
      });

      this.markersLayer?.addLayer(marker);
    });
  }

  setUserLocation(lat: number, lng: number, label = 'موقعك الحالي') {
    if (!this.map) return;

    if (this.userLocationMarker) {
      this.userLocationMarker.remove();
    }

    const workerIcon = L.divIcon({
      className: 'eco-worker-marker',
      html: `
        <div style="
          background: #43B96B;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 4px rgba(67, 185, 107, 0.4), 0 4px 10px rgba(0,0,0,0.3);
          font-size: 20px;
        ">
          🚛
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });

    this.userLocationMarker = L.marker([lat, lng], { icon: workerIcon })
      .addTo(this.map)
      .bindPopup(`<strong>${label}</strong>`);

    this.map.setView([lat, lng], 13);
  }

  showRoute(fromLat: number, fromLng: number, toLat: number, toLng: number) {
    if (!this.map) return;

    if (this.routeLine) {
      this.routeLine.remove();
    }

    // Midpoint curved route simulation
    const midLat = (fromLat + toLat) / 2 + 0.005;
    const midLng = (fromLng + toLng) / 2 - 0.005;

    this.routeLine = L.polyline(
      [
        [fromLat, fromLng],
        [midLat, midLng],
        [toLat, toLng],
      ],
      {
        color: '#3288D8',
        weight: 6,
        opacity: 0.85,
        dashArray: '8, 8',
      }
    ).addTo(this.map);

    this.map.fitBounds([
      [fromLat, fromLng],
      [toLat, toLng],
    ], { padding: [50, 50] });
  }

  clearRoute() {
    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }
  }

  invalidate() {
    this.map?.invalidateSize();
  }
}
