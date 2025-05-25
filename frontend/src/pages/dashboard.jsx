import { useEffect, useState } from "react";
import api from "../api";
import React from "react";
import '../styles/basket.css';
import Structure from "../components/Structure";
import '../styles/dashboard.css';
import Tail from "../components/Tail";

function Dashboard() {
    const [sortedAscending, setSortedAscending] = useState([]);  
    const [sortedDescending, setSortedDescending] = useState([]);
    const [currentView, setCurrentView] = useState("default"); 
    const [sortedProductsAscendingSales, setSortedProductsAscendingSales] = useState([]);  
    const [sortedProductsDescendingSales, setSortedProductsDescendingSales] = useState([]);
    const [sortedProductsAscendingRating, setSortedProductsAscendingRating] = useState([]);  
    const [sortedProductsDescendingRating, setSortedProductsDescendingRating] = useState([]);
    const [currentView1, setCurrentView1] = useState("default");
    const [currentView2, setCurrentView2] = useState("default"); 
            
    useEffect(() => {
        ShowHistory(); 
        showproducts();
    }, []);
    
const productImages = [
        '/1.png', // Updated path
        '/2.png',        // Updated path
        '/3.png',      // Updated path
    ];

    const ShowHistory = async () => {
        try {
            const response = await api.get("api/employees/list/");
            if (response.data && (response.status === 200 || response.status === 201)) {
                setSortedAscending([...response.data].sort((a, b) => a.amount - b.amount));        
                setSortedDescending([...response.data].sort((a, b) => b.amount - a.amount));        
            //    console.log("info:", response.data);
            } else {
           //     console.log("Failed to get user info", response.status);
                alert("Failed to get user info.");
            }
        } catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.response) {
           //     console.log("Response error data:", err.response.data);
           //     console.log("Response status:", err.response.status);
            //    console.log("Response headers:", err.response.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    };

    const showproducts = async () => {
        try {
            const response = await api.get("api/products/list/");
            if (response.data && (response.status === 200 || response.status === 201)) {
                setSortedProductsAscendingSales([...response.data].sort((a, b) => a.quantity_sold - b.quantity_sold));        
                setSortedProductsDescendingSales([...response.data].sort((a, b) => b.quantity_sold - a.quantity_sold)); 

                setSortedProductsAscendingRating([...response.data].sort((a, b) => a.rating - b.rating));        
                setSortedProductsDescendingRating([...response.data].sort((a, b) => b.rating - a.rating));
            } else {
             //   console.log("Failed to get user info", response.status);
                alert("Failed to get user info.");
            }
        } catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.response) {
            //    console.log("Response error data:", err.response.data);
             //   console.log("Response status:", err.response.status);
             //   console.log("Response headers:", err.response.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    };

    const renderHighestSold = () => (
        <div>
            {sortedAscending.length > 0 ? (
                <div>
                    {sortedAscending.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'left',
                                justifyContent: 'space-between',
                                backgroundColor: '#f9f9f9',
                                padding: '10px',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                width: '300px',
                            }}
                        >
                            <p style= {{margin: '3px'}}><strong>seller: {item.username}</strong></p>
                            <p style= {{margin: '3px'}}><strong>amount: {item.amount} </strong></p>
                            <button
                                onClick={() => {
                                    remove(item.id);
                                }}
                                style={{
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                    padding: '5px 10px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'background-color 0.3s ease',
                                    marginLeft: '20px',
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e60000')} 
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff4d4d')}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found in your history.</p>
            )}
        </div>
    );

    const renderLowestSold = () => (
        <div>
            {sortedDescending.length > 0 ? (
                <div>
                    {sortedDescending.map((item, index) => (
                        <div key={index} 
                        style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'space-between',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '300px',
                        }}
                        >
                            <p style= {{margin: '3px'}} ><strong>seller: {item.username}</strong></p>
                            <p style= {{margin: '3px'}}><strong>amount: {item.amount}</strong></p>
                            <button onClick={() => {remove(item.id)}} style= {{
                                    backgroundColor: '#ff4d4d',
                                    color: 'white',
                                    padding: '5px 10px',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'background-color 0.3s ease',
                                    marginLeft: '20px',
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = '#e60000')} 
                                onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff4d4d')} 
                                >Remove</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No products found in your history.</p>
            )}
        </div>
    );

    const remove = async (pk) => {
        try {
            const response = await api.delete(`api/employees/${pk}/delete-fire/`);
            if (response.data && (response.status === 200 || response.status === 201) || response.status === 204) {
          //      console.log("info:", response.data);
                ShowHistory(); // Recalculate charge after successful charge
            } else {
                console.log("Failed to get user info", response.status);
                alert("Failed to get user info.");    
            }
        } catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.response) {
           //     console.log("Response error data:", err.response.data);
           //     console.log("Response status:", err.response.status);
            //    console.log("Response headers:", err.response.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    };

    const renderEmployees = () => (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', content: 'center', justifyContent: 'center', alignItems: 'center', padding: '10px', borderRadius: '10px', gap: '20px'}}> 
            <h3 style={{alignContent: 'center', textAlign: 'center'}}>Sort by: </h3>
            
            <select
                value={currentView}
                onChange={(e) => setCurrentView(e.target.value)}
                className="product-sort-select"
            >
                <option>Select</option>
                <option value="highestSold">Lowest sales</option>
                <option value="lowestSold">Highest Sales</option>
            </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', maxWidth: 'fit-content' }}>
                {currentView === "highestSold" && renderHighestSold()}
                {currentView === "lowestSold" && renderLowestSold()}
            </div>
        </div>
    );

    const renderProducts = () => (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', content: 'center', justifyContent: 'center', alignItems: 'center', padding: '10px', borderRadius: '10px', gap: '20px'}}> 
            <h3 style={{alignContent: 'center', textAlign: 'center'}}>Sort by: </h3>
            <select onChange={(e) => setCurrentView1(e.target.value)}                           
            className="product-sort-select"

            >
                <option>Select</option>
                <option value="highestSales">Highest sales</option>
                <option value="lowestSales">Lowest Sales</option>
                <option value="highestRating">Highest Rating</option>
                <option value="lowestRating">Lowest Rating</option>
            </select>
</div>
{currentView1 === "highestSales" && (
                <div>
                    {sortedProductsDescendingSales.map((product, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '300px',
                        }}>
                            <img
                                src={productImages[Math.floor(Math.random() * productImages.length)]} // Use productImages.length for robustness
                                alt={product.name}
                                className="product-image"
                                style={{
                                    width: '110px',
                                    height: '110px', 
                                    marginLeft: '1px',
                                    marginRight: '10px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                             <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', marginLeft:'5px'}}> 
                                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Product: {product.name}</p> 
                                <p style={{ fontWeight: 'bold' }}>Sales: {product.quantity_sold}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}         

            {currentView1 === "lowestSales" && (
                <div>
                    {sortedProductsAscendingSales.map((product, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '300px',
                        }}>
                            <img
                                    src={productImages[Math.floor(Math.random() * productImages.length)]} // Use productImages.length for robustness
                                alt={product.name}
                                className="product-image"
                                style={{
                                    width: '110px', 
                                    height: '110px', 
                                    marginLeft: '1px',
                                    marginRight: '10px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', marginLeft:'5px'}}> 
                                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Product: {product.name}</p> 
                                <p style={{ fontWeight: 'bold' }}>Sales: {product.quantity_sold}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {currentView1 === "highestRating" && (
                <div>
                    {sortedProductsDescendingRating.map((product, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '300px',
                        }}>
                            <img
                                    src={productImages[Math.floor(Math.random() * productImages.length)]} // Use productImages.length for robustness
                                alt={product.name}
                                className="product-image"
                                style={{
                                    width: '110px', 
                                    height: '110px',
                                    marginLeft: '1px',
                                    marginRight: '10px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', marginLeft:'5px'}}> 
                                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Product: {product.name}</p>
                                <p style={{ fontWeight: 'bold' }}>Sales: {product.quantity_sold}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {currentView1 === "lowestRating" && (
                <div>
                    {sortedProductsAscendingRating.map((product, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'left',
                            justifyContent: 'left',
                            backgroundColor: '#f9f9f9',
                            padding: '10px',
                            borderRadius: '5px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            width: '300px',
                        }}>
                            <img
                                    src={productImages[Math.floor(Math.random() * productImages.length)]} // Use productImages.length for robustness
                                alt={product.name}
                                className="product-image"
                                style={{
                                    width: '110px',
                                    height: '110px', 
                                    marginLeft: '1px',
                                    marginRight: '10px',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', marginLeft:'5px'}}> 
                                <p style={{ marginBottom: '5px', fontWeight: 'bold' }}>Product: {product.name}</p> 
                                <p style={{ fontWeight: 'bold' }}>Sales: {product.quantity_sold}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div>
        <div className="dashboard-container">
            <Structure />
            <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '30px', marginBottom: '100px', marginLeft:'13px', marginRight:'13px', minHeight:"100vh" }}> 
                <h1 className="basket-header" style={{textAlign: 'center'}}>Dashboard</h1>
                <hr style={{ border: '1px solid #ccc', width: '100%' }} />

                <h3 style={{textAlign: 'center', fontSize:"1.5rem"}}>Choose what to show:</h3>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '20px 0' }}>
                    <button 
                        onClick={() => setCurrentView2("employees")} 
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'} 
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'} 
                    >
                        Employees Dashboard
                    </button>
                    <button 
                        onClick={() => setCurrentView2("products")} 
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        Products Dashboard
                    </button>
                </div>
                
                {currentView2 === "employees" && renderEmployees()}
                {currentView2 === "products" && renderProducts()}
            </div>
        </div>
        <Tail />
                </div>


    );
}

export default Dashboard;