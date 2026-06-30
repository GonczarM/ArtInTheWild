'use client';

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Container} from "react-bootstrap";

import { MuralDispatchContext } from "../../utils/contexts";
import MuralListItem from "../MuralListItem/MuralListItem";

const MuralsList = ({ murals, updatedBy }) => {

	const dispatch = useContext(MuralDispatchContext)

	const router = useRouter()

	const handleClick = (mural) => {
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy}
    })
		router.push(`/mural/${updatedBy}/${mural._id}`)
	}

	return(
		<Container>
			<Row xs={1} lg={2}>
				{murals && murals.map((mural, i) => (
					<Col onClick={() => handleClick(mural)} key={i} >
						<MuralListItem mural={mural} />
					</Col>
				))}
			</Row>
		</Container>
  )
};

export default MuralsList;
