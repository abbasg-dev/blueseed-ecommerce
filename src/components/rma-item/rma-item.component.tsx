import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import { alpha } from '@mui/material/styles';
import { ReactComponent as TrueIcon } from 'assets/icons/true.svg';
import { IconButton } from '@mui/material';
import { OrderItem, Serial } from 'interfaces/orders.model';
import { IdValue } from 'interfaces/products.model';
import { RmaItemModel, RmaReason } from 'interfaces/rma.model';
import placeholder from 'assets/images/placeholder-image.png';
import { getRmaReasons } from 'api/services/rma.services';
import { useQuery } from 'react-query';

type props = {
    rmaItem: OrderItem,
    selectedItems: RmaItemModel[],
    setSelectedItems: (value: RmaItemModel[]) => void;
}

const RmaItem = (props: props) => {

    const { rmaItem, selectedItems, setSelectedItems } = props

    const { data } = useQuery<RmaReason[]>('rma-reasons', getRmaReasons)

    let isSelected = selectedItems.find(item => item.itemOrderId === rmaItem.itemOrderId)

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.trim() === '' || !isNaN(Number(event.target.value))) {
            let updatedItems = [] as RmaItemModel[]
            if (isSelected) {
                updatedItems = [...selectedItems].map(item => {
                    if (item.itemOrderId === rmaItem.itemOrderId)
                        return { ...item, quantity: event.target.value }
                    else
                        return { ...item }
                })
            } else {
                updatedItems = [...selectedItems, { itemOrderId: rmaItem.itemOrderId, quantity: event.target.value, price: rmaItem.price }]
            }
            setSelectedItems([...updatedItems])
        }
    };

    const handleOtherReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let updatedItems = [] as RmaItemModel[]
        if (isSelected) {
            updatedItems = [...selectedItems].map(item => {
                if (item.itemOrderId === rmaItem.itemOrderId)
                    return { ...item, otherReason: event.target.value }
                else
                    return { ...item }
            })
        } else {
            updatedItems = [...selectedItems, { itemOrderId: rmaItem.itemOrderId, quantity: '', otherReason: event.target.value, price: rmaItem.price }]
        }
        setSelectedItems([...updatedItems])
    };

    const onSerialClick = (serial: Serial) => {
        let updatedItems = [] as RmaItemModel[]
        if (isSelected) {
            updatedItems = [...selectedItems].map(item => {
                if (item.itemOrderId === rmaItem.itemOrderId)
                    if (item.serials)
                        return { ...item, serials: [...item.serials, serial.serialId] }
                    else
                        return { ...item, serials: [serial.serialId] }
                else
                    return { ...item }
            })
        } else {
            updatedItems = [...selectedItems, { itemOrderId: rmaItem.itemOrderId, serials: [serial.serialId], quantity: '', price: rmaItem.price }]
        }
        setSelectedItems([...updatedItems])
    };

    const handleDelete = (serial: number) => {
        let updatedItems = [] as RmaItemModel[]
        let serials = isSelected?.serials?.filter(val => val !== serial)
        updatedItems = [...selectedItems].map(item => {
            if (item.itemOrderId === rmaItem.itemOrderId)
                return { ...item, serials }
            else
                return { ...item }
        })
        setSelectedItems([...updatedItems])
    };

    const handleReasonChange = (event: SelectChangeEvent) => {
        let updatedItems = [] as RmaItemModel[]
        if (isSelected) {
            updatedItems = [...selectedItems].map(item => {
                if (item.itemOrderId === rmaItem.itemOrderId)
                    return { ...item, reason: Number(event.target.value) }
                else
                    return { ...item }
            })
        } else {
            updatedItems = [...selectedItems, { itemOrderId: rmaItem.itemOrderId, quantity: '', reason: Number(event.target.value), price: rmaItem.price }]
        }
        setSelectedItems([...updatedItems])
    };

    const selectItem = () => {
        if (isSelected) {
            let filteredItems = selectedItems.filter(item => item.itemOrderId !== rmaItem.itemOrderId)
            setSelectedItems(filteredItems)
        } else {
            let updatedItems = [...selectedItems, { itemOrderId: rmaItem.itemOrderId, quantity: '', price: rmaItem.price }]
            setSelectedItems(updatedItems)
        }
    }

    const getReasons = () => {
        let options: IdValue[] = []

        if (data)
            options = data?.map(reason => ({ id: reason.id, value: reason.reason }))

        options.push({ id: -1, value: 'Other' });

        return options;
    }

    return (
        <>
            <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="center">
                <Stack direction="row" alignSelf={{ xs: "start", md: "auto" }} alignItems="center">
                    <IconButton onClick={selectItem} sx={{ height: "40px" }}>
                        <Box width="22px" height="22px" display="flex" alignItems="center" justifyContent="center"
                            sx={{ border: "1px solid", color: "common.white", borderColor: isSelected ? "customGreen.main" : "grey.500", cursor: "pointer", bgcolor: isSelected ? "customGreen.main" : "common.white" }}
                        >
                            {isSelected && <TrueIcon />}
                        </Box>
                    </IconButton>
                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="space-between" ml={{ xs: 1, md: 3 }}>
                        <Box width={68} height={68} sx={{ borderRadius: "17px", overflow: "hidden", flexShrink: 0 }}>
                            <img
                                src={rmaItem?.imageUrl ?? placeholder}
                                alt=""
                                width={"100%"}
                            />
                        </Box>
                        <Stack>
                            <Typography variant="subtitle1">{rmaItem.itemNumber}</Typography>
                            <Typography variant="subtitle1">Quantity {rmaItem.quantity}</Typography>
                            <Typography variant="subtitle1">Sub price {rmaItem.price}$</Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack alignItems="center">
                    <Typography variant="subtitle1" mb={1}>Qty To return</Typography>
                    <TextField variant="outlined" size="small"
                        value={isSelected?.quantity ?? ''} onChange={handleQuantityChange}
                        sx={{
                            width: "70px",
                            py: "5px",
                            borderRadius: "6px",
                            bgcolor: "customGrey.main",
                            "fieldset": { border: "none" },
                            "input": { textAlign: "center" }
                        }}
                    />
                </Stack>
                <Stack >
                    <Typography variant="subtitle1" mb={1}>Serial number</Typography>
                    <Select
                        multiple
                        value={[]}
                        displayEmpty
                        sx={{ width: "300px" }}
                        renderValue={() => <Typography variant="body2" sx={{ color: "grey.500" }}>Choose Serial numbers</Typography>}
                    >
                        {rmaItem?.serials?.filter(val => !isSelected?.serials?.find(s => s === val.serialId)).map((serial) => (
                            <MenuItem key={serial.serialId} value={serial.serialNo} onClick={() => onSerialClick(serial)}>
                                <ListItemText primary={serial.serialNo} />
                                <Button sx={{ bgcolor: 'transparent!important' }} disableRipple>+Add</Button>
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
                <Stack >
                    <Typography variant="subtitle1" mb={1}>Reason</Typography>
                    <Select
                        value={isSelected?.reason ? isSelected.reason.toString() : ''}
                        onChange={handleReasonChange}
                        displayEmpty
                        sx={{ width: "300px" }}
                        renderValue={(selected) => {
                            if (selected.length === 0) {
                                return <Typography variant="body2" sx={{ color: "grey.500" }}>Choose reason</Typography>;
                            }

                            return selected === "-1" ? "Other" : data?.find(reason => reason.id === Number(selected))?.reason;
                        }}
                    >
                        {getReasons()?.map(reason => {
                            return (
                                <MenuItem key={reason.id} value={reason.id}>{reason.value}</MenuItem>
                            )
                        })}
                    </Select>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={1} justifyContent={{ xs: "center", md: "normal" }} flexWrap="wrap" sx={{ ml: { xs: 0, md: "64px!important" }, mt: "16px!important" }}>
                {isSelected?.serials?.map(serial => {
                    return (
                        <Box key={serial}>
                            <Chip
                                label={rmaItem.serials?.find(s => s.serialId === serial)?.serialNo}
                                color="info"
                                sx={{ bgcolor: (theme) => alpha(theme.palette.info.main, 0.4), mb: 1 }}
                                onDelete={() => handleDelete(serial)}
                            />
                        </Box>
                    )
                })
                }
            </Stack>
            {Number(isSelected?.reason) === -1 &&
                <Stack mt="0!important" alignItems={{ xs: "center", md: "normal" }}>
                    <Box sx={{ width: "300px", ml: { xs: 0, md: 8 }, mt: 2 }}>
                        <Typography variant="subtitle1" mb={1}>Other Reason</Typography>
                        <TextField variant="outlined" size="small"
                            value={isSelected?.otherReason ?? ''} onChange={handleOtherReasonChange}
                        />
                    </Box>
                </Stack>
            }
        </>
    )
};

export default RmaItem;