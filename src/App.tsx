import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { theme } from 'constants/theme'
import { QueryClientProvider, QueryClient } from 'react-query'
import * as ROUTES from 'constants/routes'
import Home from "pages/home";
import Layout from 'pages/layout';
import Orders from 'pages/my-orders/orders';
import Products from 'pages/products/products';
import PaymentHistory from 'pages/my-orders/payment-history';
import CreditMemo from 'pages/my-orders/credit-memo';
import OrderDetails from 'pages/my-orders/order-details';
import Updates from 'pages/updates/updates';
import Contact from 'pages/contact/contact';
import Cart from 'pages/cart/cart';
import Login from 'pages/login/login';
import RmaHistory from 'pages/rma/history';
import RmaRequest from 'pages/rma/request';
import RmaDetails from 'pages/rma/rma-details';
import ScrollToTop from 'helpers/scroll-to-top';
import { LoggedOutRoute } from 'helpers/routes';

const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <ScrollToTop>
            <Routes>
              <Route path={ROUTES.HOME} element={<Layout />} >
                <Route index element={<Home />} />
                <Route path={ROUTES.MYORDERS} element={<Outlet />}>
                  <Route index element={<Navigate replace to={ROUTES.ORDERS} />} />
                  <Route path={ROUTES.ORDERS} element={<Orders />} />
                  <Route path={ROUTES.PAYMENTHISTORY} element={<PaymentHistory />} />
                  <Route path={ROUTES.CREDITMEMO} element={<CreditMemo />} />
                  <Route path={ROUTES.ORDERDETAILS} element={<OrderDetails />} />
                  <Route path={ROUTES.CREDITMEMODETAILS} element={<OrderDetails />} />
                </Route>
                <Route path={ROUTES.RMA} element={<Outlet />}>
                  <Route index element={<RmaHistory />} />
                  <Route path={ROUTES.RMADETAILS} element={<RmaDetails />} />
                  <Route path={ROUTES.RMAREQUEST} element={<RmaRequest />} />
                </Route>
                <Route path={ROUTES.MYCART} element={<Cart />} />
                <Route path={ROUTES.UPDATES} element={<Updates />} />
                <Route path={ROUTES.PRODUCTS} element={<Products />} />
                <Route path={ROUTES.CONTACT} element={<Contact />} />
              </Route>
              <Route path={ROUTES.LOGIN} element={<LoggedOutRoute><Login /></LoggedOutRoute>} />
              <Route path="*" element={<Navigate replace to={ROUTES.HOME} />} />
            </Routes>
          </ScrollToTop>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
