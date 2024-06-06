import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getASpot } from "../../store/spot";
import { getAllReviews } from "../../store/review";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import './SpotDetails.css'
import { LuDot } from "react-icons/lu";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    // const allSpots = useSelector(state => state.spot.spots)
    // const spot = allSpots.find(spot => spot.id === parseInt(spotId))
    const spot = useSelector(state => state.spot.spot);
    const reviews = useSelector(state => state.review.reviews)
    const spotOwner = spot.Owner
    const options = { month: 'long', year: 'numeric' };
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();


    useEffect(() => {
        dispatch(getASpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(getAllReviews(spotId))
    }, [dispatch, spotId])

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

    const handleClick = () => {
        window.alert("Feature Coming Soon...")
    }

    // TODO: CSS for image gallery
    // TODO: Spot Button
    if (!spot) return null
    else {
        return (
            <div>
                <h2>{spot.name}</h2>
                <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                <div className="spot-image-gallery">
                    <img src={spot.previewImage ? "https://picsum.photos/250/300" : "https://picsum.photos/250/300"} />
                </div>
                <h3>Hosted by {spotOwner?.firstName} {spotOwner?.lastName}</h3>
                <p>{spot.description}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <div className="spot-callout-box">
                    <h3>${spot.price}</h3>
                    {/* <LuDot /> {spot.numReviews} {spot.numReviews === 1 ? "review" : "reviews"} */}
                    <p>{spot.avgStarRating ? <><FaStar /> {parseInt(spot.avgStarRating).toFixed(2)} </>: <><FaStar />{"New"}</>} {spot.numReviews !== 0 ? <><LuDot /> {(spot.numReviews === 1 ? spot.numReviews + " review" : spot.numReviews + " reviews")}</> : null} </p>
                    <button onClick={handleClick}>Reserve</button>
                </div>
                <div className="spot-reviews">
                    <h3>{spot.avgStarRating ? <><FaStar /> {parseInt(spot.avgStarRating).toFixed(2)} </>: <><FaStar />{"New"}</>} {spot.numReviews !== 0 ? <><LuDot /> {(spot.numReviews === 1 ? spot.numReviews + " review" : spot.numReviews + " reviews")}</> : null}</h3>
                    <OpenModalButton
                        buttonText="Post Your Review"
                        onButtonClick={closeMenu}
                        modalComponent={<CreateReviewModal />}
                        />
                    {reviews ? reviews.map(review => (
                        <div className="review-box" key={review.id}>
                            <h3>{review.User.firstName}</h3>
                            <p>{new Date(review.createdAt).toLocaleDateString("en-us", options)}</p>
                            <p>{review.review} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </ div>
                    )) : "Be the first to review!"}
                </div>
            </div>
        )
    }
}

export default SpotDetails
