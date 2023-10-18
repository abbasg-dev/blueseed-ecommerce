import { useState } from 'react';
import { useQuery } from 'react-query';
import { getReceipts } from 'api/services/orders.services';
import MyOrders from './my-orders';
import { useTheme } from '@mui/material/styles';
import { ColDef, GroupCellRendererParams } from 'ag-grid-community';
import { QueryResult, ReceiptModel } from 'interfaces/orders.model';

const PaymentHistory = () => {

    const theme = useTheme();
    const [queryParams, setQueryParams] = useState<string>("")

    const { data } = useQuery<QueryResult<ReceiptModel>>(['receipts', queryParams], () => getReceipts(queryParams))

    const columns: ColDef[] = [
        {
            headerName: "Payment #",
            field: "receiptNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "Payment Date",
            field: "date",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
        {
            headerName: "Amount",
            field: "payment",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value.toLocaleString()}` : '',
        },
        {
            headerName: "Order #",
            field: "orderNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "Check number",
            field: "checkNumber",
        },
        {
            headerName: "Reference number",
            field: "refNumber",
        },
        {
            headerName: "Balance",
            field: "balance",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? `$ ${params.value.toLocaleString()}` : '',
        },
    ]

    const onSearch = (param: string) => {
        setQueryParams(`?receiptNumber=${param}`)
    }

    return (
        <MyOrders title="Payment History" data={data?.data} columns={columns} onSearch={onSearch} />
    )
}

export default PaymentHistory;