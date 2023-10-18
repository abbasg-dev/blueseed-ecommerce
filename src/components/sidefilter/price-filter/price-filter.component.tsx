import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/system/Box';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { StyledSlider } from './price-filter.style';


const PriceFilter = () => {

    const [value, setValue] = useState<number[]>([500, 2500]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    return (

        <Accordion
            sx={{
                '&.Mui-expanded': {
                    bgcolor: 'grey.100',
                    boxShadow: 'none'
                }
            }}
        >
            <AccordionSummary expandIcon={<ChevronIcon />}>
                <Typography variant="body1" fontWeight={500}>Price</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, px: 2 }}>
                <Box px={1}>
                    <StyledSlider
                        min={0}
                        max={4000}
                        valueLabelDisplay="auto"
                        value={value}
                        onChange={handleChange}
                    />
                </Box>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption">0$</Typography>
                    <Typography variant="caption">4000$</Typography>
                </Stack>
                <Stack direction="row" mt={3} alignItems="center" justifyContent="space-between">
                    <Typography variant="body1">Between {value[0]}$ and {value[1]}$</Typography>
                    <Button variant="outlined">Filter</Button>
                </Stack>
            </AccordionDetails>
        </Accordion>

    )
}

export default PriceFilter;