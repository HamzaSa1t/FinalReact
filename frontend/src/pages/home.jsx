import { useState, useEffect, useRef } from "react";
import api from "../api";
import "../styles/home.css"
import "../components/Structure.jsx"
import Structure from "../components/Structure.jsx";
import { useNavigate } from 'react-router-dom';
import ToDelete from "../components/DeleteProduct.jsx";
import React from "react";
import { useParams } from 'react-router-dom';
import "../components/Tail.jsx";
import Tail from "../components/Tail.jsx";
import waiting from "../components/waiting.jsx";


function Home() {
    const { pk } = useParams();
    const [length, setLength] = useState(""); 
    const [UserType, setUserType] = useState("");
    const [UserId, setUserId] = useState("");
    const [products, setProducts] = useState([]); 
    const [seller, setSeller] = useState("");
    const navigate = useNavigate();
    const scrollableDivRef = useRef(null); 

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
        api.get("api/UserDetails/").then((res) => res.data.profile_user.user_type).then((user_type) => {setUserType(user_type);}).catch((err) => alert(err));};

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

    const ToCart = async (pk) => {
        try {
            const response = await api.patch("api/chart/add/", { "Product_id": pk, "quantity": 1 })
            if (response.status === 201 || response.status === 200) {
                console.log("data sent successfuly");
              //  console.log(response);
            } else {
                console.log("Failed to add balance", response.status);
            }
        } catch (err) {
            console.log("Error during adding balance:", err);
        }
    }
    const CustomerHomePageContent = () => {
        return <div></div>;
    };

    const ManagerHomePageContent = () => {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        </div>;
    };

    const EmployeeHomePageContent = () => {
        return (
            <div>
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
        <div style={{margin:'0px'}}>
            <Structure />
            <ContentComponent />
                {products.length === 0 ? (         
null
                ) : (

                    <div className="products-list">
                        {products.map((product) => (
                            <div key={product.id} className="product-item" style={{ position: 'relative', cursor: 'pointer' }} 
                                onClick={() => navigate(`/ViewProduct/${product.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.cursor = 'pointer'} 
                                onMouseLeave={(e) => e.currentTarget.style.cursor = 'default'} 
                            >   
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {product.picture && <img src="/5.png" alt={product.name} className="product-image" style={{
                                  maxWidth: '100%',
                                  maxHeight: '350px', 
                                  height: 'auto'
                                }} />}
                                </div>
                                <h1 style={{ marginBottom:'0px'}}>{product.name}</h1>
                                <hr style={{ border: '1px solid #ccc', width: '100%'}} />
                                <h4>Seller: {product.seller}</h4>
                                <h4>{product.created_at.split('T')[0]}</h4>
                                <br></br>
                                <div style={{ display: 'flex', flexDirection: 'row', }} onClick={(e) => e.stopPropagation()}>
                                 
                                {(UserId === product.seller) && <button style={{ backgroundColor: '#4CAF50' }} onClick={(e) => {
                                        e.stopPropagation(); 
                                        ToEdit(product.id)
                                    }}>Edit</button>}

                                    <br></br>

                                    {(UserType === "Customer") && <button onClick={(e) => {
                                        e.stopPropagation();  
                                        ToCart(product.id)
                                    }}>Add to cart</button>}

                                    <br></br>

                                    <ToDelete pk={product.id} UserId={UserId} onProductDeleted={() => {

                                        saveScrollPosition();

                                        getProducts();

                                    }} />

                                </div>
                                <br></br>
                                <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                                    <h1>${product.price}</h1>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                            <Tail/>
        </div>
    );
}
export default Home;