import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Sửa lỗi icon marker mặc định không hiện trong Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [10.7769, 106.7009]; // TP.HCM

function LocationMarker({ position, onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);
  return null;
}

function AddressMapPicker({ onAddressSelect }) {
  const [position, setPosition] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await res.json();
      const address = data.display_name || `${lat}, ${lng}`;
      onAddressSelect(address, lat, lng);
    } catch (err) {
      onAddressSelect(`${lat}, ${lng}`, lat, lng);
    }
  };

  const handleMapClick = (lat, lng) => {
    setPosition([lat, lng]);
    reverseGeocode(lat, lng);
  };

 const handleSearch = async (e) => {
  if (e && e.preventDefault) e.preventDefault();
  if (!searchText.trim()) return;

    setSearching(true);
    setSearchError('');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}&countrycodes=vn&limit=1`
      );
      const data = await res.json();

      if (data.length === 0) {
        setSearchError('Không tìm thấy địa chỉ này.');
        setSearching(false);
        return;
      }

      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lon);
      setPosition([latNum, lngNum]);
      onAddressSelect(display_name, latNum, lngNum);
    } catch (err) {
      setSearchError('Tìm kiếm thất bại. Vui lòng thử lại.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="map-picker">
     <div className="map-search-form">
  <input
    type="text"
    placeholder="Tìm địa chỉ (VD: 123 Nguyễn Huệ, Quận 1)"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch(e);
      }
    }}
    className="auth-input"
  />
  <button type="button" onClick={handleSearch} className="map-search-btn" disabled={searching}>
    {searching ? 'Đang tìm...' : 'Tìm'}
  </button>
</div>

      {searchError && <p className="field-hint-error">{searchError}</p>}

      <div className="map-container-wrapper">
        <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '300px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker position={position} onSelect={handleMapClick} />
          <MapFlyTo position={position} />
        </MapContainer>
      </div>

      <p className="map-hint">📍 Bấm vào bản đồ để chọn vị trí chính xác, hoặc tìm kiếm ở ô trên</p>
    </div>
  );
}

export default AddressMapPicker;