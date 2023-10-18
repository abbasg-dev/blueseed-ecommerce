import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { OrderInfo } from 'interfaces/orders.model';
import { getOrderById } from 'api/services/orders.services';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import RmaItem from "components/rma-item/rma-item.component";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import { returnEnum } from 'pages/rma/statusEnum'
import { IdValue } from 'interfaces/products.model';
import { RmaItemModel } from "interfaces/rma.model";
import { postRma } from "api/services/rma.services";

type props = {
    selectedOrder: number;
}

const SelectItems = (props: props) => {

    const { selectedOrder } = props
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<RmaItemModel[]>([])
    const [selectedMethod, setSelectedMethod] = useState<string>('')
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const notificationSeverity = useRef<number>(0)
    const notificationMessage = useRef<string>('')

    const { data, isLoading } = useQuery<OrderInfo>(['order', selectedOrder], () => getOrderById(selectedOrder.toString()));

    const createMutation = useMutation(postRma,
        {
            onSuccess() {
                notificationSeverity.current = 1
                notificationMessage.current = 'RMA Created Successfully'
                setOpenNotification(true)
                setTimeout(() => {
                    navigate(`/${ROUTES.RMA}`)
                }, 2000);
            },
            onError() {
                notificationSeverity.current = 2
                notificationMessage.current = 'Failed to Create RMA'
                setOpenNotification(true)
            },
        }
    )

    const getMethods = () => {
        const options: IdValue[] = []

        for (const [propertyKey, propertyValue] of Object.entries(returnEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }
            options.push({ id: Number(propertyValue), value: propertyKey });
        }

        return options;
    }

    const handleMethodChange = (event: SelectChangeEvent) => {
        setSelectedMethod(event.target.value as string);
    };

    const getTotalQuantity = () => {
        let total = 0
        for (let item of selectedItems)
            if (!isNaN(Number(item.quantity)))
                total += Number(item.quantity)
        return total
    }

    const getSubtotal = () => {
        let total = 0
        for (let item of selectedItems)
            if (!isNaN(Number(item.quantity)) && item.price)
                total += Number(item.quantity) * item.price
        return total
    }

    const checkQuantity = () => {
        for (let item of selectedItems) {
            if (Number(item.quantity) === 0)
                return false
        }
        return true
    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    const createRma = () => {
        notificationSeverity.current = 2
        if (selectedItems.length === 0) {
            notificationMessage.current = "Please Select Items"
            setOpenNotification(true)
        } else if (!checkQuantity()) {
            notificationMessage.current = "Please Add Items Quantity"
            setOpenNotification(true)
        } else if (selectedMethod === '') {
            notificationMessage.current = "Please Select Return Method"
            setOpenNotification(true)
        } else {
            let mutateData = {
                items: selectedItems.map(item => {
                    if (item.reason === -1)
                        return { ...item, reason: undefined }
                    return item
                }),
                orderDate: new Date().toISOString(),
                returnMethod: Number(selectedMethod),
                salesOrderId: selectedOrder
            }
            createMutation.mutate(mutateData)
        }
    }

    const checkRmaAllowed = data?.itemOrders.some(ele => ele.allowRma === true)

    return (
        <>
            <Typography variant='h5' component='h2' textAlign={{ xs: "center", md: "left" }}>
                Add items from
                <Typography variant='h6' component='span'> Po-{data?.orderNumber} </Typography>
                to RMA
            </Typography>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: { xs: 5, md: 10 } }}>
                {!isLoading && checkRmaAllowed && <Typography variant='subtitle2' mx={{ xs: 1, md: 8 }} mb={5}> Items to return </Typography>}
                <Stack spacing={5}>
                    {
                        checkRmaAllowed
                            ?
                            data?.itemOrders.filter(item => item.allowRma === true).map((item) => {
                                return (
                                    <RmaItem key={item.itemOrderId} rmaItem={item} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                                )
                            })
                            :
                            !isLoading && <Typography>Items in this sales order are not allowed for RMA</Typography>
                    }
                </Stack>
            </Box>
            {!isLoading && checkRmaAllowed &&
                <Box p={3} bgcolor="customGrey.main" mx={{ xs: 0, md: 20 }} mb={{ xs: 6, md: 12 }}>
                    <Grid container spacing={1} >
                        <Grid item xs={12} md={6} mb={{ xs: 6, md: 0 }}>
                            <Stack alignItems="center" height="100%">
                                <Stack justifyContent="center" height="100%">
                                    <Typography variant="subtitle1" mb={1}>Return Method</Typography>
                                    <Select
                                        value={selectedMethod}
                                        onChange={handleMethodChange}
                                        displayEmpty
                                        sx={{ width: "300px" }}
                                        renderValue={(selected) => {
                                            if (selected.length === 0) {
                                                return <Typography variant="body2" sx={{ color: "grey.500" }}>Choose return method</Typography>;
                                            }

                                            return returnEnum[Number(selected)];
                                        }}
                                    >
                                        {getMethods()?.map(method => {
                                            return (
                                                <MenuItem key={method.id} value={method.id}>{method.value}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6} >
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" color="secondary">TOTAL QTY to return</Typography>
                                    <Typography variant="h6" component="span">{getTotalQuantity()}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="subtitle1" color="secondary">TOTAL ITEMS</Typography>
                                    <Typography variant="h6" component="span">{selectedItems.length}</Typography>
                                </Stack>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle2">Subtotal</Typography>
                                <Typography variant="subtitle2">${getSubtotal().toLocaleString()}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle2">Tax</Typography>
                                <Typography variant="subtitle2">$0</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between" mb={1}>
                                <Typography variant="subtitle2">Total</Typography>
                                <Typography variant="h6" component="span">${getSubtotal().toLocaleString()}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            }
            <Stack direction={{ xs: "column-reverse", md: "row" }} alignItems="center" justifyContent="center" spacing={4} mb={2}>
                <Button variant="outlined" size="large" color="secondary" sx={{ minWidth: "250px", py: 1.3, borderRadius: "62px", color: "common.black" }}
                    component={RouterLink} to={`/${ROUTES.RMA}`}
                >
                    Cancel
                </Button>
                <Button variant="contained" size="large" sx={{ minWidth: "250px", py: 1.3, borderRadius: "62px" }}
                    onClick={createRma}
                >
                    Create RMA
                </Button>
            </Stack>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity={notificationSeverity.current === 1 ? "success" : "error"}>
                    {notificationMessage.current}
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default SelectItems;