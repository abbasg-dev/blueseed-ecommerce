import Header from "components/header/header.component";
import Footer from "components/footer/footer.component";
import { Outlet } from "react-router-dom";

const Layout = () => {


    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout;