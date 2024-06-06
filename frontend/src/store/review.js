import { csrfFetch } from './csrf';

const LOAD_REVIEWS = "review/loadReviews";
const ADD_REVIEW = "review/addReview"
const REMOVE_REVIEW = "review/removeReview"

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

const remove = (review) => {
    return {
        type: REMOVE_REVIEW,
        review
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
    } else {
        const errors = await response.json();
        console.log("ERROR ", errors)
        return errors
    };
};

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(remove(review))
        return review
    }
}

// Reducer
const initialState = { reviews: [] }

//! DELETING AND ADDING CAUSES SERVER ERROR
/*
review.js?t=1717673210909:37 Uncaught (in promise)
Response {type: 'basic', url: 'http://localhost:5173/api/spots/undefined/reviews', redirected: false, status: 500, ok: false, …}
*/
const reviewReducer = (state = initialState, action) => {
    let newState;
    switch(action.type) {
        case LOAD_REVIEWS:
            return { ...state, reviews: action.reviews}
        case ADD_REVIEW:
            newState = {...state};
            newState.reviews[action.review.id] = action.review
            return newState;
        case REMOVE_REVIEW:
            newState = {...state}
            return newState
        default:
            return state;
    }
};

export default reviewReducer
