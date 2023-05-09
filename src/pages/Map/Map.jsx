import mapboxgl from 'mapbox-gl';
import { useRef, useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import * as muralsAPI from '../../utils/murals-api'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
console.log(import.meta.env.VITE_MAPBOX_TOKEN)
function Map(){

  const [murals, setMurals] = useState(null)
  const [lng, setLng] = useState(-87.64);
  const [lat, setLat] = useState(41.88);
  const map = useRef(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    getMurals()
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 11.5
    });
    if (!map.current) return;
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
    });
  }, []);

  useEffect(() => {
    if(!murals) return
    map.current.on('load', () => {
      map.current.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.current.addImage('custom-marker', image);
          map.current.addSource('points', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': murals
            }
          });
          map.current.addLayer({
            'id': 'points',
            'type': 'symbol',
            'source': 'points',
            'layout': {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'title'],
              'text-font': [
                'Open Sans Semibold',
                'Arial Unicode MS Bold'
              ],
              'text-offset': [0, 1.25],
              'text-anchor': 'top'
            }
          });
        }
      );
    });
  })

  const getMurals = async () => {
    const muralsRes = await muralsAPI.getMurals()
    const filteredMurals = muralsRes.murals.filter(mural => mural.latitude)
    const mapMurals = filteredMurals.map(mural => {
      if(mural.latitude && mural.longitude && mural.title){
        const muralObj = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [mural.longitude, mural.latitude]
          },
          'properties': {
            'title': mural.title
          }
        }
        return muralObj
      }
    })
    setMurals(mapMurals)
  }

  return (
    <Container>
      <div className="sidebar text-center">
        Longitude: {lng} <br></br> Latitude: {lat}
      </div>
      <div ref={mapContainer} className="map-container" />
    </Container>
  );
}

export default Map;