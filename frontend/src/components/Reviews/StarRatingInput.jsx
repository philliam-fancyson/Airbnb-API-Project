import { useState, useEffect } from 'react';
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import './CreateReviewModal.css';

function StarRatingInput({stars, onChange}) {
    const [activeRating, setActiveRating] = useState(stars);

    useEffect(() => {
        setActiveRating(stars);
      }, [stars]);

    return (
        <>
            <div className="stars-input">
                <div
                className={activeRating >= 1 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(1)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(1)} }
                >
                    {activeRating >= 1 ? <FaStar />: <FaRegStar />}
                </div>
                <div
                className={activeRating >= 2 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(2)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(2)} }
                >
                    {activeRating >= 2 ? <FaStar />: <FaRegStar />}
                </div>
                <div
                className={activeRating >= 3 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(3)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(3)} }
                >
                    {activeRating >= 3 ? <FaStar />: <FaRegStar />}
                </div>
                <div
                className={activeRating >= 4 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(4)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(4)} }
                >
                    {activeRating >= 4? <FaStar />: <FaRegStar />}
                </div>
                <div
                className={activeRating >= 5 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(5)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(5)} }
                >
                    {activeRating >= 5 ? <FaStar />: <FaRegStar />}
                </div>
                <p style={{"padding-left": "10px"}}>Stars</p>
            </div>

        </>
    )
}

export default StarRatingInput;
