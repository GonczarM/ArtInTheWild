import { ListGroup } from "react-bootstrap";

const Murals = ({murals, updateMural, listHeader}) => {

	const muralsList = murals.map((mural, i) => 
		<ListGroup.Item 
			key={i} 
			onClick={() => updateMural(mural)}
		>
			{mural.title || mural.artwork_title}
		</ListGroup.Item>
	);

	return(
		<>
			<h1 className='text-center'>{listHeader}'s murals</h1>
			<ListGroup>
				{muralsList}
			</ListGroup>
		</>
	);
};

export default Murals;