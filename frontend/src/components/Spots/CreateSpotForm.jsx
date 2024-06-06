import { useState, useEffect } from "react";
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { addASpot } from "../../store/spot";
import { addImageToSpot } from "../../store/spot";


function CreateSpotForm() {
    const sessionUser = useSelector(state => state.session.user);
    const newSpot = useSelector(state => state.spot.spot)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // Spot Information
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [lat, setLat] = useState(0)
    const [lng, setLng] = useState(0)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [validationErrors, setValidationErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false)

    // Spot Image
    const [image1, setImage1] = useState("")
    const [image2, setImage2] = useState("")
    const [image3, setImage3] = useState("")
    const [image4, setImage4] = useState("")
    const [image5, setImage5] = useState("")

    //Error Validation
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
            price
        };

        let createdSpot;
        try {
            createdSpot = await dispatch(addASpot(payload));
        } catch (error) {
            throw error
        }

        const previewImage = {url: image1, preview: true, spotId: createdSpot.id};
        await dispatch(addImageToSpot(previewImage));

        const imageArray = [image2, image3, image4, image5];

        for (let image of imageArray) {
            if (image.length) {
                const addImage = {url: image, preview: false, spotId: createdSpot.id};
                await dispatch(addImageToSpot(addImage))
            };
        };

        navigate(`/spots/${createdSpot.id}`);
    };

    //TODO: Create Spot Image function

    return (
        <form
            className="spot-form"
            onSubmit={handleSubmit}
        >
            {!sessionUser && <Navigate to="/" />}
            <h2>Create a new Spot</h2>
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
            <button type="submit">Create Spot</button>
        </form>
    )
}

export default CreateSpotForm;
