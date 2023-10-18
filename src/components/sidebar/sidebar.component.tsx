import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactComponent as ChevronIcon } from 'assets/icons/chevron.svg';

import { NavLink } from 'react-router-dom';

type SideBarProps = {
    menuEntries: { text: string, url: string }[]
};

const SideBar = (props: SideBarProps) => {

    const { menuEntries } = props

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    position: 'static'
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <List sx={{ mt: 6 }}>
                {menuEntries.map((entry) => (
                    <ListItem button key={entry.text} component={NavLink} to={entry.url} sx={{ py: 0, mb: 2, '&.active': { color: 'common.white', bgcolor: "primary.main" } }}>
                        <ListItemText primary={entry.text} primaryTypographyProps={{ variant: 'h6' }} />
                        <ListItemIcon sx={{ color: 'inherit', justifyContent: 'end' }}>
                            <ChevronIcon className="rotate-90" />
                        </ListItemIcon>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}

export default SideBar;