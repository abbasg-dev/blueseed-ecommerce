import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import * as ROUTES from 'constants/routes'

type props = {
    children: JSX.Element
}

export const LoggedOutRoute = (props: props) => {

    const { children } = props
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

    if (isLoggedIn) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return children;
};