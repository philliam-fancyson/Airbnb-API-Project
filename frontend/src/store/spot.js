import { csrfFetch } from './csrf';

const LOAD_ALL_SPOTS = "spot/loadAllSpots";

const load = (list) => {
    return {
        type: LOAD_ALL_SPOTS,
        list
    }
}

export const getAllSpots = () => async dispatch => {
    const response = await fetch(`/api/spots`);

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list));
    }
};

const initialState = { spot:null }

const spotReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_ALL_SPOTS:
            const allSpots = {};
            action.list.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return {
                ...state,
                list: allSpots
            }
        default:
            return state;
    }
};

export default spotReducer
