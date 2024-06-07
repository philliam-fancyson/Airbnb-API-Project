import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import StarRatingInput from './StarRatingInput';
import { addReview } from '../../store/review';
import { getAllReviews } from '../../store/review';

function CreateReviewModal({spotId, sessionUser}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0);
    const [validationErrors, setValidationError] = useState({})
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const errors = {};
        if (stars === 0 ) errors.star = "Please enter an input";
        if (review.length < 10) errors.review = "Less than 10 characters"

        setValidationError(errors);
    }, [stars, review])

    const handleSubmit = (e) => {
        e.preventDefault();
        const newReview = { review, stars}
        setErrors({})
        return dispatch(addReview(newReview, spotId, sessionUser))
            .then(dispatch(getAllReviews(spotId)))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors)
                }
            })
    };


  const onChange = (number) => {
    setStars(parseInt(number));
    console.log(stars)
    console.log(review)
  };

    return (
        <form onSubmit={(handleSubmit)}>
            <h1>How was your stay?</h1>
            {errors.message && (
                <p>{errors.message}</p>
            )}
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

            <button
            type="submit"
            disabled={Object.keys(validationErrors).length}
            >Submit Your Review</button>
        </form>
    )
}

export default CreateReviewModal;
