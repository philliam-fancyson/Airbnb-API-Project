import { csrfFetch } from './csrf';

const LOAD_ALL_SPOTS = "spot/loadAllSpots";
const LOAD_ONE_SPOT = "spot/loadOneSpot";
const ADD_SPOT = "spot/addSpot";
const ADD_IMAGE_SPOT = "spot/addSpotImage"
const UPDATE_SPOT = "spot/updateSpot"
const REMOVE_SPOT = "spot/removeSpot"

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

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    }
}

const addSpotImage = (spotImage) => {
    return {
        type: ADD_IMAGE_SPOT,
        spotImage
    }
};

const updateASpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        spot
    }
}

const removeSpot = (spot) => {
    return {
        type: REMOVE_SPOT,
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

export const getUserSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`);

    if (response.ok) {
        const list = await response.json();
        dispatch(loadAll(list.Spots));
        return list
    }
};

export const getASpot = (data) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${data}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOne(spot));
        return spot
    }
};

export const addASpot = (data) => async dispatch => {
    const response = await csrfFetch(`/api/spots/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(addSpot(newSpot));
        return newSpot
    }
};

export const addImageToSpot = (data) => async dispatch => {
    const { url, preview, spotId } = data;

    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url,
            preview,
        })
    });

    if (response.ok) {
        const newImage = await response.json();
        dispatch(addSpotImage(newImage));
        return newImage
    }
};

export const updateSpot = (data, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(updateASpot(spot));
        return spot
    }
};

export const removeASpot = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const spot = await response.json();
        dispatch(removeSpot(spot))
        // Action returns {message: "Successfully Deleted"} in reducer
        return spot
    }
};

const initialState = { spots: [], spot: {}}

const spotReducer = (state = initialState, action) => {
    let newState = {};
    switch(action.type) {
        case LOAD_ALL_SPOTS:
            return {  ...state, spots: action.spots }
        case LOAD_ONE_SPOT:
            return { ...state, spot: action.spot }
        case ADD_SPOT:
            console.log(state)
            newState = {
                ...state,
                spots: state.spots.map(spot => {
                    if (spot.id !== action.spot.id) return spot
                    return {...spot}
                    })
                }
            // ! This shows empty states like emptyx26 27 is the spot.. might need to look into this
            return newState
        case REMOVE_SPOT:
            newState = {...state}
            return newState
        case UPDATE_SPOT:
            newState = {...state}
            newState.spots[action.spot.id] = action.spot
            return newState
        default:
            return state;
    }
};

export default spotReducer
