// ToDelete.jsx
import { useState, useEffect, useRef } from "react";
import api from "../api";

// Add onProductDeleted prop
function ToDelete({ pk, UserId, onProductDeleted }) {
    const [name, setName] = useState("");
    const [seller, setSeller] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [UserType, setUserType] = useState("");

    useEffect(() => {
        getType();
        getProducts(pk);
        // No need to fetch all products here, Home component handles it
        // fetchProducts(); // REMOVE THIS LINE
    }, [pk]); // Add pk to dependency array as it's used in getProducts

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

    const getProducts = async (pk) => {
        try {
            const response = await api.get(`api/products/${pk}/`);
            if (response.data) {
                setName(response.data.name);
                setSeller(response.data.seller);
            } else {
                console.error("Product not found or data is invalid");
            }
        } catch (error) {
            console.error('Error fetching product details for deletion:', error);
            // Optionally, handle specific error codes (e.g., 404 if product already gone)
        }
    };

    const DeleteProducts = async (pk) => {
        try {
            const response = await api.delete(`api/products/delete/${pk}/`);
            if (response.status === 200 || response.status === 204) {
                console.log("Product deleted:", name);
                // Instead of reloading, call the callback from the parent
                if (onProductDeleted) {
                    onProductDeleted();
                }
            } else {
                setErrorMessage("Failed to delete product");
                alert("Failed to delete product.");
            }
        } catch (err) {
            console.error("Error during product delete:", err);
            setErrorMessage("Error occurred during product delete.");
            alert("Error occurred during product delete.");
            // Log specific error details for debugging
            if (err.response) {
                console.error("Response error data:", err.response.data);
                console.error("Response status:", err.response.status);
            }
        }
    };

    return (
        <div>
            {(UserId === seller || UserType === "Manager") && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent the parent product item's onClick from firing
                        DeleteProducts(pk);
                    }}
                    style={{ backgroundColor: '#dc3545'}} // Changed color to red for delete
                >
                    Delete
                </button>
            )}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default ToDelete;