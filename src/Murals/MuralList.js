import React from 'react';

const Murals = (props) => {
	const muralsList = props.murals.map((mural, i) => 
		<li key={mural._id}>
			{i+1}.<h2>{mural.title}</h2><br/>
			<h4>{mural.artist}</h4><br/>
			<span>{mural.address} </span>
			<span>{mural.zipcode}</span><br/>
			<h4>{mural.locationDescription}</h4><br/>
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