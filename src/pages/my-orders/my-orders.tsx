import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import SideBar from 'components/sidebar/sidebar.component';
import AgGrid from 'components/ag-grid/ag-grid.component';
import * as menus from 'constants/menus'
import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';
import { IdValue } from 'interfaces/products.model';

type props = {
    title: string,
    data: any[] | undefined,
    columns: ColDef[],
    onRowDoubleClicked?: (event: RowDoubleClickedEvent) => void,
    onSearch?: (value: string) => void,
    onOptionSelect?: (value: string) => void,
    selectOptions?: IdValue[],
    selectedOption?: string
}

const MyOrders = (props: props) => {

    const { title, columns, onRowDoubleClicked, data, onSearch, selectOptions, onOptionSelect, selectedOption } = props
    const [searchTerm, setSearchTerm] = useState<string>('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const handleSelectChange = (event: SelectChangeEvent) => {
        if (onOptionSelect)
            onOptionSelect(event.target.value)
    };

    const onSearchClick = () => {
        if (onSearch)
            onSearch(searchTerm)
    }

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 4fr' }
            }}
        >
            <SideBar menuEntries={menus.orders} />
            <Box py={3} px={{ xs: 2, md: 6 }} bgcolor="grey.50">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'normal', md: 'center' }} sx={{ mb: 3 }} color="grey.900">
                    <Typography variant="h4" component="h1" >
                        {title}
                    </Typography>
                    {data && data.length > 0 &&
                        <Typography variant="subtitle1" component="span">
                            Displaying {data?.length} items
                        </Typography>
                    }
                </Stack>
                <Paper sx={{ py: 2 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" px={2} spacing={2}>
                        <Stack direction="row" >
                            <Paper
                                sx={{ display: 'flex', alignItems: 'center', width: { xs: 'auto', md: 380 } }}
                                elevation={0}
                            >
                                <InputBase
                                    sx={{ flex: 1, border: "1px solid", borderColor: "grey.300", height: "100%", px: 1 }}
                                    value={searchTerm}
                                    onChange={handleInputChange}
                                />
                            </Paper>
                            <Button variant="contained" color="success" sx={{ transform: "translateX(-5px)", color: "common.white" }} disableElevation
                                onClick={onSearchClick}
                            >
                                Search
                            </Button>
                        </Stack>
                        {selectOptions &&
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <InputLabel>Records to display</InputLabel>
                                <Select
                                    size="small"
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {selectOptions?.map(option => {
                                        return (
                                            <MenuItem key={option.id} value={option.id}>{option.value}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </Stack>
                        }
                    </Stack>
                    <Box height={800} className="bordered-grid">
                        <AgGrid rows={data} columns={columns} rowHeight={54}
                            onRowDoubleClicked={onRowDoubleClicked} autoFit={true} />
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}

export default MyOrders;