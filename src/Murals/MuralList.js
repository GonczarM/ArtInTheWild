import React from 'react';

const Murals = (props) => {
	const muralsList = props.murals.map((mural, i) => 
		<li key={i}>
			<h2>{mural.artwork_title}</h2><br/>
		</li>
	);

	return(
		<ul>
			{muralsList}
		</ul>
	);
};

export default Murals;