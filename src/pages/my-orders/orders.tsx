import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { alpha, useTheme } from '@mui/material/styles';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { ReactComponent as EstimateIcon } from 'assets/icons/estimate.svg';
// import { ReactComponent as BoxIcon } from 'assets/icons/box.svg';
import { ReactComponent as ReceiptIcon } from 'assets/icons/receipt.svg';
import { ReactComponent as ShippedIcon } from 'assets/icons/shipped.svg';
import { ReactComponent as PaidIcon } from 'assets/icons/paid.svg';
import { ReactComponent as EditIcon } from 'assets/icons/edit.svg';
import { useNavigate } from "react-router-dom";
import { statusEnum } from './statusEnum'
import { ColDef, GroupCellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import MyOrders from './my-orders';
import { getOrders } from 'api/services/orders.services';
import { OrderModel, QueryResult } from 'interfaces/orders.model';
import { IdValue } from 'interfaces/products.model';

const Orders = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState<string>("?state=0")
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [selectedOption, setSelectedOption] = useState<string>('0')

    const { data } = useQuery<QueryResult<OrderModel>>(['orders', queryParams], () => getOrders(queryParams))

    const getChipStyle = (status: number) => {
        let res
        switch (status) {
            case 1:
                res = {
                    style: { color: theme.palette.success.main, bgcolor: alpha(theme.palette.success.main, 0.12) },
                    icon: <CartIcon />
                }
                break;
            case 2:
                res = {
                    style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customYellow.main, 0.25) },
                    icon: <ShippedIcon />
                }
                break;
            case 3:
                res = {
                    style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customYellow.main, 0.25) },
                    icon: <ShippedIcon />
                }
                break;
            case 4:
                res = {
                    style: { color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.25) },
                    icon: <ShippedIcon />
                }
                break;
            case 5:
                res = {
                    style: { color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.25) },
                    icon: <ShippedIcon />
                }
                break;
            case 6:
                res = {
                    style: { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.25) },
                    icon: <PaidIcon />
                }
                break;
            case 7:
                res = {
                    style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customOrange.main, 0.24) },
                    icon: <ReceiptIcon />
                }
                break;
            case 8:
                res = {
                    style: { color: theme.palette.common.white, bgcolor: theme.palette.grey[500] },
                    icon: <EstimateIcon />
                }
                break;
            case 9:
                res = {
                    style: { color: theme.palette.common.white, bgcolor: theme.palette.primary.main },
                    icon: <EstimateIcon />
                }
                break;
            // case (RECEIVED):
            //     res = {
            //         style: { color: theme.palette.primary.main, bgcolor: alpha(theme.palette.primary.main, 0.25) },
            //         icon: <BoxIcon />
            //     }
            //     break;
            default:
                res = {}
        }
        return res
    }

    const columns: ColDef[] = [
        {
            headerName: "Order #",
            field: "orderNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
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
            headerName: "Total Items",
            field: "totalItems",
        },
        {
            headerName: "Qty",
            field: "itemsQuantity",
        },
        {
            headerName: "Amount",
            field: "orderAmount",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value.toLocaleString()}` : '',
        },
        {
            headerName: "Ship Method",
            field: "shipVia",
        },
        {
            headerName: "Action",
            cellRenderer: (params: GroupCellRendererParams) => {
                return (
                    <Button variant='text' disabled={params.data.status !== 1 && params.data.status !== 8} startIcon={<EditIcon />}
                        onClick={() => navigate(`${params.data.salesOrderId}`)}
                    >
                        Edit
                    </Button>
                )
            },
        },
    ]

    useEffect(() => {
        let params = `?state=${selectedOption}`
        if (searchTerm)
            params += `&orderNumber=${searchTerm}`
        setQueryParams(params)
    }, [selectedOption, searchTerm])

    const onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
        navigate(`${event.data.salesOrderId}`)
    }

    const onOptionSelect = (value: string) => {
        setSelectedOption(value)
    }

    const onSearch = (param: string) => {
        setSearchTerm(param)
    }

    const getSelectOptions = () => {
        const options: IdValue[] = []

        for (const [propertyKey, propertyValue] of Object.entries(statusEnum)) {
            if (!Number.isNaN(Number(propertyKey))) {
                continue;
            }
            options.push({ id: Number(propertyValue), value: propertyKey });
        }

        return options;
    }


    return (
        <MyOrders data={data?.data} columns={columns} title="Orders"
            onRowDoubleClicked={onRowDoubleClicked}
            selectOptions={getSelectOptions()}
            onOptionSelect={onOptionSelect}
            onSearch={onSearch}
            selectedOption={selectedOption}
        />
    )
}

export default Orders;