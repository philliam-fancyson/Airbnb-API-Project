import { csrfFetch } from './csrf';

const LOAD_ALL_SPOTS = "spot/loadAllSpots";
const LOAD_ONE_SPOT = "spot/loadOneSpot"

const loadAll = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots
    }
};

const loadOne = (spot) => {
    return {
        type: LOAD_ONE_SPOT,
        spot
    }
}

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadAll(list.Spots));
        return list
    }
};

export const getASpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOne(spot));
        return spot
    }
}

const initialState = { spots: [], spot: {}}

const spotReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_ALL_SPOTS:
            return {  ...state, spots: action.spots }
        case LOAD_ONE_SPOT:
            return { ...state, spot: action.spot }
        default:
            return state;
    }
};

export default spotReducer
