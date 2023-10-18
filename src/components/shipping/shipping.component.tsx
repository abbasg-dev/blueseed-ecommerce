import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getShippingInfo, getShippingMethods } from 'api/services/orders.services';
import { ShippingInfo, ShippingMethod } from 'interfaces/orders.model';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';

type props = {
    showSelect: boolean,
    onMethodChange?: (value: ShippingMethod) => void,
    onInfoChange?: (value: string) => void,
    propsInfo?: ShippingInfo,
    propsMethod?: ShippingMethod
}

const Shipping = (props: props) => {

    const { showSelect, onInfoChange, onMethodChange, propsInfo, propsMethod } = props
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [selectedInfo, setSelectedInfo] = useState<ShippingInfo>();

    const { data: shippingInfo } = useQuery<ShippingInfo[]>('shipping-info', getShippingInfo, { enabled: showSelect })
    const { data: shippingMethods } = useQuery<ShippingMethod[]>('shipping-methods', getShippingMethods, { enabled: showSelect })

    useEffect(() => {
        if (propsInfo)
            setSelectedInfo(propsInfo)
    }, [propsInfo])

    useEffect(() => {
        if (propsMethod)
            setSelectedMethod(propsMethod.shippingMethodId?.toString())
    }, [propsMethod])

    const handleMethodChange = (event: SelectChangeEvent) => {
        setSelectedMethod(event.target.value as string);
        let method = shippingMethods?.find(method => method.shippingMethodId === Number(event.target.value))
        if (onMethodChange && method)
            onMethodChange(method)
    };

    const handleInfoChange = (event: SelectChangeEvent) => {
        setSelectedInfo(shippingInfo?.find(info => info.shippingInfoId === Number(event.target.value)));
        if (onInfoChange)
            onInfoChange(event.target.value)
    };

    return (
        <Stack px={3} pb={2}>
            <InputLabel sx={{ color: 'primary.main', mb: showSelect ? 0 : 1 }}>
                Shipping method
            </InputLabel>
            {showSelect ?
                <Select
                    value={(shippingMethods && selectedMethod) ? selectedMethod : ''}
                    onChange={handleMethodChange}
                    size='small'
                    sx={{ mb: 1 }}
                >
                    {shippingMethods?.filter(method => method.isActive === true).map((item) => (
                        <MenuItem key={item.shippingMethodId} value={item.shippingMethodId} >
                            <Stack direction="row" justifyContent="space-between" width="100%">
                                <span>{item.name}</span>
                                <span>${item.cost}</span>
                            </Stack>
                        </MenuItem>
                    ))}
                </Select>
                :
                <Typography variant="body2" color="grey.600" mb={1.5}>
                    {propsMethod?.name ?? "Ground"}
                </Typography>
            }
            <InputLabel sx={{ color: 'primary.main', mb: showSelect ? 0 : 1 }}>
                Ship to
            </InputLabel>
            {showSelect ?
                <Select
                    value={(shippingInfo && selectedInfo) ? selectedInfo.shippingInfoId?.toString() : ''}
                    onChange={handleInfoChange}
                    size='small'
                    sx={{ mb: 3 }}
                >
                    {shippingInfo && shippingInfo?.map((item) => (
                        <MenuItem key={item.shippingInfoId} value={item.shippingInfoId} >
                            {item.company}
                        </MenuItem>
                    ))}
                </Select>
                :
                <Typography variant="body2" color="grey.600" mb={3}>
                    {selectedInfo?.company ?? "Location"}
                </Typography>
            }
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        Company Name
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.company ?? "Company Name"}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        Work Phone
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.workNumber ?? "Work Phone"}
                    </Typography>
                </Grid>
                <Grid item xs={12} my={2}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        Address
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.address ?? "Address"}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        City
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.city ?? "City"}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        State
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.state ?? "State"}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        Country
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.country ?? "Country"}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <InputLabel sx={{ color: 'primary.main', mb: 1 }}>
                        Zip Code
                    </InputLabel>
                    <Typography variant="body2" color="grey.600">
                        {selectedInfo?.address?.zipCode ?? "Zip Code"}
                    </Typography>
                </Grid>
            </Grid>
        </Stack>
    );
};

export default Shipping;