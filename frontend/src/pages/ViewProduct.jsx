import { useState, useEffect } from "react";
import api from "../api";
import Structure from "../components/Structure.jsx";
import { useParams } from 'react-router-dom';
import "../components/Structure.jsx";
import "../styles/ViewProduct.css"; 
import ToEdit from "./EditProduct.jsx";
import React, { Component } from 'react';
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

    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getType();
        getID();
        getProducts(pk);
    }, []);

        const productImages = [
        '/1.png', // Updated path
        '/2.png',        // Updated path
        '/3.png',      // Updated path
    ];

    const getProducts = async (pk) => {
        try {
            const response = await api.get(`api/products/${pk}/`);
            if (response.data) {
                setName(response.data.name);
                setCreatedAt(response.data.created_at);
                setDescription(response.data.description);
                setPicture(response.data.picture);
                setPrice(response.data.price);
                setSeller(response.data.seller);
                setRating(response.data.rating);
                setNumber_of_ratings(response.data.number_of_ratings);
            } else {
                console.error("Products not found or data is invalid");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getType = () => {
        api
            .get("api/UserDetails/")
            .then((res) => res.data.profile_user.user_type)
            .then((user_type) => {
                setUserType(user_type);
            })
            .catch((err) => alert(err));
    };


    const getID = () => {
        api
            .get("api/UserDetails/")
            .then((res) => res.data.username)
            .then((username) => {
                setUserId(username);
            })
            .catch((err) => alert(err));
    };

    
      
    const ToEdit = (pk) => {
        navigate(`/editProduct/${pk}`);
            };

            const DeleteProducts = async (pk) => {
                try {
                //    console.log(`Attempting to delete product with id: ${pk}`);
                    const response = await api.delete(`api/products/delete/${pk}/`);
                    if (response.status === 200 || response.status === 204) {
                    //    console.log("Product deleted:", name);
                        navigate("/");
                    } else {
                        setErrorMessage("Failed to delete product");
                        alert("Failed to delete product.");
                    }
                } catch (err) {
                    console.log("Error during product delete:", err);
                    alert("Error occurred during product delete.");
        
                    if (err.response) {
                     //   console.log("Response error data:", err.response.data);
                     //   console.log("Response status:", err.response.status);
                     //   console.log("Response headers:", err.response.headers);
                        console.log("Response error:", err.response);
                    }       
        
                    if (err.request) {
                        console.log("Request error:", err.request);
                    }
        
                    alert("Error occurred during product delete.");
                }
            };    

    return (
        <div>
            <Structure />
            <div  style={{paddingTop: '20px'}}>
                {(name !== "") && <div className="product-details">
                <h1 style={{textAlign: 'center'}} >{name}</h1>
                <hr style={{ border: '1px solid #ccc', width: '95%' }} />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} /* className="product-image-container" */>
                <img src={productImages[Math.floor(Math.random() * productImages.length)]} alt={name} /* className="product-image" */ style={{marginTop: '10px', alignContent:'center', height: "50vh", width: "50vh"}}/>
                </div>                                                                                                                          
                <p><strong>Description:</strong> {description ? description : "No description added by seller"}</p>
                <p><strong>Rating:</strong> {rating} / 5 ( By {number_of_ratings} )</p>
                <p><strong>Seller:</strong> {seller}</p>
                <p><strong>Created At:</strong> {new Date(createdAt).toLocaleDateString()}</p>
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left', marginTop: '20px', gap: '10px' }}>
                {(UserType === "Customer") && <div> <StarRating/><button style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer', marginTop:'40px', borderRadius:"5px" }}>Add to Cart</button></div>}
                {(UserId === seller) && <div> <button onClick={() => ToEdit(pk)} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit Product</button></div>}
                {(UserType === "Employee" && UserId === seller) && <div> <button onClick={() => DeleteProducts(pk)} style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete Product</button></div>}
                {(UserType === "Manager") && <div> <button style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete Product</button> </div>}
                </div>
                <h2 style={{marginTop: '30px'}}> ${price}</h2>
                <h1 style={{alignContent:'center', textAlign:'center'}}> Comments</h1>
                <Comment/>
            </div>}
            {name === "" && <h1>404 product NOT FOUND</h1>}
        </div>
        <Tail/>
        </div>
    );
}

export default ViewProduct;

