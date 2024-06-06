import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { addReview } from '../../store/review';

function CreateReviewModal({spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] =

    const onClick = () => {
        return dispatch(addReview())
    }
}
