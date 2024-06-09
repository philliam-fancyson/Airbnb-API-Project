import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux"
import { getUserSpots } from "../../store/spot";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from "./DeleteSpotModal";
// import { Tooltip } from 'react-tooltip'
import './SpotManage.css'


function ManageSpots() {
    const dispatch = useDispatch();
    const userSpots = useSelector(state => state.spot.spots);
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    useEffect(() => {
        dispatch(getUserSpots())
    },[dispatch])

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

    if (!userSpots) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div>
                <h2>Manage Your Spots</h2>
            </div>
            {!userSpots.length && <Link to='/spots/new'><button>Create a New Spot</button></Link>}
            {userSpots &&<div className="manage-grid">
                {userSpots && userSpots.map((spot, index) =>
                        <div key={index} className="spot-grid">
                            <Link to={`/spots/${spot.id}`}>
                            {/* <Tooltip id="my-tooltip"> */}
                            <img src={spot.previewImage} />
                            {/* </Tooltip> */}
                            <div className="in-line">
                                <h2 style={{"textAlign": "left", "width": "49%"}}>{spot.city}, {spot.state}</h2>
                                <p style={{"textAlign": "right", "width": "49%"}}>{spot.avgRating ? <><FaStar />{parseInt(spot.avgRating).toFixed(1)}</>: <><FaStar /> New</>}</p>
                            </div>
                            <p>{`$${spot.price} night`}</p>
                            </Link>
                            <Link to={`/spots/${spot.id}/edit`}><button>Update</button></Link>
                            <OpenModalButton
                                buttonText="Delete"
                                onButtonClick={closeMenu}
                                modalComponent={<DeleteSpotModal spotId={spot.id}/>}
                            />
                        </div>

                )}
            </div>}
        </>
    )
}

export default ManageSpots
