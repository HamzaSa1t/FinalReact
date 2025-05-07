import RegisterForm from "../components/RegisterForm"
import Structure from "../components/Structure"
import React, { useState } from 'react';
import "../styles/background.css"
import Tail from "../components/Tail.jsx";

function Register() {

   return <div>

    <header className="header">
        
        <h1>Amazoo</h1>
        <p className="tagline">We sell products you love!</p>
    </header>    


<div  className="backl"> 
<RegisterForm/>
<br></br>
</div>

<Tail />

    </div>
}

export default Register

