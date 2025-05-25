import { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/home.css" // Ensure this path is correct for your CSS file
import Structure from "../components/Structure.jsx";
import { useNavigate } from 'react-router-dom';
import ToDelete from "../components/DeleteProduct.jsx";
import React from "react";
import { useParams } from 'react-router-dom';
import Tail from "../components/Tail.jsx";

function Home() {
    const { pk } = useParams();
    const [length, setLength] = useState("");
    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState("");
    const navigate = useNavigate();
    const scrollableDivRef = useRef(null);

    // Assuming these images are now static assets in your public folder
    // e.g., public/images/box_6694241.png
    const productImages = [
        '/1.png', // Updated path
        '/2.png',        // Updated path
        '/3.png',      // Updated path
    ];

    useEffect(() => {
        getType();
        getID();
        getProducts();
    }, []);


    useEffect(() => {
        restoreScrollPosition();
    }, [products]);

    const saveScrollPosition = () => {
        if (scrollableDivRef.current) {
            localStorage.setItem("scrollPosition", scrollableDivRef.current.scrollTop.toString());
        }
    };

    const restoreScrollPosition = () => {
        if (scrollableDivRef.current) {
            const savedPosition = localStorage.getItem("scrollPosition");
            if (savedPosition !== null) {
                scrollableDivRef.current.scrollTop = parseInt(savedPosition, 10) || 0;
            }
        }
    };

    const getProducts = async () => {
        try {
            const response = await api.get("api/products/list/");
            if (response.data && response.data.length) {
                setProducts(response.data);
                setLength(response.data.length);
            } else {
                console.error("Products not found or data is invalid");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getType = () => {
        api.get("api/UserDetails/").then((res) => res.data.profile_user.user_type).then((user_type) => { setUserType(user_type); }).catch((err) => console.error(err)); // Changed alert to console.error
    };

    const getID = () => {
        api
            .get("api/UserDetails/")
            .then((res) => res.data.username)
            .then((username) => {
                setUserId(username);
            })
            .catch((err) => console.error(err)); // Changed alert to console.error
    };

    const ToEdit = (pk) => {
        navigate(`/editProduct/${pk}`);
    };

    const ToCart = async (pk) => {
        try {
            const response = await api.patch("api/chart/add/", { "Product_id": pk, "quantity": 1 })
            if (response.status === 201 || response.status === 200) {
                console.log("data sent successfuly");
            } else {
                console.log("Failed to add balance", response.status);
            }
        } catch (err) {
            console.log("Error during adding balance:", err);
        }
    }

    // These content components seem empty or placeholders.
    // Ensure they return meaningful content if they are meant to display something.
    const CustomerHomePageContent = () => {
        return <div className="customer-home-content"  style={{ minHeight: "100vh" }}></div>;
    };

    const ManagerHomePageContent = () => {
        return <div className="manager-home-content"  style={{ minHeight: "100vh" }}></div>;
    };

    const EmployeeHomePageContent = () => {
        return (
            <div className="employee-home-content" style={{ minHeight: "100vh" }}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
        );
    };

    const ContentComponent = UserType === 'Customer' ? CustomerHomePageContent :
        UserType === 'Manager' ? ManagerHomePageContent :
            UserType === 'Employee' ? EmployeeHomePageContent :
                () => <p>Unknown user type.</p>; // Default component

    return (
        // Removed inline margin:0px, relying on body style in home.css
        <div>
            <Structure />
<div className="manager-home-content"  style={{ minHeight: "100vh", marginTop: '20px'  }}>

            {products.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', width: '100%'}}>
                    <h1 style={{ textAlign: 'center' }}>No products available at the moment.</h1>
                </div>
            ) : (
                <div className="products-list" ref={scrollableDivRef}> {/* Added ref here */}
                    {products.map((product, idx) => (
                        <div
                            key={product.id}
                            className="product-item-home"
                            onClick={() => navigate(`/ViewProduct/${product.id}`)}
                            // Removed onMouseEnter/onMouseLeave as cursor is now in CSS
                        >
                            <div className="product-image-container"> {/* New class for image centering */}
                                <img
                                    src={productImages[Math.floor(Math.random() * productImages.length)]} // Use productImages.length for robustness
                                    alt={product.name}
                                    className="product-image"
                                    // Removed inline image styles, now handled by .product-image CSS class
                                />
                            </div>
                            <h1 className="product-name">{product.name}</h1> {/* New class for h1 */}
                            <hr className="product-divider" /> {/* New class for hr */}
                            <h4>Seller: {product.seller}</h4>
                            <h4>{product.created_at.split('T')[0]}</h4>
                            <br></br>
        

                            <div className="product-actions" onClick={(e) => e.stopPropagation()}> {/* New class for button container */}

                                {(UserId === product.seller) && (
                                    <button
                                        className="edit-button" // New class for edit button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            ToEdit(product.id)
                                        }}
                                    >Edit</button>
                                )}

                                {(UserType === "Customer") && (
                                    <button
                                    className="add-to-cart-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            ToCart(product.id)
                                        }}
                                    >Add to cart</button>
                                )}

                                <ToDelete
                                    pk={product.id}
                                    UserId={UserId}
                                    onProductDeleted={() => {
                                        saveScrollPosition();
                                        getProducts();
                                    }}
                                />
                            </div>
                            {/* Removed extra <br></br> */}
                            <div className="product-price-tag"> {/* New class for price tag */}
                                <h1>${product.price}</h1>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>
            <Tail/>
        </div>
    );
}

export default Home;
