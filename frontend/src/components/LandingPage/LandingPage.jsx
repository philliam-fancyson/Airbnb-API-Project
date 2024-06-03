import { useEffect } from "react";
import { useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import { Tooltip } from 'react-tooltip'

import './LandingPage.css'


function LandingPage() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spot.spots);

    useEffect(() => {
        dispatch(getAllSpots())
    },[dispatch])

    return (
        <div className="landing-grid">
            {allSpots.map((spot) =>
                <div key={spot.id}>
                    <Link
                    to={`/spots/${spot.id}`}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Hello world!"
                    >
                        {/* <Tooltip id="my-tooltip"> */}
                            <img src={spot.previewImage ? spot.previewImage : placeholder} />
                        {/* </Tooltip> */}
                    </Link>
                    <h2>{spot.city}, {spot.state}</h2>
                    <p>{spot.avgRating ? spot.avgRating : "Star Placeholder"}</p>
                    <p>{`$${spot.price} night`}</p>
                </div>
            )}
        </div>
    )
}

export default LandingPage
