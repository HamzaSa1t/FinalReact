import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx"
import Home from "./pages/home.jsx"
import NotFound from "./pages/notFound.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Logout from "./components/logout.jsx"
import Profit from "./pages/profit.jsx"
import Charge from "./pages/charge.jsx"
import Dashboard from "./pages/dashboard.jsx"
import History from "./pages/history.jsx"
import AddProduct from "./components/AddProduct.jsx"
import Products from "./components/product.jsx"
import EditProduct from "./pages/EditProduct.jsx"
import ViewProduct from "./pages/ViewProduct.jsx"
import AddBalance from "./pages/AddBalance.jsx"
import Basket from "./pages/basket.jsx"
import Structure from "./components/Structure.jsx"
// import ProductDetails from "./pages/ProductDetails.jsx"
import EmployeeHistory from "./pages/EmployeeHistory.jsx"
import Tail from "./components/Tail.jsx"
function App() {
  return (
    <BrowserRouter> <Routes>
      
      <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/> 
      <Route path="/charge"element={<ProtectedRoute><Charge/></ProtectedRoute>}/>
      <Route path="/dashboard"element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
      <Route path="/history"element={<ProtectedRoute><History/></ProtectedRoute>}/>
      <Route path="/profit"element={<ProtectedRoute><Profit/></ProtectedRoute>}/>
      <Route path="/ShowProducts"element={<ProtectedRoute><Products/></ProtectedRoute>}/>
      <Route path="/editProduct/:pk"element={<ProtectedRoute><EditProduct/></ProtectedRoute>}/>
      <Route path="/ViewProduct/:pk"element={<ProtectedRoute><ViewProduct/></ProtectedRoute>}/>
      <Route path="/AddProduct"element={<ProtectedRoute><AddProduct/></ProtectedRoute>}/>"
      <Route path="/AddBalance"element={<ProtectedRoute><AddBalance/></ProtectedRoute>}/>
      <Route path="/Basket/:pk"element={<ProtectedRoute><Basket/></ProtectedRoute>}/>
      <Route path="/structure/:pk" element={<Structure />} />
      {/* <Route path="/product/:pk" element={<ProductDetails />} /> */}
      <Route path="/employeeHistory" element={<ProtectedRoute><EmployeeHistory/></ProtectedRoute>}/>
      <Route path="/tail" element={<Tail />} />






        

        <Route path="/login" element={<Login/>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register/>} />
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
