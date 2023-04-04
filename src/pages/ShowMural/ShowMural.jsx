import { useNavigate } from 'react-router-dom'

function ShowMural({ mural }){

	const navigate = useNavigate()

  const handleDelete = async () => {
    try{
      const deleteMural = await 
      fetch(import.meta.env.VITE_BACKEND_URL + '/murals/mural/' + mural._id, {
        credentials: 'include',
        method: 'DELETE'
      })
      if(deleteMural.status !== 200){
        throw Error(deleteMural.statusText)
      }
      navigate('/')
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  const handleEdit = () => {
		navigate('/editMural')
  }

	console.log(mural)
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