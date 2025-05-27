// Home.jsx
import { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/home.css";
import Structure from "../components/Structure.jsx";
import { useNavigate } from 'react-router-dom';
import ToDelete from "../components/DeleteProduct.jsx"; // Ensure this is the correct path
import React from "react";
import { useParams } from 'react-router-dom';
import Tail from "../components/Tail.jsx";

function Home() {
    const { pk } = useParams(); // pk is usually for a single product view, might not be needed here directly
    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const scrollableDivRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [showDelayedNoProductsMessage, setShowDelayedNoProductsMessage] = useState(false);
    const noProductsTimer = useRef(null);

    const productImages = [
        '/1.png',
        '/2.png',
        '/3.png',
    ];

    useEffect(() => {
        getType();
        getID();
        getProducts(); // This will handle setting isLoading and the delayed message

        return () => {
            if (noProductsTimer.current) {
                clearTimeout(noProductsTimer.current);
            }
        };
    }, []);

    useEffect(() => {
        // This useEffect depends on 'products' to restore scroll position
        // This is good for ensuring scroll is restored *after* products are loaded
        restoreScrollPosition();
    }, [products]); // Dependency on 'products' array

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
        setIsLoading(true);
        setShowDelayedNoProductsMessage(false);

        if (noProductsTimer.current) {
            clearTimeout(noProductsTimer.current);
        }

        try {
            const response = await api.get("api/products/list/");
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setProducts(response.data);
                setIsLoading(false);
            } else {
                setProducts([]);
                setIsLoading(false);
                noProductsTimer.current = setTimeout(() => {
                    setShowDelayedNoProductsMessage(true);
                }, 2000);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setProducts([]);
            setIsLoading(false);
            noProductsTimer.current = setTimeout(() => {
                setShowDelayedNoProductsMessage(true);
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
        api.get("api/UserDetails/")
            .then((res) => {
                if (res.data && res.data.username) {
                    setUserId(res.data.username);
                } else {
                    console.error("Username data not found in response.");
                }
            })
            .catch((err) => console.error("Error fetching user ID:", err));
    };

    const ToEdit = (productId) => {
        navigate(`/editProduct/${productId}`);
    };

    const ToCart = async (productId) => {
        try {
            const response = await api.patch("api/chart/add/", { "Product_id": productId, "quantity": 1 });
            if (response.status === 201 || response.status === 200) {
                console.log("Product added to cart successfully.");
            } else {
                console.error("Failed to add product to cart:", response.status, response.data);
            }
        } catch (err) {
            console.error("Error during adding product to cart:", err);
        }
    };

    // The ContentComponent is declared but not used in the return JSX below.
    // If you intend to use it to conditionally render different layouts based on UserType,
    // you would place <ContentComponent /> in your main return block.
    const ContentComponent = UserType === 'Customer' ? () => <div className="customer-home-content" style={{ minHeight: "100vh" }}></div> :
        UserType === 'Manager' ? () => <div className="manager-home-content" style={{ minHeight: "100vh" }}></div> :
            UserType === 'Employee' ? () => <div className="employee-home-content" style={{ minHeight: "100vh" }}><br /><br /><br /><br /></div> :
                () => <p>Unknown user type.</p>; // Default component

    return (
        <div>
            <Structure />
            <div className="main-content-area" style={{ minHeight: "100vh", marginTop: '20px' }}>

                {isLoading ? (
                    <div className="message-container">
                        <h3 style={{ fontSize: "2rem" }}>Loading products...</h3>
                    </div>
                ) : products.length > 0 ? (
                    <div className="products-list" ref={scrollableDivRef}>
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="product-item-home"
                                onClick={() => navigate(`/ViewProduct/${product.id}`)}
                            >
                                <div className="product-image-container">
                                    <img
                                        src={productImages[product.id % productImages.length]}
                                        alt={product.name || 'Product Image'}
                                        className="product-image"
                                    />
                                </div>
                                <h1 className="product-name">{product.name}</h1>
                                <hr className="product-divider" />
                                <h4>Seller: {product.seller}</h4>
                                <h4>{product.created_at ? product.created_at.split('T')[0] : 'N/A'}</h4>

                                <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                                    {(UserId === product.seller) && (
                                        <button
                                            className="edit-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                ToEdit(product.id);
                                            }}
                                        >Edit</button>
                                    )}

                                    {(UserType === "Customer") && (
                                        <button
                                            className="add-to-cart-button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                ToCart(product.id);
                                            }}
                                        >Add to cart</button>
                                    )}

                                    <ToDelete
                                        pk={product.id}
                                        UserId={UserId}
                                        // This callback is crucial for re-rendering after deletion
                                        onProductDeleted={() => {
                                            saveScrollPosition(); // Save scroll position before fetching new data
                                            getProducts(); // Re-fetch products to update the list
                                        }}
                                    />
                                </div>
                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                    <h1>${product.price}</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    showDelayedNoProductsMessage ? (
                        <div className="message-container">
                            <h3 className="message-text">No products added yet.</h3>
                        </div>
                    ) : (
                        <div className="message-container">
                            <h3 style={{ fontSize: "2rem" }}>Checking for products...</h3>
                        </div>
                    )
                )}
            </div>
            <Tail />
        </div>
    );
}

export default Home;