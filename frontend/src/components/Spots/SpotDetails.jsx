import { useParams } from "react-router-dom";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getASpot } from "../../store/spot";
import { getAllReviews } from "../../store/review";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import './SpotDetails.css'
import { LuDot } from "react-icons/lu";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import DeleteReviewModal from "../Reviews/DeleteReviewModal";

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    const sessionUser = useSelector(state => state.session.user);
    let sessionUserId = -1;
    if (sessionUser) {
        sessionUserId = sessionUser.id
    }
    const spot = useSelector(state => state.spot.spot);
    const reviews = useSelector(state => state.review.reviews)
    const spotOwner = spot.Owner
    const options = { month: 'long', year: 'numeric' };
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    let nonReviewer = true;
    if (reviews) {
        reviews.forEach(review => {
            if (review.User.id === sessionUserId) nonReviewer = false
        })
    }

    const avgStars = reviews.length ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(2): 'No Reviews'
    const numReviews = reviews.length;

    useEffect(() => {
        dispatch(getASpot((spotId)))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(getAllReviews((spotId)))
    }, [dispatch, spotId])

    // !Modal Begins
    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
          if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
          }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);

    const closeMenu = () => setShowMenu(false);
    // !Modal Ends

    const handleClick = () => {
        window.alert("Feature Coming Soon...")
    }

    // TODO: Spot Button
    if (!spot || !reviews || !spot.SpotImages) {
        return <div>Loading...</div>
    }

    return (
        <div id="spot-details">
            <h2>{spot.name}</h2>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            <div id="spot-image-gallery">
                <figure id="preview-image">
                    <img className="gallery-image" src={spot.SpotImages[0] ? spot.SpotImages[0].url : ""} />
                </figure>
                <figure id="image-1">
                    <img className="gallery-image" src={spot.SpotImages[1] ? spot.SpotImages[1].url : ""} />
                </figure>
                <figure id="image-2">
                 <img className="gallery-image" src={spot.SpotImages[2] ? spot.SpotImages[2].url : ""} />
                </figure>
                <figure id="image-3">
                    <img className="gallery-image" src={spot.SpotImages[3] ? spot.SpotImages[3].url : ""} />
                </figure>
                <figure id="image-4">
                    <img className="gallery-image"src={spot.SpotImages[4] ? spot.SpotImages[4].url : ""} />
                </figure>
            </div>
            <div id="spot-description-box">
                <div id ="spot-description">
                    <h3>Hosted by {spotOwner?.firstName} {spotOwner?.lastName}</h3>
                    <p>{spot.description}</p>
                </div>
                <div id="spot-callout-box">
                    <div id="text">
                        <p id="price">${spot.price}</p>
                        <p id="review">{Number(avgStars) ? <><FaStar id="star"/> {avgStars} </>: <><FaStar id="star"/>{"New"}</>} {numReviews !== 0 ? <><LuDot /> {(numReviews === 1 ? numReviews + " review" : numReviews + " reviews")}</> : null} </p>
                    </div>
                    <div id="button">
                        <button onClick={handleClick}>Reserve</button>
                    </div>
                </div>
            </div>
            <div id="spot-reviews">
                <h3>{Number(avgStars) ? <><FaStar /> {avgStars} </>: <><FaStar />{"New"}</>} {numReviews !== 0 ? <><LuDot /> {(numReviews === 1 ? numReviews + " review" : numReviews + " reviews")}</> : null}</h3>
                {numReviews ===0 && spotOwner?.id !== sessionUserId && <h2>Be the first to post a review!</h2>}
                {sessionUser && spotOwner?.id !== sessionUserId && nonReviewer && <OpenModalButton
                                                        buttonText="Post Your Review"
                                                        onButtonClick={closeMenu}
                                                        modalComponent={<CreateReviewModal spotId={spot.id} sessionUser={sessionUser}/>}
                                                        />}
                {reviews ? reviews.map(review => (
                    <div id="review-box" key={review.id}>
                        <h3>{review.User.firstName}</h3>
                        <p>{new Date(review.createdAt).toLocaleDateString("en-us", options)}</p>
                        <p>{review.review}</p>
                            {review.User.id === sessionUserId && <OpenModalButton
                                                                        buttonText="Delete Your Review"
                                                                        onButtonClick={closeMenu}
                                                                        modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spot.id}/>}
                                                                        />}
                    </ div>
                )) : "Be the first to review!"}
            </div>
        </div>
    )
}

export default SpotDetails
