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

const add = (review, user) => {
    return {
        type: ADD_REVIEW,
        review,
        user
    }
};

const remove = (review, reviewId) => {
    return {
        type: REMOVE_REVIEW,
        review,
        reviewId
    }
}

// Action Creator and Thunks
export const getAllReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        dispatch(loadAll(reviews.Reviews));
        return reviews;
    }
};

export const addReview = (data, spotId, sessionUser) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(add(review, sessionUser));
        return true
    } else {
        const errors = await response.json();
        console.log("ERROR ", errors)
        return errors
    }
};

export const removeReview = (reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(remove(review, reviewId))
        return review
    }
}

// Reducer
const initialState = { reviews: [] }

const sortDate = (list) => {
    return list.sort((reviewA, reviewB) => {
        console.log(reviewA)
        return new Date(reviewB.createdAt) - new Date(reviewA.createdAt)
    }).map((review) => review)
};

const reviewReducer = (state = initialState, action) => {
    let newState;
    let allCurrentReviews = {};
    let updatedReviews;
    switch(action.type) {
        case LOAD_REVIEWS:
            if (!action.reviews) {
                newState = {...state, reviews: []}
                return newState
            }

            sortDate(action.reviews);

            action.reviews.forEach(review => {
                allCurrentReviews[review.id] = review
            });
            newState = {
                ...allCurrentReviews,
                ...state,
                reviews: action.reviews
            }

            return newState
        case ADD_REVIEW:
            action.review.User = action.user
            updatedReviews = [...state.reviews, action.review]

            newState = {
                ...state,
                [action.review.id]: action.review,
                reviews: sortDate(updatedReviews)
            };

            return newState;
        case REMOVE_REVIEW:
            newState = {...state, reviews: state.reviews.filter(review => review.id !== action.reviewId)}
            delete newState[action.reviewId]
            return newState
        default:
            return state;
    }
};

export default reviewReducer
