import React from 'react';

const Murals = (props) => {
	const muralsList = props.murals.map((mural) => 
		<li key={mural._id}>
			Title: <span>{mural.title}</span><br/>
			Artist: <span>{mural.artist}</span><br/>
			Image: <span>{mural.image}</span><br/>
			Location: <span>{mural.locationDescription}</span><br/>
			Address: <span>{mural.address}</span><br/>
			Zipcode: <span>{mural.zipcode}</span><br/>
			<button onClick={props.showMuralModal.bind(null, mural._id)}>Show</button><br/>			
		</li>
	);

	return(
		<ul>
			{muralsList}
		</ul>
	);
};

export default Murals;