import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { removeASpot } from '../../store/spot';
import { getUserSpots } from '../../store/spot';

function DeleteSpotModal({spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onClick = () => {
        return dispatch(removeASpot(spotId))
            .then(dispatch(getUserSpots()))
            .then(closeModal)
    };

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={onClick}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </>
    )
}

export default DeleteSpotModal;