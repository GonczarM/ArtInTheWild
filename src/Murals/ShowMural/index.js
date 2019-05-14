import React from 'react'
import { Link } from 'react-router-dom'

const ShowMural = (props) => {
	return(
		<div>
			<form>
				<label>Title:
					<input value={props.mural.title}/><br/>
				</label>
			</form>	
		</div>		
	);
};

export default ShowMural;