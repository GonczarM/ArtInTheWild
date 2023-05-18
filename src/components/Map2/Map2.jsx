import mapboxgl from 'mapbox-gl';
import { useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map2({ mural }){

  const map = useRef(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mural.longitude, mural.latitude],
      zoom: 14
    });

    map.current.on('load', () => {
      map.current.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
        if (error) throw error;
        map.current.addImage('custom-marker', image);
        map.current.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': [{
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [mural.longitude, mural.latitude]
              },
              'properties': {
                'title': mural.title,
              }
            }]
          }
        });
        map.current.addLayer({
          'id': 'points',
          'type': 'symbol',
          'source': 'points',
          'layout': {
            'icon-image': 'custom-marker',
            'text-field': ['get', 'title'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-offset': [0, 1.25],
            'text-anchor': 'top'
          }
        });
      });
    });

    return () => {
      map.current.remove();
    };

  }, [])

  return (
    <Container>
      <div ref={mapContainer} className="map-container" />
    </Container>
  );
}

export default Map2;