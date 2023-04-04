const Murals = ({murals, updateMural}) => {

	const muralsList = murals.map((mural, i) => 
		<li key={i}>
			<button onClick={() => updateMural(mural)}>{mural.title || mural.artwork_title}</button><br/>
		</li>
	);

	return(
		<ul>
			{muralsList}
		</ul>
	);
};

export default Murals;