import { useContext } from "react";
import { Row, Col} from "react-bootstrap";
import { MuralDispatchContext } from "../../utils/contexts";
import MuralListItem from "../MuralListItem/MuralListItem";
import { useNavigate } from "react-router-dom";

const MuralsList = ({ murals, updatedBy }) => {

	const dispatch = useContext(MuralDispatchContext)

	const navigate = useNavigate()

	const handleClick = (mural) => {
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy}
    })
		navigate(`/mural/${updatedBy}/${mural._id}`)
	}

	return(
		<Row xs={1} lg={2}>
			{murals && murals.map((mural, i) => (
				<Col onClick={() => handleClick(mural)} key={i} >
					<MuralListItem mural={mural} />
				</Col>
			))}
		</Row>
  )
};

export default MuralsList;