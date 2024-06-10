import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { removeReview } from '../../store/review';
import { getAllReviews } from "../../store/review";
import './DeleteReviewModal.css';

function DeleteReviewModal({reviewId, spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onClick = () => {
        return dispatch(removeReview(reviewId))
            .then(dispatch(getAllReviews(spotId)))
            .then(closeModal)
    };

    return (
        <div id="delete-review">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <button onClick={onClick}>Yes (Delete Review)</button>
            <button onClick={closeModal}>No (Keep Review)</button>
        </ div>
    )
}

export default DeleteReviewModal
