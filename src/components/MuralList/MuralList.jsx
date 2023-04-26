import { Container, Row} from "react-bootstrap";
import MuralListItem from "../MuralListItem/MuralListItem";

const MuralsList = ({murals, updateMural, muralArtist, updatedBy}) => {

	return(
		<Container>
      {muralArtist && <h1 className='text-center'>{muralArtist}'s murals</h1>}
			<Row xs={1} lg={2}>
				{murals && murals.map((mural, i) => (
					<MuralListItem key={i} mural={mural} updateMural={updateMural} updatedBy={updatedBy}/>
				))}
			</Row>
		</Container>
  )
};

export default MuralsList;