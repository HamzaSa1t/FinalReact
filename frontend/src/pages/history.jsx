import { useEffect, useState } from "react";
import api from "../api";
import React from "react";
import '../styles/basket.css';
import Structure from "../components/Structure";
import Tail from "../components/Tail";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function History() {
const [products, setProducts] = useState([]); 
const [length, setLength] = useState(""); 
const [showMessage, setShowMessage] = useState(false);

       useEffect(() => {
        ShowHistory(); 

                     if (products.length  < 1){

  const timer = setTimeout(() => {
    setShowMessage(true);
  }, 2000);
  return () => clearTimeout(timer);

        }
       }, []);

      const productImages = [
        '/1.png', // Updated path
        '/2.png',        // Updated path
        '/3.png',      // Updated path
    ];
const ShowHistory = async () => {

    try {
        const response = await api.get("api/customers/history/")
        if (response.data && (response.status === 200 || response.status === 201)) {
         //   console.log("History:", response.data);
            setProducts(response.data); 
          //  console.log("info:", response.data);
            setLength(response.data.length);
        } else {
        //    console.log("Failed to get user info", response.status);
            alert("Failed to get user info.");
        }
    }
    catch (err) {
        console.log("Error during fetching user info:", err);
        if (err.response) {
            console.log("Response error data:", err.response);
          //  console.log("Response status:", err.response.status);
         //   console.log("Response headers:", err.response.headers);
        }
        if (err.request) {
            console.log("Request error:", err.request);
        }
        alert("Error occurred during fetching user info.");
    }
}

 const handleProductClick = () => {
        navigate(`/`); // Redirect to the product detail page
    };

    

return (
    <div className="basket-page">
        <Structure />
        <div  style={{ minHeight: "100vh" }}>
        <h1 className="basket-header" style={{paddingLeft:'13px'}}>Your History</h1>
        {products.length > 0 ? (
            <div style={{width:"100%"}}>
                {products.map((product, index) => (
                    <div key={index} className="product-item-cart" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' , width: '80%'}} >
                        <div>
                        <h3>{product.product_name}</h3>
                        <p>seller: {product.product_seller}</p>
                        <p>Price: {product.product_price}$</p>
                        <p>Quantity: {product.quantity}</p>
                        <h1></h1>
<h3>Total: {(product.product_price * product.quantity).toFixed(2)}$</h3>
                        </div> 
                        <div style={{marginLeft: '30px'}}> 
                  
                                <img
                                        src={productImages[product.id % productImages.length]}
                                    alt={product.name}
                                    className="product-image-history" 
                                    style={{ width: '120px', height: '120px', marginLeft: '20px', objectFit: 'cover' }}
                                />
                                </div>                                                   

                      </div>
                ))}
            </div>
        ) : (

                   <div style={{minHeight:"200vh"}}>
                   
 {showMessage && (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '60vh', width: '100%'}}>
        <h3 style={{ textAlign: 'center', fontSize: "1.5em", marginTop: "5vh" }}>No products added yet</h3>
      </div>
    )}


                </div> 
        )}
        </div>
                                    <Tail/>
    </div>
);
     
     
     }
     
     export default History