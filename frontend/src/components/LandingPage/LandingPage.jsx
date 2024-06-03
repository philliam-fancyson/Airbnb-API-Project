import { useEffect } from "react";
import { useSelector } from "react-redux"
import { getAllSpots } from "../../store/spot";
import { useDispatch } from "react-redux";


function LandingPage() {
    const dispatch = useDispatch();
    const allSpots = useSelector(state => state.spot.spots);

    useEffect(() => {
        dispatch(getAllSpots())
    },[dispatch])

    return (
        <div>
            <h1>TEST</h1>
            {allSpots.map((spot) =>
                <div key={spot.id}>
                    <h2>{spot.city}, {spot.state}</h2>
                    <p>{spot.avgRating ? spot.avgRating : "Star Placeholder"}</p>
                    <p></p>
                </div>
            )}
        </div>
    )
}

export default LandingPage
