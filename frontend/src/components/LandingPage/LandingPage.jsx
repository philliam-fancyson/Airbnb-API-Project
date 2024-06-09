import { useEffect } from "react";
import { useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import './LandingPage.css'


function LandingPage() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spot.spots);

    useEffect(() => {
        dispatch(getAllSpots())
    },[dispatch])

    if (!allSpots) {
        return <h2>Loading</h2>
    }

    return (
        <div className="landing-grid">
            {allSpots.map((spot, index) =>

                <Link
                    to={`/spots/${spot.id}`}
                    key={index}
                    title={spot.name}
                    >
                    <div className="spot-grid">
                            <img src={spot.previewImage}/>
                        <div className="in-line">
                            <p>{spot.city}, {spot.state}</p>
                            <p>{spot.avgRating ? <><FaStar />{Number(spot.avgRating).toFixed(2)}</>: <><FaStar /> New</>}</p>
                        </div>
                        <p>{`$${spot.price} night`}</p>
                    </div>
                </Link>
            )}
        </div>
    )
}

export default LandingPage
