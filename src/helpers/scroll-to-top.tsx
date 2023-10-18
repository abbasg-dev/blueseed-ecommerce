import { useEffect } from "react";
import { useLocation } from "react-router";

type Props = { children: React.ReactNode };

const ScrollToTop = (props: Props) => {

    const { children } = props
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return <>{children}</>
};

export default ScrollToTop;