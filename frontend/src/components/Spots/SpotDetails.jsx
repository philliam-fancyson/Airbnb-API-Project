import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getASpot } from "../../store/spot";
import { useEffect } from "react";

function SpotDetails () {
    const dispatch = useDispatch();
    const { spotId } = useParams();
    // const allSpots = useSelector(state => state.spot.spots)
    // const spot = allSpots.find(spot => spot.id === parseInt(spotId))
    const spot = useSelector(state => state.spot.spot)
    console.log(spot)
    const spotOwner = spot.Owner
    console.log(spotOwner)

    useEffect(() => {
        dispatch(getASpot(spotId))
    }, [spotId])

    // TODO: CSS for image gallery
    // TODO: Spot Button
    return (
        <div>
            <h2>{spot.name}</h2>
            <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            <div className="spot-image-gallery">
                <img src={spot.previewImage ? spot.previewImage : "placeholder"} />
            </div>
            <h3>Hosted by </h3>
            <div className="spot-box">
                <p>${spot.price}</p>
                <p>{spot.avgStarRating ? spot.avgStarRating.toFixed(2) : 4.45}</p>
                <button>Reserve</button>
            </div>
        </div>
    )
}

export default SpotDetails
