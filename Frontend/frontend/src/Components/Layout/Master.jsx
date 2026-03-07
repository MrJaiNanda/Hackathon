import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";


export default function Master(){
    return(
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
        </>
    );
}