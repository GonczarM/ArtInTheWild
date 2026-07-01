'use client';

import { Fragment, useContext } from "react";
import { useRouter } from "next/navigation";
import { Row, Col, Container, Pagination } from "react-bootstrap";

import { MuralDispatchContext } from "../../utils/contexts";
import MuralListItem from "../MuralListItem/MuralListItem";

// Keeps the pager to a handful of buttons regardless of pageCount: always
// shows the first/last page plus a window around the current page, with
// ellipses filling the gaps.
function getPageNumbers(page, pageCount) {
	const pages = new Set([1, pageCount, page, page - 1, page + 1])
	return [...pages]
		.filter(pageNumber => pageNumber >= 1 && pageNumber <= pageCount)
		.sort((a, b) => a - b)
}

const MuralsList = ({ murals, updatedBy, page, pageCount, onPageChange }) => {

	const dispatch = useContext(MuralDispatchContext)

	const router = useRouter()

	const handleClick = (mural) => {
		dispatch({
      type: 'changed',
      mural: {...mural, updatedBy}
    })
		router.push(`/mural/${updatedBy}/${mural.documentId}`)
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
			{pageCount > 1 && <Pagination className='justify-content-center'>
				<Pagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)} />
				{getPageNumbers(page, pageCount).map((pageNumber, i, pageNumbers) => (
					<Fragment key={pageNumber}>
						{i > 0 && pageNumber - pageNumbers[i - 1] > 1 && <Pagination.Ellipsis disabled />}
						<Pagination.Item
							active={pageNumber === page}
							onClick={() => onPageChange(pageNumber)}
						>
							{pageNumber}
						</Pagination.Item>
					</Fragment>
				))}
				<Pagination.Next disabled={page === pageCount} onClick={() => onPageChange(page + 1)} />
			</Pagination>}
		</Container>
  )
};

export default MuralsList;
