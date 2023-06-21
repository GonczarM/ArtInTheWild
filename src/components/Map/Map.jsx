import { useRef, useState, useEffect, useContext } from 'react';
import { createRoot } from 'react-dom/client'
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import mapboxgl from 'mapbox-gl';

import * as muralsAPI from '../../utils/murals-api'
import { MuralDispatchContext } from '../../utils/contexts';
import Popup from '../Popup/Popup';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map(props){

  const [murals, setMurals] = useState(null)
  const [error, setError] = useState('')
  const map = useRef(null);
  const mapContainer = useRef(null);
  const popupRef = useRef(new mapboxgl.Popup());
  
  const dispatch = useContext(MuralDispatchContext)

  const navigate = useNavigate()

  useEffect(() => {
    if(props.murals && props.murals.length){
      setMurals(props.murals)
    }
  }, [props.murals])

  useEffect(() => {
    if(!murals) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [props.geometry.longitude, props.geometry.latitude],
      zoom: props.geometry.zoom
    });

    map.current.on('load', () => {
      map.current.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png', (error, image) => {
        if (error) {
          setError('Map error, please try again.')
        }
        map.current.addImage('custom-marker', image);
        map.current.addSource('points', {
          'type': 'geojson',
          'data': {
            'type': 'FeatureCollection',
            'features': murals.map((mural) => ({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [mural.longitude, mural.latitude]
              },
              'properties': {
                'id': mural._id,
                'title': mural.title,
                'artist': mural.artist,
                'image': mural.photos.length ? mural.photos[0].photo : null
              }
            }))
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

    if(props.search){
      map.current.on('click', (e) => {
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ['points']
        });
        if (!features.length) return;
        const feature = features[0]
        const popupNode = document.createElement("div")
        createRoot(popupNode).render(
          <Popup properties={feature.properties} handleClick={handleClick}/>
        )
        popupRef.current
          .setLngLat(feature.geometry.coordinates)
          .setDOMContent(popupNode)
          .addTo(map.current);
      })
    }

    return () => {
      map.current.remove();
    };

  }, [murals])

  const handleClick = async (muralId) => {
    try{
      const mural = await muralsAPI.getMural(muralId)
      dispatch({
        type: 'changed',
        mural: {...mural.mural, updatedBy: 'search'}
      })
      navigate(`/mural/search/${muralId}`)
    }catch{
      setError('Could not get mural, please try again.')
    }
  }

  return (
    <>
      <Container ref={mapContainer} className="map-container" />
      {error && <p>{error}</p>}
    </>
  );
}

export default Map;