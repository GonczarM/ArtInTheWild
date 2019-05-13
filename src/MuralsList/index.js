import React from 'react';

const Murals = (props) => {
	const muralsList = props.murals.map(mural => {
		return(
			<li key={mural._id}>
				Title: <span>{mural.title}</span><br/>
				Artist: <span>{mural.artist}</span><br/>
				Location: <span>{mural.locationDescription}</span><br/>
				Address: <span>{mural.address}</span><br/>
				zipcode: <span>{mural.zipcode}</span><br/>
				<button onClick={props.deleteMural.bind(null, mural._id)}>Delete</button>
			</li>
		);
	});

	return(
		<ul>
			{muralsList}
		</ul>
	);
};

export default Murals;