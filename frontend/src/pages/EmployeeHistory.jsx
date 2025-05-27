import { useEffect, useState } from "react";
import api from "../api";
import React from "react";
import '../styles/basket.css';
import Structure from "../components/Structure";
import Tail from "../components/Tail";

function EmployeeHistory() {
    const [products, setProducts] = useState([]); 
    const [length, setLength] = useState("");
    const [UserType, setUserType] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        ManagerShowHistory();

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


    const ManagerShowHistory = async () => {
        try {
            const ManagerResponse = await api.get("api/managers/history/")
            if (ManagerResponse.data && (ManagerResponse.status === 200 || ManagerResponse.status === 201)) {
                setProducts(ManagerResponse.data); 
               console.log("info:", ManagerResponse.data);
            //    setLength(ManagerResponse.data.length); 
            } else {
                console.log("Failed to get user info", ManagerResponse.status);
            }
        }
        catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.ManagerResponse) {
            //    console.log("Response error data:", err.ManagerResponse.data);
             //   console.log("Response status:", err.ManagerResponse.status);
             //   console.log("Response headers:", err.ManagerResponse.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    }
    return (
        <div className="basket-page">
            <Structure />
            <div  style={{ minHeight: "100vh" }}>
            <h1 className="basket-header" style={{ marginLeft:'13px', marginRight:'13px'}}>Your History</h1>
            {products.length > 0 ? (
                <div style={{width:"100%"  }}>
                    {products.map((product, index) => (
                        <div key={index} className="product-item-cart" style={{  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' , width: '80%'}}>
                            <div>
                                <h3>{product.product_name}</h3>
                                <p><strong>Price: {product.product_price}$</strong></p>
                                <p><strong>Quantity: {product.quantity}</strong></p>
                                <br></br>
                                <h3>Total: {product.product_price * product.quantity}$</h3>
                            </div>
                             <div style={{marginLeft: '30px'}}>
                                <img
                                    src={productImages[index % productImages.length]}
                                    alt={product.product_name}
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
        <h3 style={{ textAlign: 'center', fontSize: "1.5em", marginTop: "5vh" }}>No products in your history yet</h3>
      </div>
    )}
</div>


)}
            </div>
                                        <Tail/>
        </div>
    );
}

export default EmployeeHistory;