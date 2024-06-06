import { useState, useEffect } from 'react';
import { FaRegStar } from "react-icons/fa6";

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
                    <FaRegStar />
                </div>
                <div
                className={activeRating >= 2 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(2)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(2)} }
                >
                    <FaRegStar />
                </div>
                <div
                className={activeRating >= 3 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(3)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(3)} }
                >
                    <FaRegStar />
                </div>
                <div
                className={activeRating >= 4 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(4)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(4)} }
                >
                    <FaRegStar />
                </div>
                <div
                className={activeRating >= 5 ? "filled" : "empty"}
                onMouseEnter={() => {setActiveRating(5)}}
                onMouseLeave={() => {setActiveRating(stars)}}
                onClick={() => {onChange(5)} }
                >
                    <FaRegStar />
                </div>
            </div>
        </>
    )
}

export default StarRatingInput;
