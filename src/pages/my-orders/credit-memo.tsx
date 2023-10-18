import { useState } from 'react';
import MyOrders from './my-orders';
import { useQuery } from 'react-query';
import { useTheme } from '@mui/material/styles';
import { ColDef, GroupCellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { useNavigate } from "react-router-dom";
import { getInvoices } from 'api/services/orders.services';
import { InvoiceModel, QueryResult } from 'interfaces/orders.model';

const typeCredit = 2
const defaultParams = `?invType=${typeCredit}`

const CreditMemo = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const [queryParams, setQueryParams] = useState<string>(defaultParams)

    const { data } = useQuery<QueryResult<InvoiceModel>>(['invoices', queryParams], () => getInvoices(queryParams))

    const columns: ColDef[] = [
        {
            headerName: "Credit memo #",
            field: "invoiceNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "Credit memo Date",
            field: "paidDate",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
        {
            headerName: "Amount",
            field: "amount",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value.toLocaleString()}` : '',
        },
        {
            headerName: "Order #",
            field: "salesOrder",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "Order Date",
            field: "date",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
        {
            headerName: "RMA #",
            field: "rmaNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
    ]

    const onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
        navigate(`${event.data.invoiceId}`)
    }

    const onSearch = (param: string) => {
        setQueryParams(`${defaultParams}&invoiceNumber=${param}`)
    }

    return (
        <MyOrders title="Credit Memo" data={data?.data} columns={columns} onRowDoubleClicked={onRowDoubleClicked} onSearch={onSearch} />
    )
}

export default CreditMemo;