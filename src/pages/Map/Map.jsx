import mapboxgl from 'mapbox-gl';
import { useRef, useState, useEffect, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as muralsAPI from '../../utils/murals-api'
import { MuralDispatchContext } from "../../utils/contexts";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map(){

  const [murals, setMurals] = useState(null)
  const [lng, setLng] = useState(-87.64);
  const [lat, setLat] = useState(41.88);
  const map = useRef(null);
  const mapContainer = useRef(null);
  const popupRef = useRef(new mapboxgl.Popup());
  const dispatch = useContext(MuralDispatchContext)

  const navigate = useNavigate()

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
    return () => {
      map.current.remove();
    };
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
    map.current.on('click', (e) => {
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['points']
      });
      if (!features.length) {
        return;
      }
      popupRef.current.setLngLat(features[0].geometry.coordinates)
        .setHTML(
          `<h3>${features[0].properties.title}</h3>
          <p>${features[0].properties.artist}</p>
          <p>${features[0].properties.description}</p>
          <button id=${features[0].properties.id}>Show Mural</button>`)
        .addTo(map.current);
      const popupButton = document.getElementById(features[0].properties.id);
      popupButton.addEventListener('click', handleClick);
    })
  }, [murals])

  const handleClick = (e) => {
    navigate(`/mural/map/${e.target.id}`)
  }

  const getMurals = async () => {
    const muralsRes = await muralsAPI.getMurals()
    const filteredMurals = muralsRes.murals.filter(mural => {
      if(mural.longitude && mural.latitude && mural.title){
        return mural
      }
    })
    const mapMurals = filteredMurals.map(mural => {
      const muralObj = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [mural.longitude, mural.latitude]
        },
        'properties': {
          'id': mural._id,
          'title': mural.title,
          'artist': mural.artist,
          'description': mural.description
        }
      }
      return muralObj
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