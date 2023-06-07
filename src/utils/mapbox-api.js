const BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export async function geocode(address){
  const res = await fetch(`${BASE_URL}/${address}.json?access_token=${ACCESS_TOKEN}`).then(res => res.json())
  return res.features[0].geometry.coordinates
}

export async function reverseGeocode(coordinates){
  const res = await fetch(
    `${BASE_URL}/${coordinates.longitude},${coordinates.latitude}.json?access_token=${ACCESS_TOKEN}`
  ).then(res => res.json())
  return res.features[0].place_name
}