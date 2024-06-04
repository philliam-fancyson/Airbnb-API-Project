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
        console.log("Debug")
        return null
    }

    return (
        <div className="landing-grid">
            {allSpots.map((spot) =>
                <div key={spot.id} className="spot-grid">
                    <Link
                    to={`/spots/${spot.id}`}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Hello world!"
                    >
                        {/* <Tooltip id="my-tooltip"> */}
                            <img src={spot.previewImage ? spot.previewImage : "placeholder"} />
                        {/* </Tooltip> */}
                    </Link>
                    <div className="in-line">
                        <h2 style={{"text-align": "left", "width": "49%"}}>{spot.city}, {spot.state}</h2>
                        <p style={{"text-align": "right", "width": "49%"}}>{spot.avgRating ?<> <FaStar />{(spot.avgRating ? spot.avgRating.toFixed(1) : null)} </>: <><FaStar /> New</>}</p>
                        <p>TEST TEST TEST</p>
                    </div>
                    <p>{`$${spot.price} night`}</p>
                </div>
            )}
        </div>
    )
}

export default LandingPage
