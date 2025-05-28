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
          //      console.log("Charge:", response.data.balance);
                setCharge(response.data.balance);

            } else {
           //     console.log("Failed to get user info", response.status);
                alert("Failed to get user info.");
            }
        }catch (err) {
            console.log("Error during fetching user info:", err);
            if (err.response) {
          //      console.log("Response error data:", err.response.data);
          //      console.log("Response status:", err.response.status);
           //     console.log("Response headers:", err.response.headers);
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
            const amount = e.target.elements.amount.value;
       //     console.log("+++Amount:", amount); 

            const response = await api.post("api/customers/charge/", {increament : amount } );
            if (response.data && (response.status === 200 || response.status === 201)) {
                ShowBalance(); 
                e.target.reset(); // Clear the input after successful submit
            } else {
         //       console.log("Failed to charge", response.status);
                alert("Failed to charge.");
            }
        }
         catch (err) {
        console.log("Error during fetching user info:", err);
            if (err.response) {
         //       console.log("Response error data:", err.response.data);
           //     console.log("Response status:", err.response.status);
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

        

<div  style={{ height: '100vh', backgroundColor: 'white', marginLeft: "20px", marginRight: "20px", paddingTop: '5px', paddingBottom: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '150px', minHeight: "100vh" }}>

<div className="charge-container">
            <h1 style={{textAlign: 'center', paddingTop: '20px'}}>Balance</h1>
            <hr style={{ border: '1px solid #ccc', width: '95%' }} />
            <h2 style={{
                marginTop: '10px',
                backgroundColor: '#4CAF50',
                borderRadius: '5px',
                padding: '10px',
                display: 'inline-block',
                marginBottom: '10px',
                marginRight: '35px',
                color: 'white',
                textAlign: 'center',
                marginLeft: '35px',
            }}>your current Amount: ${charge}</h2>
        </div>

<form onSubmit={handleSubmit} style={{ marginTop: '20px', backgroundColor: '#f9f9f9', padding: '20px' }}>
    <div className="form-group">
        <h2 htmlFor="amount" style={{textAlign: "center"}}>Add Amount:</h2>
        <input placeholder="insert in dollars $" type="number" id="amount" name="amount" required onInput={(e) => {if (e.target.value < 1) e.target.value = ""; }} style={{ backgroundColor: '#f9f9f9'}}/>
    </div>
    <div style={{ textAlign: 'center' }}>
        <button type="submit"  style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius:'5px', height:'40px', width:'90px', marginTop:'20px'}}>Add</button>
    </div>
</form>

</div>
<Tail/>

        </div>

    )
     
     
     }
     
     export default Charge