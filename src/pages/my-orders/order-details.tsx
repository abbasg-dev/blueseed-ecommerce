import { useState, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { getCreditById, getOrderById } from 'api/services/orders.services';
import { CreditDetails, OrderInfo, OrderItem, ShippingMethod } from 'interfaces/orders.model';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Shipping from 'components/shipping/shipping.component';
import AgGrid from 'components/ag-grid/ag-grid.component';
import { CellValueChangedEvent, ColDef, GroupCellRendererParams, ValueGetterParams } from 'ag-grid-community';
import NumericEditor from 'helpers/numeric-editor';
import { Link as RouterLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import { statusEnum, invoiceState } from './statusEnum'
import { useTheme } from '@mui/material/styles';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { CartOrderModel } from 'interfaces/cart.model';
import { ConfirmOrder, EditEstimate, EditOrder, ReceiveOrder } from 'api/services/cart.services';
import placeholder from 'assets/images/placeholder-image.png';

const OrderDetails = () => {

    const { pathname } = useLocation()
    const navigate = useNavigate();
    const { id } = useParams();
    const theme = useTheme();
    const [orderItems, setOrderItems] = useState<OrderItem[]>()
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const [openError, setOpenError] = useState<boolean>(false)
    const [shippingCost, setShippingCost] = useState<number>(0)
    const notificationSeverity = useRef<number>(0)
    const selectedInfo = useRef<number>()
    const selectedMethod = useRef<number>()

    const isCredit = pathname.includes(ROUTES.CREDITMEMO)

    const { data: orderData } = useQuery<OrderInfo>(['order', id], () => getOrderById(id),
        {
            enabled: !!id && !isCredit,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setOrderItems(data.itemOrders)
                setShippingCost(data.shipCost)
                if (data.shippingInfo)
                    selectedInfo.current = data.shippingInfo.shippingInfoId
                if (data.shippingMethod)
                    selectedMethod.current = data.shippingMethod.shippingMethodId
            }
        });

    const { data: creditData } = useQuery<CreditDetails>(['credit', id], () => getCreditById(id),
        {
            enabled: !!id && isCredit,
            onSuccess: (data) => {
                setOrderItems(data.items)
            }
        });

    const orderMutation = useMutation(EditOrder,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
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

    const estimateMutation = useMutation(EditEstimate,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
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

    const receiveMutation = useMutation(ReceiveOrder,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
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

    const confirmMutation = useMutation(ConfirmOrder,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
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

    const columns: ColDef[] = [
        {
            headerName: "Item",
            flex: 1,
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <Stack direction="row" pl={4} alignItems="center" justifyContent="center">
                        <Box width={60} height={60} sx={{ borderRadius: "17px", overflow: "hidden", flexShrink: 0 }}>
                            <img
                                src={params.data.imageUrl ?? placeholder}
                                alt=""
                                width="100%"
                            />
                        </Box>
                        <Stack p={1} width="100%">
                            <Box>{params.data?.itemNumber}</Box>
                            <Box sx={{ mt: "auto" }}>{params.data?.description}</Box>
                        </Stack>
                    </Stack>
                )
            },
            cellClass: 'no-center'
        },
        {
            headerName: "Item Price",
            field: "price",
            flex: 1,
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value}` : '',
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "Qty",
            field: "quantity",
            flex: 1,
            editable: !isCredit && (orderData?.status === 1 || orderData?.status === 8) ? true : false,
            cellEditor: NumericEditor,
            cellEditorPopup: true,
            cellRenderer: (params: GroupCellRendererParams) => {
                if (!isCredit && (orderData?.status === 1 || orderData?.status === 8))
                    return (
                        <Box sx={{ p: 1.5, borderRadius: "6px", bgcolor: "customGrey.main", display: "inline-block" }}>
                            <Typography variant='subtitle2'>
                                {params.value}
                            </Typography>
                        </Box>
                    )
                return params.value
            },
        },
        {
            headerName: "Sub total",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => `$ ${params.getValue("price") * params.getValue("quantity")}`,
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "Action",
            flex: 1,
            hide: isCredit || orderData?.status !== 1,
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <IconButton onClick={() => removeItem({ ...params.data })}>
                        <RemoveIcon />
                    </IconButton>
                )
            },
        }
    ]

    const getStatusColor = (status: number) => {
        let color
        switch (status) {
            case 1:
                color = theme.palette.success.main
                break;
            case 2:
                color = theme.palette.customOrange.main
                break;
            case 3:
                color = theme.palette.customOrange.main
                break;
            case 4:
                color = theme.palette.info.main
                break;
            case 5:
                color = theme.palette.info.main
                break;
            case 6:
                color = theme.palette.error.main
                break;
            case 7:
                color = theme.palette.customOrange.main
                break;
            case 8:
                color = theme.palette.grey[500]
                break;
            case 9:
                color = theme.palette.primary.main
                break;
            default:
                color = theme.palette.primary.main
        }
        return color
    }

    const getStateColor = (status: number) => {
        let color
        switch (status) {
            case 1:
                color = theme.palette.grey[500]
                break;
            case 2:
                color = theme.palette.success.main
                break;
            default:
                color = theme.palette.primary.main
        }
        return color
    }

    const getItemsQuantity = () => {
        let total = 0
        if (orderItems)
            for (let item of orderItems)
                total += Number(item.quantity)
        return total
    }

    const getSubTotal = () => {
        let total = 0
        if (orderItems)
            for (let item of orderItems)
                total += item.price * item.quantity
        return total
    }

    const getTaxTotal = () => {
        let total = 0
        if (orderItems)
            for (let item of orderItems)
                if (item.taxable)
                    total += (item.price * item.quantity * item.taxAmount) / 10
        return total
    }

    const removeItem = (item: OrderItem) => {
        setOrderItems(items => items?.filter(i => i.itemOrderId !== item.itemOrderId))
    }

    const onQuantityChange = (event: CellValueChangedEvent) => {
        setOrderItems(items => items?.map(item => {
            if (item.itemHubId === event.data.itemHubId)
                return { ...item, quantity: Number(event.data.quantity) }
            return item
        }))
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

    const updateOrder = () => {
        if (checkIfValid()) {
            let mutateData = {
                id,
                date: orderData?.orderDate,
                itemOrders: orderItems?.map(item => {
                    return (
                        {
                            itemHubId: item.itemHubId,
                            quantity: Number(item.quantity),
                            price: item.price ?? 0,
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

    const updateEstimate = () => {
        if (checkIfValid()) {
            let mutateData = {
                id,
                date: orderData?.orderDate,
                itemOrders: orderItems?.map(item => {
                    return (
                        {
                            itemHubId: item.itemHubId,
                            quantity: Number(item.quantity),
                            price: item.price ?? 0,
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

    const acknowledgeReceive = () => {
        if (id)
            receiveMutation.mutate(id)
    }

    const confirmOrder = () => {
        if (id)
            confirmMutation.mutate(id)
    }

    const checkIfValid = () => {
        if (!selectedInfo.current)
            return false
        if (!selectedMethod.current)
            return false
        if (orderItems?.length === 0)
            return false
        else if (orderItems) {
            for (let item of orderItems)
                if (item.quantity === 0)
                    return false
        }
        return true
    }

    return (
        <Box py={2} px={{ xs: 1, md: 8 }} bgcolor="grey.50">
            <Button
                variant="text" color="secondary"
                startIcon={<ArrowIcon className='flip' width={24} height={24} />}
                sx={{ color: "common.black", mb: 2.5 }}
                component={RouterLink} to={`/${ROUTES.MYORDERS}/${isCredit ? ROUTES.CREDITMEMO : ROUTES.ORDERS}`}
            >
                <Typography variant='h4' component='h1'>{isCredit ? `${creditData?.invoiceNumber ?? ""}` : `${orderData?.orderNumber ?? ""}`}</Typography>
            </Button>
            <Paper sx={{ py: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <Stack height="100%">
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, px: 2.5, mb: 3 }}>
                                <Box>
                                    <Typography variant='subtitle2'>{isCredit ? "CM Number" : "Order Number"}</Typography>
                                    {orderData &&
                                        <Typography variant='subtitle1'>{orderData.orderNumber}</Typography>
                                    }
                                    {creditData &&
                                        <Typography variant='subtitle1'>{creditData.invoiceNumber}</Typography>
                                    }
                                </Box>
                                <Box>
                                    <Stack direction="row" justifyContent="space-between" mb={3}>
                                        <Stack direction="row" spacing={2.5}>
                                            <Typography variant='subtitle1'>Status</Typography>
                                            {orderData &&
                                                <Typography variant='subtitle1' sx={{ color: getStatusColor(orderData.status) }}>
                                                    {statusEnum[orderData.status]}
                                                </Typography>
                                            }
                                            {creditData &&
                                                <Typography variant='subtitle1' sx={{ color: getStateColor(creditData.invoiceState) }}>
                                                    {invoiceState[creditData.invoiceState]}
                                                </Typography>
                                            }
                                        </Stack>
                                        <Stack direction="row" spacing={2.5}>
                                            <Typography variant='subtitle1'>{isCredit ? "CM Date" : "Order Date"}</Typography>
                                            {orderData &&
                                                <Typography variant='subtitle1'>{orderData.orderDate ? new Date(orderData.orderDate).toLocaleDateString() : ''}</Typography>
                                            }
                                            {creditData &&
                                                <Typography variant='subtitle1'>{creditData.invoiceDate ? new Date(creditData.invoiceDate).toLocaleDateString() : ''}</Typography>
                                            }
                                            {!orderData && !creditData &&
                                                <Box width="82px" />
                                            }
                                        </Stack>
                                    </Stack>
                                    <Stack direction="row" spacing={2.5}>
                                        <Typography variant='subtitle1'>Total Items</Typography>
                                        {orderData &&
                                            <Typography variant='subtitle1'>{orderData.itemsQuantity}</Typography>
                                        }
                                        {creditData &&
                                            <Typography variant='subtitle1'>{creditData.items.length}</Typography>
                                        }
                                    </Stack>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', px: 2.5 }}>
                                <Box>
                                    <Typography variant='subtitle2'>Amount</Typography>
                                    {orderData &&
                                        <Typography variant='subtitle1'>${(orderData.total).toLocaleString()}</Typography>
                                    }
                                    {creditData &&
                                        <Typography variant='subtitle1'>${creditData.total?.toLocaleString()}</Typography>
                                    }
                                    {!orderData && !creditData &&
                                        <Box height="28px" />
                                    }
                                </Box>
                                <Stack direction="row" spacing={2.5}>
                                    <Typography variant='subtitle1'>Quantity</Typography>
                                    <Typography variant='subtitle1'>{getItemsQuantity()}</Typography>
                                </Stack>
                            </Box>
                            <Box flexGrow={1} className="cart-grid" px={1}>
                                <AgGrid rows={orderItems} columns={columns} rowHeight={90} onCellValueChanged={onQuantityChange} />
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} pr={5}>
                        <Shipping
                            showSelect={!isCredit && (orderData?.status === 1 || orderData?.status === 8)}
                            propsInfo={orderData?.shippingInfo}
                            propsMethod={orderData?.shippingMethod}
                            onMethodChange={setShippingMethod}
                            onInfoChange={setShippingInfo}
                        />
                        <Box bgcolor="customGrey.main" p={2} px={3} my={3}>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', mb: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" sx={{ color: "grey.600" }}>
                                        Quantity
                                    </Typography>
                                    <Typography variant='h6'>{getItemsQuantity()}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" sx={{ color: "grey.600" }}>
                                        Total ITEMS
                                    </Typography>
                                    {orderData &&
                                        <Typography variant='h6'>{orderData.itemsQuantity}</Typography>
                                    }
                                    {creditData &&
                                        <Typography variant='h6'>{creditData.items.length}</Typography>
                                    }
                                </Stack>
                            </Box>
                            <Stack direction="row" justifyContent="space-between" mb={2}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                    Subtotal
                                </Typography>
                                {orderData && <Typography variant='subtitle2'>${orderData?.status === 1 ? getSubTotal().toLocaleString() : orderData?.subTotal}</Typography>}
                                {creditData && <Typography variant='subtitle2'>${creditData?.subTotal}</Typography>}
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight={500}>
                                    Shipping
                                </Typography>
                                {orderData &&
                                    <Typography variant='subtitle2'>${orderData.status === 1 ? shippingCost : orderData.shipCost?.toLocaleString()}</Typography>
                                }
                                {creditData &&
                                    <Typography variant='subtitle2'>${creditData.shipCost?.toLocaleString()}</Typography>
                                }
                            </Stack>
                            <Typography variant="caption" color="grey.400" width="60%" component="div" mb={1}>
                                (Standard Rate - Price may vary depending on the item/destination. TECS Staff will contact you.)
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" mb={3}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                    Tax
                                </Typography>
                                {orderData &&
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${orderData?.status === 1 ? getTaxTotal() : orderData?.taxTotal?.toLocaleString()}
                                    </Typography>
                                }
                                {creditData &&
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${creditData?.taxTotal?.toLocaleString()}
                                    </Typography>
                                }
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={3}>
                                <Typography variant="subtitle2" fontWeight={500}>
                                    Discount
                                </Typography>
                                {orderData &&
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${orderData?.discount}
                                    </Typography>
                                }
                                {creditData &&
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${creditData?.discount ?? 0}
                                    </Typography>
                                }
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="subtitle2" fontWeight={500}>
                                    Order Total
                                </Typography>
                                {orderData &&
                                    <Typography variant='subtitle2'>${orderData?.status === 1 ? (getSubTotal() + shippingCost + getTaxTotal() - orderData.discount).toLocaleString() : (orderData?.total)}</Typography>
                                }
                                {creditData &&
                                    <Typography variant='subtitle2'>${getSubTotal().toLocaleString()}</Typography>
                                }

                            </Stack>
                        </Box>
                        {!isCredit &&
                            <Stack px={2}>
                                {orderData?.status === 1 &&
                                    <>
                                        <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={updateOrder}
                                        >
                                            Update Order
                                        </Button>
                                        <Button variant="outlined" size="large" color="secondary" sx={{ mx: "auto", mb: 1, minWidth: "244px", py: 1.5, borderRadius: "50px", color: "common.black", bgcolor: "common.white" }}
                                            component={RouterLink} to={`/${ROUTES.MYORDERS}`}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                }
                                {orderData?.status === 4 &&
                                    <>
                                        <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={acknowledgeReceive}
                                        >
                                            Acknowledge receive
                                        </Button>
                                    </>
                                }
                                {orderData?.status === 8 &&
                                    <>
                                        <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={updateEstimate}
                                        >
                                            Update Order
                                        </Button>
                                        <Button variant="outlined" size="large" color="secondary" sx={{ mx: "auto", mb: 1, minWidth: "244px", py: 1.5, borderRadius: "50px", color: "common.black", bgcolor: "common.white" }}
                                            component={RouterLink} to={`/${ROUTES.MYORDERS}`}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                }
                                {orderData?.status === 9 &&
                                    <>
                                        <Button variant="contained" size="large"
                                            sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={confirmOrder}
                                        >
                                            Confirm Order
                                        </Button>
                                    </>
                                }
                            </Stack>
                        }
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

export default OrderDetails;