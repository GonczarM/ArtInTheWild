import { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";

const Murals = ({murals, updateMural, muralArtist}) => {

	const muralsList = murals.map((mural, i) => 
		<ListGroup.Item 
			key={i} 
			onClick={() => updateMural(mural)}
		>
			{mural.title}
		</ListGroup.Item>
	);

	return(
		<>
			<h1 className='text-center'>{muralArtist}'s murals</h1>
			<ListGroup>
				{muralsList}
			</ListGroup>
		</>
	);
};

export default Murals;