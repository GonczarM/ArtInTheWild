import { useNavigate } from 'react-router-dom'
import * as muralsAPI from '../../utils/murals-api'

function ShowMural({ mural }){

	const navigate = useNavigate()

  const handleDelete = async () => {
    muralsAPI.deleteMural(mural._id)
    navigate('/')
  }

  const handleEdit = () => {
		navigate('/editMural')
  }
  
	return(
		<div>
			<h2>Title: {mural.title || mural.artwork_title}</h2><br/>
			<h3>Artist: {mural.artist || mural.artist_credit}</h3><br/>
			<span>Description: {mural.description || mural.description_of_artwork}</span><br/>
			<span>Year Installed: {mural.year || mural.year_installed}</span><br/>
			<span>Affiliation: {mural.affiliated_or_commissioning}</span><br/>
			<span>Address: {mural.street_address}</span><br/>
			<button onClick={handleEdit}>Edit Mural</button>
			<button onClick={handleDelete}>Delete Mural</button>
		</div>
	)
}

export default ShowMural;