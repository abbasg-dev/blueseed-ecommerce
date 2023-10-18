import { useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { closeRma, getRmaById, voidRma } from "api/services/rma.services";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useTheme, alpha } from '@mui/material/styles';
import { ColDef, GroupCellRendererParams, ValueGetterParams } from 'ag-grid-community';
import AgGrid from "components/ag-grid/ag-grid.component";
import Toaster from "components/toaster/toaster.component";
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { Link as RouterLink, useParams } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import { statusEnum, reasonEnum, returnEnum } from './statusEnum'
import { RmaDetailsModel } from "interfaces/rma.model";
import placeholder from 'assets/images/placeholder-image.png';

const RmaDetails = () => {

    const theme = useTheme();
    const { id } = useParams();
    const [openVoid, setOpenVoid] = useState<boolean>(false);
    const [openConfirm, setOpenConfirm] = useState<boolean>(false);
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const notificationSeverity = useRef<number>(0)

    const { data } = useQuery<RmaDetailsModel>(['rma-details', id], () => getRmaById(id), { enabled: !!id });

    const voidMutation = useMutation(voidRma,
        {
            onSuccess() {
                notificationSeverity.current = 1
            },
            onError() {
                notificationSeverity.current = 2
            },
            onSettled() {
                setOpenNotification(true)
                setOpenVoid(false)
            }
        }
    )

    const closeMutation = useMutation(closeRma,
        {
            onSuccess() {
                notificationSeverity.current = 1
            },
            onError() {
                notificationSeverity.current = 2

            },
            onSettled() {
                setOpenNotification(true)
                setOpenConfirm(false)
            }
        }
    )

    const getStatusColor = (status: number) => {
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

    const columns: ColDef[] = [
        {
            headerName: "Item",
            field: "itemNumber",
            flex: 2,
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
                        <Stack p={1}>
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
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value.toLocaleString()}` : '',
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "QTY",
            field: "quantity",
            flex: 1,
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "Sub total",
            flex: 1,
            valueGetter: (params: ValueGetterParams) => `$ ${params.getValue("price") * params.getValue("quantity")}`,
            cellStyle: () => ({ fontWeight: 500 })
        },
        {
            headerName: "SerialNumber",
            field: "serials",
            flex: 2,
            cellRenderer: (params: GroupCellRendererParams) => {
                if (Array.isArray(params.value) && params.value.length > 0) {
                    let label = params.value[0]
                    if (params.value.length > 1)
                        label += ` +${params.value.length - 1}`
                    return <Chip color="info" label={label} sx={{ bgcolor: (theme) => alpha(theme.palette.info.main, 0.4) }} />
                }
                return "-"
            }
        },
        {
            headerName: "Reason",
            field: "reason",
            flex: 1,
            cellRenderer: (params: GroupCellRendererParams) => reasonEnum[params.value] ?? '-',
        },
    ]

    const handleOpenVoid = () => {
        setOpenVoid(true);
    };

    const handleOpenConfirm = () => {
        setOpenConfirm(true);
    };

    const handleCloseVoid = () => {
        setOpenVoid(false);
    };

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
    };

    const handleNotificationClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    const onVoidClick = () => {
        if (id)
            voidMutation.mutate(id)
    }

    const onConfirmClick = () => {
        if (id)
            closeMutation.mutate(id)
    }

    return (
        <>
            <Box py={2} px={{ xs: 1, md: 8 }} bgcolor="grey.50">
                <Button
                    variant="text" color="secondary"
                    startIcon={<ArrowIcon className='flip' width={24} height={24} />}
                    sx={{ color: "common.black", mb: 2.5 }}
                    component={RouterLink} to={`/${ROUTES.RMA}`}
                >
                    <Typography variant='h4' component='h1'>{data?.rmaNumber}</Typography>
                </Button>
                <Paper sx={{ py: 3 }}>
                    <Grid container spacing={2} >
                        <Grid item xs={12} md={8}>
                            <Stack height="100%">
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, px: 2.5, mb: 1 }}>
                                    <Box>
                                        <Typography variant='subtitle2'>RMA Number</Typography>
                                        <Typography variant='subtitle1'>{data?.rmaNumber}</Typography>
                                    </Box>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" mb={3}>
                                            <Stack direction="row" spacing={2.5}>
                                                <Typography variant='subtitle1'>Status</Typography>
                                                <Typography variant='subtitle1' sx={{ color: data?.status ? getStatusColor(data?.status) : '' }}>
                                                    {data?.status && statusEnum[data?.status]}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={2.5}>
                                                <Typography variant='subtitle1'>RMA Date</Typography>
                                                <Typography variant='subtitle1'>{data?.date ? new Date(data?.date).toLocaleDateString() : ""}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, px: 2.5, mb: { xs: 3, md: 1 } }}>
                                    <Box>
                                        <Typography variant='subtitle2'>Order Number</Typography>
                                        {data?.orderNumber ?
                                            <Typography variant='subtitle1'>{data?.orderNumber}</Typography>
                                            :
                                            <Box height="28px" />
                                        }
                                    </Box>
                                    <Stack direction="row" spacing={2.5}>
                                        <Typography variant='subtitle1'>Total Items to return</Typography>
                                        <Typography variant='subtitle1'>{data?.totalItems}</Typography>
                                    </Stack>
                                </Box>
                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, px: 2.5, mb: 1 }}>
                                    <Box>
                                        <Typography variant='subtitle2'>Credit memo Number</Typography>
                                        {data?.creditMemo ?
                                            <Typography variant='subtitle1'>{data?.creditMemo}</Typography>
                                            :
                                            <Box height="28px" />
                                        }
                                    </Box>
                                    <Stack direction="row" spacing={2.5}>
                                        <Typography variant='subtitle1'>Quantity</Typography>
                                        <Typography variant='subtitle1'>{data?.totalQuantity}</Typography>
                                    </Stack>
                                </Box>
                                <Box height={600} className="cart-grid" px={1}>
                                    <AgGrid rows={data?.items} columns={columns} rowHeight={90} autoFit={true}/>
                                </Box>
                            </Stack>
                        </Grid>
                        <Divider orientation="vertical" flexItem sx={{ mr: "-1px", mt: 2 }} />
                        <Grid item xs={12} md={4} pr={{ xs: 1, md: 5 }}>
                            <Typography variant="subtitle1" color="primary" pl={{ xs: 1, md: 0 }}>Return Method</Typography>
                            <Typography variant="body2" pl={{ xs: 1, md: 0 }}>{data?.returnMethod && returnEnum[data?.returnMethod]}</Typography>
                            <Box bgcolor="customGrey.main" p={2} px={3} my={4}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle1" sx={{ color: "grey.600" }}>
                                            TOTAL QTY to return
                                        </Typography>
                                        <Typography variant="h6" >
                                            {data?.totalQuantity}
                                        </Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography variant="subtitle1" sx={{ color: "grey.600" }}>
                                            TOTAL ITEMS
                                        </Typography>
                                        <Typography variant="h6" >
                                            {data?.totalItems}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mb={2}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Subtotal
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${data?.subtotal}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" mb={3}>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Tax
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        ${data?.tax}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        Order Total
                                    </Typography>
                                    <Typography variant="h6" fontWeight={500}>
                                        ${(data?.subtotal) && data?.subtotal + data?.tax}
                                    </Typography>
                                </Stack>
                            </Box>
                            <Stack px={2}>
                                {data?.status === 1 &&
                                    <>
                                        <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={handleOpenVoid}
                                        >
                                            Void RMA
                                        </Button>
                                    </>
                                }
                                {data?.status === 2 &&
                                    <>
                                        <Button variant="contained" size="large" sx={{ mx: "auto", mb: 1.5, minWidth: "244px", py: 1.5, borderRadius: "50px" }}
                                            onClick={handleOpenConfirm}
                                        >
                                            Close RMA
                                        </Button>
                                    </>
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Toaster
                open={openVoid}
                title="Void RMA"
                description="Don’t close RMA if you didn’t get your request yet!"
                buttonText="Void RMA"
                handleClose={handleCloseVoid}
                handleConfirm={onVoidClick}
            />
            <Toaster
                open={openConfirm}
                title="Close RMA"
                description="Don’t close RMA if you didn’t get your request yet!"
                buttonText="Close RMA"
                handleClose={handleCloseConfirm}
                handleConfirm={onConfirmClick}
            />
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleNotificationClose}>
                <MuiAlert onClose={handleNotificationClose} severity={notificationSeverity.current === 1 ? "success" : "error"}>
                    {notificationSeverity.current === 1 ?
                        "Request sent successfully"
                        :
                        "Failed to send request"
                    }
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default RmaDetails;