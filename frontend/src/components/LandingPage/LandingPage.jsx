import { useEffect } from "react";
import { useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
// import { Tooltip } from 'react-tooltip'

import './LandingPage.css'


function LandingPage() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spot.spots);

    useEffect(() => {
        dispatch(getAllSpots())
    },[dispatch])

    if (!allSpots.length) {
        return null
    }

    return (
        <div className="landing-grid">
            {allSpots.map((spot, index) =>
                <div key={index} className="spot-grid">
                    <Link
                    to={`/spots/${spot.id}`}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Hello world!"
                    >
                        {/* <Tooltip id="my-tooltip"> */}
                            <img src={spot.previewImage ? "https://picsum.photos/250/300" : "placeholder"} />
                        {/* </Tooltip> */}
                    </Link>
                    <div className="in-line">
                        <h2 style={{"textAlign": "left", "width": "49%"}}>{spot.city}, {spot.state}</h2>
                        <p style={{"textAlign": "right", "width": "49%"}}>{spot.avgRating ? <><FaStar />{parseInt(spot.avgRating).toFixed(1)}</>: <><FaStar /> New</>}</p>
                    </div>
                    <p>{`$${spot.price} night`}</p>
                </div>
            )}
        </div>
    )
}

export default LandingPage
