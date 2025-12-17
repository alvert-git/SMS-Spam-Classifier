import Header from "../common/Header";
import Footer from "../common/Footer"
import { Outlet } from "react-router-dom";
const UserLayout = () => {
    return (
        <>
            {/* header*/}
            <Header />
           {/* main */}
            <main>
                <Outlet/>
            </main>
            {/* footer */}
            <Footer/>
        </>
    );
};


export default UserLayout;