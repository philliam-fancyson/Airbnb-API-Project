import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { getASpot } from "../../store/spot";
// TODO: Add Put request

function UpdateSpotForm() {
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spot.spot);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Spot Information
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)

    // Spot Image
    const [image1, setImage1] = useState("")
    const [image2, setImage2] = useState("")
    const [image3, setImage3] = useState("")
    const [image4, setImage4] = useState("")
    const [image5, setImage5] = useState("")

    useEffect(() => {
        dispatch(getASpot(spotId))
    }, [dispatch, spotId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        };

        let createdSpot;
        try {
            // TODO: Grab Spot Image
            // createdSpot =
        } catch (error) {
            throw error
        }

        // console.log(createdSpot);
        navigate(`/spots/${createdSpot.id}`)
    };

    //TODO Maybe: Update Spot

    return (
        <form
            className="spot-form"
            onSubmit={handleSubmit}
        >
            {!sessionUser && <Navigate to="/" />}
            <h2>Update your Spot</h2>
            <h3>Where's your place located?</h3>
            <p>Guests will only get your exact address once they booked a reservation.</p>
            <label>
                Country
                <input
                    type="text"
                    name="country"
                    value={ country }
                    onChange={(e) => setCountry(e.target.value)}
                />
            </label>
            <label>
                Street Address
                <input
                    type="text"
                    name="address"
                    value={ address }
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <label>
                City
                <input
                    type="text"
                    name="city"
                    value={ city }
                    onChange={(e) => setCity(e.target.value)}
                />{`, `}
            </label>
            <label>
                State
                <input
                    type="text"
                    name="state"
                    value={ state }
                    onChange={(e) => setState(e.target.value)}
                />
            </label>
            <label>
                Latitude
                <input
                    type="number"
                    name="lat"
                    value={ lat }
                    onChange={(e) => setLat(e.target.value)}
                />{`, `}
            </label>
            <label>
                Longitude
                <input
                    type="number"
                    name="lng"
                    value={ lng }
                    onChange={(e) => setLng(e.target.value)}
                />
            </label>
            <div className="spot-description">
                <h3>Describe your place to guests</h3>
                <p>Mention the best feature of your space, any special amentities likes fast wifi or parking, and what you love about your neighborhood.</p>
                <textarea
                    type="text"
                    name="description"
                    value={ description }
                    placeholder="Please write at least 30 characters"
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="spot-name">
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input
                    type="text"
                    name="name"
                    value={ name }
                    placeholder="Name of your Spot"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="spot-price">
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                <>$</> <input
                    type="number"
                    name="price"
                    value={ price }
                    placeholder="Price per night (USD)"
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="spot-photos">
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <input
                    type="text"
                    name="image"
                    value={ image1 }
                    placeholder="Preview Image URL"
                    onChange={(e) => setImage1(e.target.value)}
                />
                <input
                    type="text"
                    name="image"
                    value={ image2 }
                    placeholder="Image URL"
                    onChange={(e) => setImage2(e.target.value)}
                />
                <input
                    type="text"
                    name="image"
                    value={ image3 }
                    placeholder="Image URL"
                    onChange={(e) => setImage3(e.target.value)}
                />
                <input
                    type="text"
                    name="image"
                    value={ image4 }
                    placeholder="Image URL"
                    onChange={(e) => setImage4(e.target.value)}
                />
                <input
                    type="text"
                    name="image"
                    value={ image5 }
                    placeholder="Image URL"
                    onChange={(e) => setImage5(e.target.value)}
                />
            </div>
            <button type="submit">Update Spot</button>
        </form>
    )
}

export default UpdateSpotForm;
