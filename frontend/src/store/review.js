import { csrfFetch } from './csrf';

const LOAD_REVIEWS = "review/loadReviews";
const ADD_REVIEW = "review/addReview"

const loadAll = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        reviews
    }
};

const add = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
};

// Action Creator and Thunks
export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadAll(reviews.Review));
        return reviews;
    }
};

export const addReview = (data, spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(add(review));
        return review
    };
}

// Reducer
const initialState = { reviews: [] }

const reviewReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_REVIEWS:
            return { ...state, reviews: action.reviews}
        case ADD_REVIEW:
            const newState = {...state};
            action.reviews.forEach(review => newState[review.id] = review);
            return newState;
        default:
            return state;
    }
};

export default reviewReducer
