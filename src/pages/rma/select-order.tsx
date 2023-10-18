import { useState } from "react";
import { useQuery } from "react-query";
import { OrderModel, QueryResult } from 'interfaces/orders.model';
import { getOrders } from 'api/services/orders.services';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { ColDef, GroupCellRendererParams, SelectionChangedEvent } from 'ag-grid-community';
import AgGrid from "components/ag-grid/ag-grid.component";
import { statusEnum } from 'pages/my-orders/statusEnum';
// import { ReactComponent as BoxIcon } from 'assets/icons/box.svg';
import { ReactComponent as ReceiptIcon } from 'assets/icons/receipt.svg';
// import { ReactComponent as PaidIcon } from 'assets/icons/paid.svg';

type props = {
    setSelectedOrder: (value: number) => void;
}

const defaultParams = '?&state=7'

const SelectOrder = (props: props) => {

    const { setSelectedOrder } = props
    const [queryParams, setQueryParams] = useState<string>(defaultParams)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const theme = useTheme();
    const { data } = useQuery<QueryResult<OrderModel>>(['orders', queryParams], () => getOrders(queryParams))

    const getChipStyle = (status: number) => {
        let res
        switch (status) {
            // case 1:
            //     res = {
            //         style: { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.25) },
            //         icon: <BoxIcon />
            //     }
            //     break;
            // case 2:
            //     res = {
            //         style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customOrange.main, 0.24) },
            //         icon: <ReceiptIcon />
            //     }
            //     break;
            // case 3:
            //     res = {
            //         style: { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.25) },
            //         icon: <PaidIcon />
            //     }
            //     break;
            case 7:
                res = {
                    style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customOrange.main, 0.24) },
                    icon: <ReceiptIcon />
                }
                break;
            default:
                res = {}
        }
        return res
    }

    const columns: ColDef[] = [
        {
            headerName: "Order #",
            field: "orderNumber",
            cellStyle: () => ({ color: theme.palette.primary.main }),
            checkboxSelection: true
        },
        {
            headerName: "Order Date",
            field: "orderDate",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
        {
            headerName: "Status",
            field: "status",
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    params.value ?
                        <Chip label={statusEnum[params.value]} color="primary" sx={getChipStyle(params.value).style} icon={getChipStyle(params.value).icon} />
                        :
                        ''
                )
            },
        },
        {
            headerName: "Count",
            field: "count",
        },
        {
            headerName: "Quantity",
            field: "totalItems",
        },
        {
            headerName: "Total",
            field: "total",
        },
        {
            headerName: "Ship method",
            field: "shipVia",
        }
    ]

    const onOrderSelection = (event: SelectionChangedEvent) => {
        setSelectedOrder(event.api.getSelectedNodes()[0].data.salesOrderId)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const onSearch = () => {
        setQueryParams(`${defaultParams}&orderNumber=${searchTerm}`)
    }

    return (
        <>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={0.5} mb={3}>
                <Typography variant='h5' component='h2'>Select order</Typography>
                <Typography variant='caption'>Choose one order number to select items to return</Typography>
            </Stack>
            <Box px={{ xs: 1, md: 10 }}>
                <Stack direction="row" mb={4}>
                    <Paper
                        sx={{ display: 'flex', alignItems: 'center', width: 380 }}
                        elevation={0}
                    >
                        <InputBase
                            sx={{ flex: 1, border: "1px solid", borderColor: "grey.300", height: "100%", px: 1 }}
                            value={searchTerm}
                            onChange={handleInputChange}
                        />
                    </Paper>
                    <Button variant="contained" color="success" sx={{ transform: "translateX(-5px)", color: "common.white" }} disableElevation
                        onClick={onSearch}
                    >
                        Search
                    </Button>
                </Stack>
                <Box height={800} className="bordered-grid">
                    <AgGrid rows={data?.data} columns={columns} rowHeight={54} autoFit={true} onSelectionChanged={onOrderSelection} />
                </Box>
            </Box>
        </>
    )
}

export default SelectOrder;