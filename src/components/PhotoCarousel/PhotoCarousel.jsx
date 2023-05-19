import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { getMuralsWithPhoto } from '../../utils/murals-api';
import Logo from '../../assets/artInTheWild.jpg'

function PhotoCarousel() {
  const [murals, setMurals] = useState(null)

  useEffect(() => {
    getMurals()
  }, [])

  const getMurals = async () => {
    const muralsResponse = await getMuralsWithPhoto()
    const muralsWithLogo = [...muralsResponse.murals]
    muralsWithLogo.unshift({photos:[{photo:Logo}]})
    setMurals(muralsWithLogo)
  }

  return (
    <Carousel>
      {murals && murals.map((mural, i) => (
      <Carousel.Item key={i}>
        <img src={mural.photos[0].photo} />
        <Carousel.Caption>
          <h3>{mural.title}</h3>
          <p>{mural.artist}</p>
        </Carousel.Caption>
      </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PhotoCarousel;