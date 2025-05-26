import { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/home.css"; // Ensure this path is correct for your CSS file
import Structure from "../components/Structure.jsx";
import { useNavigate } from 'react-router-dom';
import ToDelete from "../components/DeleteProduct.jsx";
import React from "react";
import { useParams } from 'react-router-dom';
import Tail from "../components/Tail.jsx";

function Home() {
    const { pk } = useParams();
    // const [length, setLength] = useState(""); // This state is redundant if products.length is used directly
    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const [products, setProducts] = useState([]);
    // const [seller, setSeller] = useState(""); // This state seems unused
    const navigate = useNavigate();
    const scrollableDivRef = useRef(null);

    // New states for loading and delayed message
    const [isLoading, setIsLoading] = useState(true); // Tracks if products are being fetched
    const [showDelayedNoProductsMessage, setShowDelayedNoProductsMessage] = useState(false); // Controls the delayed "No products" message

    const noProductsTimer = useRef(null); // Ref to hold the timeout ID for cleanup


    const productImages = [
        '/1.png',
        '/2.png',
        '/3.png',
    ];

    useEffect(() => {
        // Fetch initial data
        getType();
        getID();
        getProducts(); // This will handle setting isLoading and the delayed message

        // Cleanup for the useEffect
        return () => {
            // Clear any pending timeout if the component unmounts
            if (noProductsTimer.current) {
                clearTimeout(noProductsTimer.current);
            }
        };
    }, []); // Empty dependency array: runs once on mount

    useEffect(() => {
        // This useEffect depends on 'products' to restore scroll position
        // This is good for ensuring scroll is restored *after* products are loaded
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
        setIsLoading(true); // Start loading when product fetch begins
        setShowDelayedNoProductsMessage(false); // Reset message state for new fetch

        // Clear any previous timer if getProducts is called again
        if (noProductsTimer.current) {
            clearTimeout(noProductsTimer.current);
        }

        try {
            const response = await api.get("api/products/list/");
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                setProducts(response.data);
                // setLength(response.data.length); // Redundant if products.length is used
                setIsLoading(false); // Finished loading, products found
            } else {
                setProducts([]); // Ensure products is an empty array if no data or invalid
                // setLength(0); // Redundant
                setIsLoading(false); // Finished loading, no products found

                // If no products, set a timeout to show the "No products" message after 2 seconds
                noProductsTimer.current = setTimeout(() => {
                    setShowDelayedNoProductsMessage(true);
                }, 2000); // 2-second delay as per your original request
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setProducts([]); // Set products to empty array on error
            // setLength(0); // Redundant
            setIsLoading(false); // Finished loading (with error)

            // Even on error, show the delayed message if products list is empty
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

    // These content components are currently empty.
    // Ensure they return meaningful content if they are meant to display something specific to user types.
    // For this example, I'm assuming the main product list is relevant for all types.
    const CustomerHomePageContent = () => {
        return <div className="customer-home-content" style={{ minHeight: "100vh" }}>{/* ... */}</div>;
    };

    const ManagerHomePageContent = () => {
        return <div className="manager-home-content" style={{ minHeight: "100vh" }}>{/* ... */}</div>;
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

    // The ContentComponent is declared but not used in the return JSX below.
    // If you intend to use it to conditionally render different layouts based on UserType,
    // you would place <ContentComponent /> in your main return block.
    const ContentComponent = UserType === 'Customer' ? CustomerHomePageContent :
        UserType === 'Manager' ? ManagerHomePageContent :
            UserType === 'Employee' ? EmployeeHomePageContent :
                () => <p>Unknown user type.</p>; // Default component

    return (
        <div>
            <Structure />
            {/* Moved inline styles to CSS where possible, but kept minHeight and marginTop for this specific div for now */}
            <div className="main-content-area" style={{ minHeight: "100vh", marginTop: '20px' }}>

                {isLoading ? (
                    // Display loading message while products are being fetched
                    <div className="message-container">
                        <h3 className="message-text">Loading products...</h3>
                    </div>
                ) : products.length > 0 ? (
                    // Display products if loading is complete and products are found
                    <div className="products-list" ref={scrollableDivRef}>
                        {products.map((product) => (
                            <div
                                key={product.id} // Ensure product.id is unique for keys
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
                                <h4>{product.created_at ? product.created_at.split('T')[0] : 'N/A'}</h4> {/* Added check for created_at */}

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
                    // If not loading, and no products are found:
                    showDelayedNoProductsMessage ? (
                        // Display "No products added yet" AFTER the 2-second delay
                        <div className="message-container">
                            <h3 className="message-text">No products added yet.</h3>
                        </div>
                    ) : (
                        // Display this briefly after loading is done but before the delayed message appears
                        <div className="message-container">
                            <h3 className="message-text">Checking for products...</h3>
                        </div>
                    )
                )}
            </div>
            <Tail />
        </div>
    );
}

export default Home;