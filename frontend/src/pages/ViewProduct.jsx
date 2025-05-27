import { useState, useEffect, useRef } from "react";
import api from "../api";
import Structure from "../components/Structure.jsx";
import { useParams } from 'react-router-dom';
import "../components/Structure.jsx"; // This import seems unusual, usually not needed for JSX files
import "../styles/ViewProduct.css";
// import ToEdit from "./EditProduct.jsx"; // This import is for a component, but ToEdit is a function here. Redundant.
import React, { Component } from 'react'; // Component is not directly used here
import { useNavigate } from 'react-router-dom';
import StarRating from "../components/StarRating.jsx";
import Comment from "../components/Comment.jsx";
import Tail from "../components/Tail.jsx";

function ViewProduct() {
    const { pk } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [picture, setPicture] = useState("");
    const [price, setPrice] = useState("");
    const [rating, setRating] = useState("");
    const [number_of_ratings, setNumber_of_ratings] = useState("");
    const [seller, setSeller] = useState("");
    const [createdAt, setCreatedAt] = useState('');
    const [id, setId] = useState("");

    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const navigate = useNavigate();

    // New states for loading and delayed "not found" message
    const [isLoading, setIsLoading] = useState(true); // Tracks if product data is being fetched
    const [showDelayedNotFoundMessage, setShowDelayedNotFoundMessage] = useState(false); // Controls when to show "Product Not Found"

    const notFoundTimer = useRef(null); // Ref to hold the timeout ID for cleanup


    const productImages = [
        '/1.png',
        '/2.png',
        '/3.png',
    ];

    useEffect(() => {
        // --- Scroll to top when the component mounts or pk changes ---
        window.scrollTo(0, 0);

        // Fetch initial data
        getType();
        getID();
        getProducts(pk); // This will handle setting isLoading and the delayed message

        // Cleanup for the useEffect
        return () => {
            // Clear any pending timeout if the component unmounts
            if (notFoundTimer.current) {
                clearTimeout(notFoundTimer.current);
            }
        };
    }, [pk]); // Dependency array includes pk so effect re-runs if product ID changes via URL

    const getProducts = async (productId) => {
        setIsLoading(true); // Start loading when product fetch begins
        setShowDelayedNotFoundMessage(false); // Reset message state for new fetch

        // Clear any previous timer if getProducts is called again
        if (notFoundTimer.current) {
            clearTimeout(notFoundTimer.current);
        }

        try {
            const response = await api.get(`api/products/${productId}/`);
            if (response.data) {
                setName(response.data.name);
                setCreatedAt(response.data.created_at);
                setDescription(response.data.description);
                setPicture(response.data.picture);
                setPrice(response.data.price);
                setSeller(response.data.seller);
                setRating(response.data.rating);
                setNumber_of_ratings(response.data.number_of_ratings);
                setId(response.data.id);
                console.log("Product data fetched:", response.data.id);
                setIsLoading(false); // Finished loading, product found
            } else {
                console.error("Product data is empty or invalid for PK:", productId);
                setName(""); // Clear product data
                setIsLoading(false); // Finished loading, product not found (or empty data)

                notFoundTimer.current = setTimeout(() => {
                    setShowDelayedNotFoundMessage(true);
                }, 2000); // 2-second delay
            }
        } catch (error) {
            console.error('Error fetching product data for PK:', productId, error);
            setName(""); // Clear product data on error
            setIsLoading(false); // Finished loading (with error)

            notFoundTimer.current = setTimeout(() => {
                setShowDelayedNotFoundMessage(true);
            }, 2000);
        }
    };

    const getType = () => {
        api.get("api/UserDetails/")
            .then((res) => {
                if (res.data && res.data.profile_user) {
                    setUserType(res.data.profile_user.user_type);
                } else {
                    console.error("User type data not found in response.");
                }
            })
            .catch((err) => console.error("Error fetching user type:", err));
    };


    const getID = () => {
        api
            .get("api/UserDetails/")
            .then((res) => {
                if (res.data && res.data.username) {
                    setUserId(res.data.username);
                } else {
                    console.error("Username data not found in response.");
                }
            })
            .catch((err) => console.error("Error fetching user ID:", err));
    };


    const ToEditProduct = (productId) => {
        navigate(`/editProduct/${productId}`);
    };

    const DeleteProducts = async (productId) => {
        try {
            const response = await api.delete(`api/products/delete/${productId}/`);
            if (response.status === 200 || response.status === 204) {
                console.log("Product deleted:", productId);
                navigate("/"); // Redirect to home after deletion
            } else {
                console.error("Failed to delete product:", response.status, response.data);
            }
        } catch (err) {
            console.error("Error during product delete:", err);
        }
    };

    return (
        <div>
            <Structure />
            <div style={{ paddingTop: '20px', minHeight: "100vh" }}>
                {isLoading ? (
                    <div className="message-container-vi">
                        <h3 style={{ fontSize: "2rem" }}>Loading product details...</h3>
                    </div>
                ) : name !== "" ? (
                    <div className="product-details" style={{boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                        <h1 style={{ textAlign: 'center' }}>{name}</h1>
                        <hr style={{ border: '1px solid #ccc', width: '95%' }} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src={productImages[id % productImages.length]}
                                alt={name || 'Product Image'}
                                style={{ marginTop: '10px', alignContent: 'center', height: "50vh", width: "50vh", objectFit: 'contain' }}
                            />
                        </div>
                        <p><strong>Description:</strong> {description ? description : "No description added by seller"}</p>
                        <p><strong>Rating:</strong> {rating} / 5 ( By {number_of_ratings} )</p>
                        <p><strong>Seller:</strong> {seller}</p>
                        <p><strong>Created At:</strong> {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}</p>
                        <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left', marginTop: '20px', gap: '10px' }}>
                            {(UserType === "Customer") && (
                                <div>
                                    <StarRating />
                                    <button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', cursor: 'pointer', marginTop: '40px', borderRadius: "5px" }}>Add to Cart</button>
                                </div>
                            )}
                            {(UserId === seller) && (
                                <div>
                                    <button onClick={() => ToEditProduct(pk)} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit Product</button>
                                </div>
                            )}
                            {(UserType === "Employee" && UserId === seller) && (
                                <div>
                                    <button onClick={() => DeleteProducts(pk)} style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete Product</button>
                                </div>
                            )}
                            {(UserType === "Manager") && (
                                <div>
                                    <button onClick={() => DeleteProducts(pk)} style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete Product</button>
                                </div>
                            )}
                        </div>
                        <h2 style={{ marginTop: '30px' }}> ${price}</h2>
                        <hr style={{ border: '1px solid #ccc', width: '95%', marginTop: "5vh" }} />
                        <h1 style={{ alignContent: 'center', textAlign: 'center' }}> Comments</h1>
                        <Comment productId={pk} />
                    </div>
                ) : (
                    showDelayedNotFoundMessage ? (
                        <div className="message-container">
                            <h3 className="message-text" style={{ fontSize: "2rem" }}>404 Product Not Found.</h3>
                        </div>
                    ) : (
                        <div className="message-container">
                            <h3 style={{ fontSize: "2rem" }}>Checking for product...</h3>
                        </div>
                    )
                )}
            </div>
            <Tail />
        </div>
    );
}

export default ViewProduct;