import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/store'
import { clearItems, removeItem, changeItemQuantity } from 'store/slices/cartSlice'
import { useMutation } from 'react-query';
import { CreateOrder, Estimate } from 'api/services/cart.services';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import AgGrid from 'components/ag-grid/ag-grid.component';
import Shipping from 'components/shipping/shipping.component';
import { CellValueChangedEvent, GroupCellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import NumericEditor from 'helpers/numeric-editor';
import { CartOrderModel } from 'interfaces/cart.model';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CartCard from 'components/cart-card/cart-card.component';
import { ShippingMethod } from 'interfaces/orders.model';
import placeholder from 'assets/images/placeholder-image.png';

const Cart = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));
    const items = useSelector((state: RootState) => state.cart.items)
    const dispatch = useDispatch()
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const [openError, setOpenError] = useState<boolean>(false)
    const [shippingCost, setShippingCost] = useState<number>(0)
    const notificationSeverity = useRef<number>(0)
    const selectedInfo = useRef<number>()
    const selectedMethod = useRef<number>()

    const columns = [
        {
            headerName: "Item",
            flex: 2,
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <Stack direction="row" pl={4} justifyContent="center" alignItems="center">
                        <Box width={60} height={60} sx={{ borderRadius: "17px", overflow: "hidden", flexShrink: 0 }}>
                            <img
                                src={params.data.imageUrl ?? placeholder}
                                alt=""
                                width="100%"
                            />
                        </Box>
                        <Stack p={1}>
                            <Box>{params.data?.itemNumber}</Box>
                            <Box sx={{ mt: "auto" }}>{params.data?.manufacturerName}</Box>
                        </Stack>
                    </Stack>
                )
            },
            cellClass: 'no-center'
        },
        {
            headerName: "Item description",
            field: "itemDescription",
            flex: 1,
            cellStyle: () => ({ fontSize: '13px', padding: '0 30px' }),
            cellClass: 'no-center'
        },
        {
            headerName: "Item Price",
            field: "itemPrice",
            flex: 1,
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value}` : '',
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "Qty",
            field: "quantity",
            flex: 1,
            editable: true,
            cellEditor: NumericEditor,
            cellEditorPopup: true,
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <Box sx={{ p: 1.5, borderRadius: "6px", bgcolor: "customGrey.main", display: "inline-block" }}>
                        <Typography variant='subtitle2'>
                            {params.value}
                        </Typography>
                    </Box>
                )
            },
        },
        {
            headerName: "Sub total",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => `$ ${params.getValue("itemPrice") * params.getValue("quantity")}`,
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            flex: 1,
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <IconButton onClick={() => dispatch(removeItem({ ...params.data }))}>
                        <RemoveIcon />
                    </IconButton>
                )
            },
        }
    ]

    const estimateMutation = useMutation(Estimate,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
                dispatch(clearItems())
                setTimeout(() => {
                    navigate(`/${ROUTES.MYORDERS}/${ROUTES.ORDERS}`)
                }, 2000);
            },
            onError() {
                notificationSeverity.current = 2
                setOpenNotification(true)
            },
        }
    )

    const orderMutation = useMutation(CreateOrder,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
                dispatch(clearItems())
                setTimeout(() => {
                    navigate(`/${ROUTES.MYORDERS}/${ROUTES.ORDERS}`)
                }, 2000);
            },
            onError() {
                notificationSeverity.current = 2
                setOpenNotification(true)
            },
        }
    )

    const onQuantityChange = (event: CellValueChangedEvent) => {
        dispatch(changeItemQuantity({ ...event.data }))
    }

    const requestEstimate = () => {
        if (checkIfValid()) {
            let mutateData = {
                date: new Date(),
                itemOrders: items.map(item => {
                    return (
                        {
                            itemHubId: item.itemHubId,
                            quantity: item.quantity,
                            price: item.itemPrice ?? 0,
                        }
                    )
                }),
                toPick: false,
                origin: 2,
                shippingInfoId: selectedInfo.current,
                shippingMethodId: selectedMethod.current
            } as CartOrderModel
            estimateMutation.mutate(mutateData)
        } else {
            setOpenError(true)
        }
    }

    const placeOrder = () => {
        if (checkIfValid()) {
            let mutateData = {
                date: new Date(),
                itemOrders: items.map(item => {
                    return (
                        {
                            itemHubId: item.itemHubId,
                            quantity: item.quantity,
                            price: item.itemPrice ?? 0,
                        }
                    )
                }),
                toPick: false,
                origin: 2,
                shippingInfoId: selectedInfo.current,
                shippingMethodId: selectedMethod.current
            } as CartOrderModel
            orderMutation.mutate(mutateData)
        } else {
            setOpenError(true)
        }
    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
        setOpenError(false)
    };

    const setShippingMethod = (method: ShippingMethod) => {
        setShippingCost(method.cost)
        selectedMethod.current = method.shippingMethodId
    }

    const setShippingInfo = (id: string) => {
        selectedInfo.current = Number(id)
    }

    const getSubTotal = () => {
        let total = 0
        for (let item of items)
            total += item.itemPrice * item.quantity
        return total
    }

    const getTaxTotal = () => {
        let total = 0
        for (let item of items)
            if (item.taxable)
                total += (item.itemPrice * item.quantity * item.taxAmount) / 100
        return total
    }

    const checkIfValid = () => {
        if (!selectedInfo.current)
            return false
        if (!selectedMethod.current)
            return false
        if (items.length === 0)
            return false
        else {
            for (let item of items)
                if (item.quantity === 0)
                    return false
        }
        return true
    }

    return (
        <Box padding={3} sx={{ bgcolor: "grey.50" }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={{ xs: 1, md: 2 }} alignItems={{ xs: "normal", md: "center" }} sx={{ mb: 2 }}>
                <Typography variant="h4" component="h1" >
                    My cart
                </Typography>
                {items && items.length > 0 &&
                    <Typography variant="subtitle1" component="span">
                        Displaying {items.length} item{items.length > 1 ? "s" : ""}
                    </Typography>
                }
            </Stack>
            <Paper sx={{ py: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Box
                            className='cart-grid'
                            sx={{
                                display: "grid",
                                gridTemplateRows: { xs: 'auto 1fr', md: '1fr 200px' },
                                height: "100%"
                            }}
                        >
                            {isMdOrLess ?
                                <Stack mb={2}>
                                    {items.map(item => <CartCard product={item} key={item.itemId} />)}
                                </Stack>
                                :
                                <AgGrid rows={JSON.parse(JSON.stringify(items))} columns={columns} rowHeight={90} onCellValueChanged={onQuantityChange} />

                            }
                            <Box px={3}>
                                <Divider />
                                <Stack mt={{ xs: 2, md: 5 }} direction={{ xs: "column", md: "row" }} spacing={1} alignItems="center">
                                    <Button variant="outlined" size="large" color="secondary" sx={{ minWidth: "200px", py: 1.5, borderRadius: "50px" }}
                                        component={RouterLink} to={`/${ROUTES.PRODUCTS}`}
                                    >
                                        Continue Shopping
                                    </Button>
                                    <Button variant="contained" size="large" color="secondary" sx={{ minWidth: "200px", py: 1.5, borderRadius: "50px", bgcolor: "common.black" }}
                                        onClick={() => dispatch(clearItems())}
                                    >
                                        Clear Shopping Cart
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Shipping showSelect={true} onMethodChange={setShippingMethod} onInfoChange={setShippingInfo} />
                        <Box bgcolor="customGrey.main" p={2}>
                            <Typography variant="h5" component="h2" fontWeight={500} mb={4}>
                                Summary
                            </Typography>
                            <Box px={{ xs: 0, md: 2 }}>
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Subtotal
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${getSubTotal()}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Shipping
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${shippingCost.toLocaleString()}
                                    </Typography>
                                </Stack>
                                <Typography variant="caption" color="grey.400" width="60%" component="div" mb={1}>
                                    (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
                                </Typography>
                                <Stack direction="row" justifyContent="space-between" mb={3}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Tax
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${getTaxTotal()}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mb={3}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Order Total
                                    </Typography>
                                    <Typography variant="h6" fontWeight={500}>
                                        ${getSubTotal() + shippingCost + getTaxTotal()}
                                    </Typography>
                                </Stack>
                                <Stack px={2}>
                                    <Button variant="contained" color="secondary" size="large" sx={{ mx: "auto", mb: 1, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                        onClick={requestEstimate}
                                    >
                                        Request estimate
                                    </Button>
                                    <Typography variant="subtitle1" color="grey.700" mb={2.5}>
                                        Click the button to get a shipping estimate other wise continue with create order.
                                    </Typography>
                                    <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                        onClick={placeOrder}
                                    >
                                        Create Order
                                    </Button>
                                    <Button variant="outlined" size="large" color="secondary" sx={{ mx: "auto", mb: 1, minWidth: "244px", py: 1.5, borderRadius: "50px", color: "common.black", bgcolor: "common.white" }}
                                        component={RouterLink} to={`/${ROUTES.PRODUCTS}`}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity={notificationSeverity.current === 1 ? "success" : "error"}>
                    {notificationSeverity.current === 1 ?
                        "Request sent successfully"
                        :
                        "Failed to send request"
                    }
                </MuiAlert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="error">
                    {(!selectedInfo.current || !selectedMethod.current) ?
                        "Please choose the shipping info"
                        :
                        "Invalid Items Quantity"
                    }
                </MuiAlert>
            </Snackbar>
        </Box>
    )
}

export default Cart;