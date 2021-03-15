import React from 'react';
import { MapContainer as LeafletMap, TileLayer } from 'react-leaflet';
import './Map.css'
import { showDataOnMap } from './util';

const Map = ({countries, casesType, center, zoom}) => {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom} scrollWhellZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Loop through countries and draw circles on the screen */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}; 

export default Map;
