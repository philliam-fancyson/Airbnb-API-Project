import { csrfFetch } from './csrf';

const LOAD_REVIEWS = "review/loadReviews";

const loadAll = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
}

// Action Creator and Thunks
export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadAll(reviews.Review));
        return reviews;
    }
}

// Reducer
const initialState = { reviews: [] }

const reviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS:
            return { ...state, reviews: action.reviews}
        default:
            return state;
    }
};

export default reviewReducer
