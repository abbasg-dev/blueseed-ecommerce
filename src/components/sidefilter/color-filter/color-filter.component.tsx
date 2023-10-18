import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from '@mui/material/Avatar';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { IdValue } from "interfaces/products.model";

type ColorFilterProps = {
    colors: IdValue[],
}

const ColorFilter = (props: ColorFilterProps) => {

    const { colors } = props

    const [selectedColor, setSelectedColor] = useState<number | null>(null);

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
                <Typography variant="body1" fontWeight={500}>Color</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
                <Stack direction="row" alignItems="center" flexWrap="wrap">
                    {
                        colors.map(color => (
                            <Stack alignItems="center" key={color.id} width="60px" sx={{ mb: 1 }}>
                                <IconButton sx={{ p: 0, mb: 1 }} onClick={() => setSelectedColor(color.id)}>
                                    <Avatar sx={{ width: 34, height: 34, border: '1px solid', borderColor: 'grey.500' }}> </Avatar>
                                </IconButton>
                                <Typography variant="caption" textTransform="capitalize" color={selectedColor === color.id ? 'primary.main' : ''}>{color.value}</Typography>
                            </Stack>
                        ))
                    }
                </Stack>
            </AccordionDetails>
        </Accordion >

    )
}

export default ColorFilter;