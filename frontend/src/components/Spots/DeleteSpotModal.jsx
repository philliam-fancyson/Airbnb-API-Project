import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { removeASpot } from '../../store/spot';
import './DeleteSpotModal.css'

function DeleteSpotModal({spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const onClick = () => {
        return dispatch(removeASpot(spotId))
            .then(closeModal)
    };

    return (
        <div id="delete-spot">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={onClick}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </ div>
    )
}

export default DeleteSpotModal;
