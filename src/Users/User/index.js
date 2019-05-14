import React from 'react';

const User = (props) => {
	const UserMurals = props.murals.map(mural => {
		return(
			<li key={mural._id}>
				Title: <span>{mural.title}</span><br/>
				Artist: <span>{mural.artist}</span><br/>
				Location: <span>{mural.locationDescription}</span><br/>
				Address: <span>{mural.address}</span><br/>
				zipcode: <span>{mural.zipcode}</span><br/>
			</li>
		)
	})
	return(
		<ul>
			{UserMurals}
		</ul>
	)
}

export default User;