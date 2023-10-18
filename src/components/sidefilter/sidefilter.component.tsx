import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTheme, alpha } from '@mui/material/styles';
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';
import { Category, ItemSubClass } from "interfaces/products.model";
import useMediaQuery from '@mui/material/useMediaQuery';

type props = {
    selectedSub: ItemSubClass | null,
    selectedCategory: number | false,
    setSelectedCategory: (category: number | false) => void,
    setSelectedSub: (subCategory: ItemSubClass | null) => void,
    categories: Category[],
    open: boolean,
    setOpen: (value: boolean) => void
}

const SideFilter = (props: props) => {

    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const { selectedSub, selectedCategory, setSelectedCategory, setSelectedSub, categories, open, setOpen } = props

    const handleChange = (panel: number) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setSelectedCategory(isExpanded ? panel : false);
        if (!isExpanded || panel !== selectedSub?.itemSubClassId)
            setSelectedSub(null)
    };

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'static',
                    height: 'auto',
                    m: 4,
                    pt: 4,
                    pb: 20,
                    borderRight: 'none'
                }
            }}
            variant={isMdOrLess ? 'temporary' : 'permanent'}
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
        >
            <Typography variant="subtitle2" px={2} mb={3}>All Categories</Typography>
            {categories?.map(category => {
                return (
                    <Accordion
                        key={category.itemClassId}
                        expanded={selectedCategory === category.itemClassId}
                        onChange={handleChange(category.itemClassId)}
                        sx={{
                            boxShadow: 'none',
                            mb: "24px!important",
                            "&:before": {
                                bgcolor: 'transparent'
                            }
                        }}
                    >
                        <AccordionSummary
                            sx={{
                                minHeight: '0!important',
                                ".MuiAccordionSummary-content": {
                                    m: "0!important"
                                }
                            }}
                            expandIcon={<ChevronIcon />}
                        >
                            {selectedCategory === category.itemClassId &&
                                <Box width={7} bgcolor="success.main"
                                    sx={{
                                        position: "absolute",
                                        left: 0,
                                        height: "100%",
                                        bottom: 0
                                    }}
                                />
                            }
                            <Typography variant="subtitle2">{category.itemClass}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {category.children.length > 0 &&
                                <List sx={{ bgcolor: (theme) => alpha(theme.palette.info.main, 0.1) }}>
                                    {category.children.map(subCategory => {
                                        return (
                                            <ListItemButton sx={{ py: 0 }}
                                                key={subCategory.itemSubClassId}
                                                onClick={() => setSelectedSub(subCategory)}
                                            >
                                                <ListItemText disableTypography >
                                                    <Typography
                                                        variant="subtitle2"
                                                        color={selectedSub?.itemSubClassId === subCategory.itemSubClassId ? "success.main" : ""}
                                                        fontWeight={400}
                                                    >
                                                        {subCategory.itemSubClass}
                                                    </Typography>
                                                </ListItemText>
                                            </ListItemButton>
                                        )
                                    })}
                                </List>
                            }
                        </AccordionDetails>
                    </Accordion>
                )
            })}

        </Drawer>
    )
}

export default SideFilter;