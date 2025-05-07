import { useEffect, useState } from "react";
import api from "../api";
import React from "react";
import '../styles/basket.css'; 
import Structure from "../components/Structure";
import Tail from "../components/Tail";
function Charge() {
const [charge, setCharge] = useState(""); 
    useEffect(() => {
        ShowBalance(); 
    }, []);

    const ShowBalance = async () => {
        try {
            const response = await api.get("api/balance/")
            if (response.data && (response.status === 200 || response.status === 201)) {
             //   console.log("Charge:", response.data.balance);
                setCharge(response.data.balance);
            } else {
                console.log("Failed to get user info", response.status);
                alert("Failed to get user info.");
            }
        }catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.response) {
            //    console.log("Response error data:", err.response.data);
            //    console.log("Response status:", err.response.status);
             //   console.log("Response headers:", err.response.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    };
    const handleSubmit = async (e) => {
        try{
            e.preventDefault(); 
            const response = await api.post("api/customers/charge/", {increament : amount } );
            if (response.data && (response.status === 200 || response.status === 201)) {
                ShowBalance(); 
            } else {
               // console.log("Failed to charge", response.status);
                alert("Failed to charge.");
            }
        }
         catch (err) {
        console.log("Error during fetching user info:", err);
            if (err.response) {
         //       console.log("Response error data:", err.response.data);
          //      console.log("Response status:", err.response.status);
           //     console.log("Response headers:", err.response.headers);
            }
            if (err.request) {
                console.log("Request error:", err.request);
            }
            alert("Error occurred during fetching user info.");
        }
    }
   

    return(
    
        <div> 

<Structure/>

<div style={{ backgroundColor: 'white', marginTop: '20px', marginBottom:'20px', height: '100vh', textAlign: 'center' , marginLeft:'13px', marginRight:'13px' }}>
<h1> BALANCE</h1>            
<hr style={{ border: '1px solid #ccc', width: '1005' }} />
<h1 style={{
     backgroundColor: '#4CAF50',
                borderRadius: '5px',
                padding: '10px',
                marginRight: '30px',
                color: 'white',
                display: 'inline-block',
                textAlign: 'center',}}>your current Amount: ${charge}</h1>
        </div>
        <Tail/>
        </div>

    )
     
     
     }
     
     export default Charge

