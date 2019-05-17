import React from 'react';

class CreateMural extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			murals: [],
			mural: {
				title: '',
				artist: '',
				image: '',
				description: '',
				locationDescription: '',
				year: '',
				affiliation: '',
				address: '',
				zipcode: '',
				lat: '',
				lng: ''
			}
		}
	}

	updateMural = (event) => {
		this.setState({
			mural: {
				...this.state.mural,
				[event.currentTarget.name]: event.currentTarget.value
			}
		})
	}

	addMural = async (mural, event) => {
    event.preventDefault()
    try{
      const createdMural = await 
      fetch(process.env.REACT_APP_BACKEND_URL + '/murals', {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(mural),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      if(createdMural.status !== 200){
        throw Error(createdMural.statusText)
      }
      const parsedResponse = await createdMural.json()
      this.setState({
        murals: [...this.state.murals, parsedResponse.mural]
      })
      this.props.history.push('/murals/home');
    }
    catch(error){
      console.log(error);
      return error
    }
  }

  // onChange = async (e) => {
  //   console.log(e.target);
  //   console.log(e.target.files);
  //   const files = e.target.files
  //   console.log(files);
  //   const formData = new FormData()
  //   formData.append("file", files[0])
  //   const createImage = await 
  //   fetch(process.env.REACT_APP_BACKEND_URL + '/murals/image-upload', {
  //     method: 'POST',
  //     credentials: 'include',
  //     body: formData
  //   })
  //   const parsedResponse = await createImage.json()
  //   console.log(parsedResponse);
  //   this.setState({ 
  //     images: [...this.state.images, parsedResponse[0]]
  //   })
  // }

	render(){
		return(
			<div>
				<h4>Create Mural</h4>
				<form className="form" onSubmit={this.addMural.bind(null, this.state.mural)}>
					<label>
						Title:
						<input 
							type="text" 
							name="title"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Artist:
						<input
							type="text"
							name="artist"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Image:
						<input
							type="file"
							name="image"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Description:
						<input
							type="text"
							name="description"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Location Description:
						<input
							type="text"
							name="locationDescription"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Year Installed:
						<input
							type="number"
							name="year"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Affiliation/Commisioner:
						<input
							type="text"
							name="affiliation"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Address:
						<input
							type="text"
							name="address"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Zipcode:
						<input
							type="number"
							name="zipcode"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Latitude:
						<input
							type="number"
							name="lat"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<label>
						Longitude:
						<input
							type="number"
							name="lng"
							onChange={this.updateMural}
						/>
					</label>
					<br/>
					<button>Create Mural</button>
				</form>
			</div>
		)
	}
}

export default CreateMural;