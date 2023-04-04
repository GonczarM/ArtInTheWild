import { useNavigate } from 'react-router-dom';

const Murals = ({murals, setMural}) => {

	const navigate = useNavigate()

	const handleClick = (mural) => {
		setMural(mural)
		navigate('/mural')
	}

	const muralsList = murals.map((mural, i) => 
		<li key={i}>
			<button onClick={() => handleClick(mural)}>{mural.title || mural.artwork_title}</button><br/>
		</li>
	);

	return(
		<ul>
			{muralsList}
		</ul>
	);
};

export default Murals;