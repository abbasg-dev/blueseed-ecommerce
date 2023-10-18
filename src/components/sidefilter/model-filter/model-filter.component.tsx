import { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { IdValue } from "interfaces/products.model";


type ModelFilterProps = {
    list: IdValue[],
    title: string
}

const ModelFilter = (props: ModelFilterProps) => {

    const { list, title } = props

    const [selectedModel, setSelectedModel] = useState<number | null>(null);

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
                <Typography variant="body1" fontWeight={500}>By {title}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pb: 0, pt: 0 }}>
                <List
                    sx={{
                        pt: 0,
                        '.Mui-selected': {
                            color: 'primary.main',
                        }
                    }}
                >
                    {list?.map(element => (
                        <ListItemButton
                            sx={{ py: 0 }} key={element.id}
                            selected={selectedModel === element.id}
                            onClick={() => setSelectedModel(element.id)}
                        >
                            <ListItemText primary={element.value} />
                        </ListItemButton>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>

    )
}

export default ModelFilter;