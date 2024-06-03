import { csrfFetch } from './csrf';

const LOAD_ALL_SPOTS = "spot/loadAllSpots";

const load = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots
    }
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const list = await response.json();
        dispatch(load(list.Spots));
        return list
    }
};

const initialState = { spots: [] }

const spotReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_ALL_SPOTS:
            return {  ...state, spots: action.spots }
        default:
            return state;
    }
};

export default spotReducer
