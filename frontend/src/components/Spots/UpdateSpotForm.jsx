import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { getASpot } from "../../store/spot";
import { updateSpot } from "../../store/spot";
// TODO: Add Put request

function UpdateSpotForm() {
    const { spotId } = useParams();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spot.spot);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const previewImage = spot.SpotImages ? spot.SpotImages[0].url : "";
    const spotImage2 = spot.SpotImages ? (spot.SpotImages[1] ? spot.SpotImages[1].url : "") : "";
    const spotImage3 = spot.SpotImages ? (spot.SpotImages[2] ? spot.SpotImages[2].url : "") : "";
    const spotImage4 = spot.SpotImages ? (spot.SpotImages[3] ? spot.SpotImages[3].url : "") : "";
    const spotImage5 = spot.SpotImages ? (spot.SpotImages[4] ? spot.SpotImages[4].url : "") : "";

    // Spot Information
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.country)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [lat, setLat] = useState(spot.lat)
    const [lng, setLng] = useState(spot.lng)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false)

    // Spot Image
    const [image1, setImage1] = useState(previewImage)
    const [image2, setImage2] = useState(spotImage2)
    const [image3, setImage3] = useState(spotImage3)
    const [image4, setImage4] = useState(spotImage4)
    const [image5, setImage5] = useState(spotImage5)

    useEffect(() => {
        dispatch(getASpot(spotId))
    }, [dispatch, spotId])

    useEffect(() => {
        const errors = {};
        if (!address.length) errors.address = "Street Address is required";
        if (!city.length) errors.city = "City is required";
        if (!state.length) errors.state = "State is required";
        if (!country.length) errors.country = "Country is required";
        if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
        if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
        if (!name.length) errors.name = "Name is required";
        if (name.length > 50) errors.name = "Name must be less than 50 characters";
        if (!description.length) errors.description = "Description is required";
        if (price < 0) errors.price = "Price per day must be a positive number";
        if (!image1.length) errors.image1 = "Preview Image is required";



       setValidationErrors(errors);
    }, [address, city, state, country, lat, lng, name, description, price, image1])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        console.log(image2)
        if (Object.values(validationErrors).length) return null;

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        };

        let updatedSpot;
        try {
            updatedSpot = await dispatch(updateSpot(payload, spotId));
        } catch (error) {
            throw error
        }

        // TODO: Spot Image for replacing preview image and 2-5; grab the spot image id, delete and then add the image for them
        // const previewImage = {url: image1, preview: true, spotId: createdSpot.id};
        // await dispatch(addImageToSpot(previewImage));

        // const imageArray = [image2, image3, image4, image5];

        // for (let image of imageArray) {
        //     if (image.length) {
        //         const addImage = {url: image, preview: false, spotId: createdSpot.id};
        //         await dispatch(addImageToSpot(addImage))
        //     };
        // };

        navigate(`/spots/${spotId}`);
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
            <p>
                {hasSubmitted && validationErrors.country}
            </p>
            <label>
                Street Address
                <input
                    type="text"
                    name="address"
                    value={ address }
                    onChange={(e) => setAddress(e.target.value)}
                />
            </label>
            <p>
                {hasSubmitted && validationErrors.address}
            </p>
            <label>
                City
                <input
                    type="text"
                    name="city"
                    value={ city }
                    onChange={(e) => setCity(e.target.value)}
                />{`, `}
            </label>
            <p>
                {hasSubmitted && validationErrors.city}
            </p>
            <label>
                State
                <input
                    type="text"
                    name="state"
                    value={ state }
                    onChange={(e) => setState(e.target.value)}
                />
            </label>
            <p>
                {hasSubmitted && validationErrors.state}
            </p>
            <label>
                Latitude
                <input
                    type="number"
                    name="lat"
                    value={ lat }
                    onChange={(e) => setLat(e.target.value)}
                />{`, `}
            </label>
            <p>
                {hasSubmitted && validationErrors.lat}
            </p>
            <label>
                Longitude
                <input
                    type="number"
                    name="lng"
                    value={ lng }
                    onChange={(e) => setLng(e.target.value)}
                />
            </label>
            <p>
                {hasSubmitted && validationErrors.lng}
            </p>
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
                <p>
                    {hasSubmitted && validationErrors.description}
                </p>
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
                <p>
                {hasSubmitted && validationErrors.name}
            </p>
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
            <p>
                {hasSubmitted && validationErrors.price}
            </p>
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
                <p>
                {hasSubmitted && validationErrors.image1}
                </p>
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
