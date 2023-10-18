import { useQuery } from "react-query";
import { getRmaHistory } from "api/services/rma.services";
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from '@mui/material/Chip';
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import AgGrid from "components/ag-grid/ag-grid.component";
import { ColDef, GroupCellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { alpha, useTheme } from '@mui/material/styles';
import { statusEnum } from "./statusEnum";
import { ReactComponent as EstimateIcon } from 'assets/icons/estimate.svg';
import { ReactComponent as TrueIcon } from 'assets/icons/true.svg';
import { ReactComponent as CrossIcon } from 'assets/icons/cross.svg';
import { ReactComponent as UnionIcon } from 'assets/icons/union.svg';
import { ReactComponent as ThumbIcon } from 'assets/icons/thumb.svg';
import { RmaList } from "interfaces/rma.model";
import { QueryResult } from "interfaces/orders.model";

const RmaHistory = () => {

    const theme = useTheme();
    const navigate = useNavigate();

    const { data } = useQuery<QueryResult<RmaList>>('rma-history', getRmaHistory)

    const getChipStyle = (status: number) => {
        let res
        switch (status) {
            case 1:
                res = {
                    style: { color: theme.palette.grey[700], bgcolor: theme.palette.grey[300] },
                    icon: <EstimateIcon />
                }
                break;
            case 2:
                res = {
                    style: { color: theme.palette.success.main, bgcolor: alpha(theme.palette.success.main, 0.12) },
                    icon: <TrueIcon />
                }
                break;
            case 3:
                res = {
                    style: { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.25) },
                    icon: <CrossIcon />
                }
                break;
            case 4:
                res = {
                    style: { color: theme.palette.customOrange.main, bgcolor: alpha(theme.palette.customOrange.main, 0.24) },
                    icon: <UnionIcon />
                }
                break;
            case 5:
                res = {
                    style: { color: theme.palette.info.main, bgcolor: alpha(theme.palette.info.main, 0.25) },
                    icon: <ThumbIcon />
                }
                break;
            default:
                res = {}
        }
        return res
    }

    const columns: ColDef[] = [
        {
            headerName: "RMA #",
            field: "rmaNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "RMA Date",
            field: "rmaDate",
            cellRenderer: (params: GroupCellRendererParams) => params.value ? new Date(params.value).toLocaleDateString() : '',
        },
        {
            headerName: "Return Method",
            field: "returnMethod",
        },
        {
            headerName: "Order #",
            field: "orderNumber",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },
        {
            headerName: "Items to return",
            field: "itemsToReturn",
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
            headerName: "Credit memo",
            field: "creditMemo",
            cellStyle: () => ({ color: theme.palette.primary.main })
        },

    ]

    const onRowDoubleClicked = (event: RowDoubleClickedEvent) => {
        navigate(`${event.data.rmaId}`)
    }

    return (
        <Box py={3} px={{ xs: 0, md: 3 }} sx={{ bgcolor: "grey.50" }}>
            <Container>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1} alignItems={{ xs: "start", md: "center" }} sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h1" >
                        RMA
                    </Typography>
                    <Button variant="contained" size="large" color="primary" sx={{ minWidth: "250px", py: 1.5, borderRadius: "50px" }}
                        component={RouterLink} to={`/${ROUTES.RMA}/${ROUTES.RMAREQUEST}`}
                    >
                        Request RMA
                    </Button>
                </Stack>
                <Paper sx={{ py: 3, px: { xs: 2, md: 3 } }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "normal", md: "center" }} sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h2" >
                            History
                        </Typography>
                        {/* <Stack direction="row" alignItems="center" spacing={1}>
                            <InputLabel>Records to display</InputLabel>
                            <Select
                                defaultValue={'all'}
                                size="small"
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                <MenuItem value="all">All Records</MenuItem>
                            </Select>
                        </Stack> */}
                    </Stack>
                    <Box height={800} className="bordered-grid">
                        <AgGrid rows={data?.data} columns={columns} rowHeight={54} autoFit={true} onRowDoubleClicked={onRowDoubleClicked} />
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default RmaHistory;