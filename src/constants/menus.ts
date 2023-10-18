import * as ROUTES from 'constants/routes'

export const orders = [
    { text: 'Orders', url: `/${ROUTES.MYORDERS}/${ROUTES.ORDERS}` },
    { text: 'Credit memo', url: `/${ROUTES.MYORDERS}/${ROUTES.CREDITMEMO}` },
    { text: 'Payment history', url: `/${ROUTES.MYORDERS}/${ROUTES.PAYMENTHISTORY}` },
]