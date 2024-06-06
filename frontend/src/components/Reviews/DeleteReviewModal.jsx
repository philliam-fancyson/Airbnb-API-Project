import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { removeReview } from '../../store/review';
import { getAllReviews } from "../../store/review";

function DeleteReviewModal({reviewId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onClick = () => {
        return dispatch(removeReview(reviewId))
            .then(dispatch(getAllReviews()))
            .then(closeModal)
    };

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={onClick}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </>
    )
}

export default DeleteReviewModal
