import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import StarRatingInput from './StarRatingInput';
import { addReview } from '../../store/review';
import { getAllReviews } from '../../store/review';

function CreateReviewModal({spotId}) {
    const [stars, setStars] = useState(0);
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newReview = { review, stars}
        return await dispatch(addReview(newReview, spotId))
            .then(dispatch(getAllReviews()))
            .then(closeModal)
    };


  const onChange = (number) => {
    setStars(parseInt(number));
    console.log(stars)
    console.log(review)
  };

    return (
        <form onSubmit={(handleSubmit)}>
            <h1>How was your stay?</h1>
            <textarea
                type="text"
                name="review"
                value={ review }
                placeholder="Just a quick review"
                onChange={(e) => setReview(e.target.value)}
            />
            <StarRatingInput
                onChange={onChange}
                stars={stars}
            />
            <button type="submit">Submit Your Review</button>
        </form>
    )
}

export default CreateReviewModal;
