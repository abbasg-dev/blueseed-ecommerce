import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector, useDispatch } from 'react-redux'
import { logout } from 'store/slices/authSlice'
import { setCategories } from 'store/slices/categoriesSlice'
import { createSearchParams, NavLink as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { RootState } from 'store/store'
// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme, alpha } from '@mui/material/styles';
// SVG Icons
import { StyledLogo, StyledCoin } from './header.style';
import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { ReactComponent as BurgerIcon } from 'assets/icons/burger.svg';
import { ReactComponent as UserIcon } from 'assets/icons/user.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as ChevronIcon } from 'assets/icons/filled-chevron.svg';
import bell from 'assets/icons/bell.png';
import flag from 'assets/images/flag.png';

import { getFilters } from "api/services/products.services";
import { Filters } from "interfaces/products.model";
import * as ROUTES from 'constants/routes'
import useMediaQuery from '@mui/material/useMediaQuery';
import { getUserInfo } from 'api/services/login.services';
import { NotificationModel, UserInfo } from 'interfaces/updates.model';
import { setInfo } from 'store/slices/userInfoSlice';
import { QueryResult } from 'interfaces/orders.model';
import { getNotifications } from 'api/services/updates.services';


const Header = () => {

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
    const items = useSelector((state: RootState) => state.cart.items)
    const categories = useSelector((state: RootState) => state.categories.categories)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const location = useLocation()

    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const [selectedCategory, setSelectedCategory] = useState<string>('0');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [catalogAnchorEl, setCatalogAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
    const [openNotification, setOpenNotification] = useState<boolean>(false);

    const { data } = useQuery<Filters>('header-filters', getFilters, { enabled: isLoggedIn })
    const { data: notifications, refetch } = useQuery<QueryResult<NotificationModel>>('header-notifications', () => getNotifications(""), { enabled: isLoggedIn })

    const { data: userData } = useQuery<UserInfo>('user-info', getUserInfo,
        {
            enabled: isLoggedIn,
            onSuccess: (data) => {
                dispatch(setInfo(data))
            }
        }
    )

    useEffect(() => {
        if (data) {
            const categories = data?.classes?.map(category => {
                let subCategories = data.subClasses.filter(subCategory => subCategory.itemClassId === category.itemClassId)
                return { ...category, children: subCategories }
            })
            dispatch(setCategories(categories))
        }
    }, [data, dispatch])

    useEffect(() => {
        refetch()
    }, [location, refetch])

    const handleCatalogClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setCatalogAnchorEl(event.currentTarget);
    };

    const handleCatalogClose = () => {
        setCatalogAnchorEl(null);
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        setSelectedCategory(event.target.value as string);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const onLogout = () => {
        dispatch(logout())
        localStorage.removeItem("ecommerceTokens")
        setOpenNotification(true)
        navigate(ROUTES.HOME)
    }

    const onSearchClick = () => {
        navigate({
            pathname: ROUTES.PRODUCTS,
            search: `?${createSearchParams(
                {
                    category: selectedCategory,
                    search: searchTerm
                }
            )}`
        });
        setSelectedCategory('0')
    }

    const onClassClick = (classId: number) => {
        navigate({
            pathname: ROUTES.PRODUCTS,
            search: `?${createSearchParams(
                {
                    category: classId.toString(),
                }
            )}`
        });
        setCatalogAnchorEl(null)
    }

    const onSubClassClick = (classId: number, subClassId: number) => {
        navigate({
            pathname: ROUTES.PRODUCTS,
            search: `?${createSearchParams(
                {
                    category: classId.toString(),
                    subCategory: subClassId.toString(),
                }
            )}`
        });
        setCatalogAnchorEl(null)
    }

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    const catalogOpen = Boolean(catalogAnchorEl);
    const menuOpen = Boolean(menuAnchorEl);

    const notificationsLength = notifications?.data?.filter(notification => notification.isSeen === false).length

    return (
        <>
            <AppBar position="static" sx={{ bgcolor: "common.white" }}>
                <Toolbar disableGutters sx={{ flexDirection: "column" }}>
                    <Stack sx={{ width: '100%' }} divider={<Divider flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}>
                        <Stack direction="row" pt={{ xs: 1, md: 1.5 }} pb={{ xs: 1, md: 3 }} px={{ xs: 2, md: 4 }} alignItems="center" justifyContent="space-between" spacing={1}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <StyledLogo />
                                {!isMdOrLess &&
                                    <Stack direction="row">
                                        <Select
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            size="small"
                                            sx={{
                                                minWidth: 87,
                                                borderTopRightRadius: 0,
                                                borderBottomRightRadius: 0,
                                                color: "common.white",
                                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                                                textAlign: "center",
                                                "&:hover": {
                                                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.7),
                                                },
                                                "fieldset": {
                                                    border: "none"
                                                },
                                                ".MuiSelect-icon": {
                                                    color: "common.white"
                                                }
                                            }}
                                        >
                                            <MenuItem value={0}>All</MenuItem>
                                            {categories?.map(category => {
                                                return (
                                                    <MenuItem key={category.itemClassId} value={category.itemClassId}>{category.itemClass}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                        <Paper
                                            sx={{ p: '5px 4px', display: 'flex', alignItems: 'center', bgcolor: "grey.100" }}
                                            elevation={0}
                                        >
                                            <InputBase
                                                value={searchTerm}
                                                sx={{ ml: 1, flex: 1 }}
                                                onChange={handleInputChange}
                                            />
                                            <Divider sx={{ height: 24, m: 0.5 }} orientation="vertical" />
                                            <IconButton color="primary" sx={{ p: '10px' }} onClick={onSearchClick}>
                                                <SearchIcon />
                                            </IconButton>
                                        </Paper>
                                    </Stack>
                                }
                                <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 2 }}>
                                    <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
                                        <img src={flag} alt="flag" />
                                        <Typography variant='subtitle1' color="common.black" sx={{ fontSize: { xs: '12px', md: '15px' } }}>USA</Typography>
                                    </Stack>
                                    <Divider orientation='vertical' flexItem sx={{ height: "20px", alignSelf: "center", display: { xs: 'none', md: 'block' } }} />
                                    <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, md: 1 }}>
                                        <StyledCoin />
                                        <Typography variant='subtitle1' color="common.black" sx={{ fontSize: { xs: '12px', md: '15px' } }}>{isMdOrLess ? "Dollar" : "Currency\\Dollar"}</Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack direction="row" alignItems="center" flexShrink={0} spacing={{ xs: 1, md: 2 }}>
                                {isLoggedIn &&
                                    <Badge badgeContent={items.length} sx={{ ".MuiBadge-badge": { color: "common.white", bgcolor: "customGreen.main" } }} invisible={items.length === 0}>
                                        <Button variant="contained" color="secondary"
                                            sx={{ bgcolor: "common.black", minWidth: 'auto', width: { xs: '30px', md: 'auto' }, height: { xs: '30px', md: 'auto' }, ".MuiButton-startIcon": { marginRight: { xs: 0, md: 1 } } }}
                                            startIcon={<CartIcon className='flip' />}
                                            component={RouterLink} to={ROUTES.MYCART}
                                        >
                                            {isMdOrLess ? "" : "My Cart"}
                                        </Button>
                                    </Badge>
                                }
                                {isLoggedIn &&
                                    <Badge badgeContent={notificationsLength} sx={{ ".MuiBadge-badge": { color: "common.white", bgcolor: "customGreen.main" } }} invisible={notificationsLength === 0}>
                                        <IconButton sx={{ bgcolor: "grey.300", width: { xs: "32px", md: "auto" }, height: { xs: "32px", md: "auto" } }} component={RouterLink} to={ROUTES.UPDATES}>
                                            <img src={bell} alt="notifications" width="100%" />
                                        </IconButton>
                                    </Badge>
                                }
                                {isLoggedIn ?
                                    <>
                                        <Button variant="text" color="secondary" sx={{ color: "common.black", display: { xs: 'none', md: 'inline-flex' } }} startIcon={<UserIcon />} endIcon={<ChevronIcon />}
                                            onClick={handleMenuClick}
                                        >
                                            {userData?.username}
                                        </Button>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={menuOpen}
                                            onClose={handleMenuClose}
                                        >
                                            {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Order history</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Recommendations</MenuItem> */}
                                            <MenuItem onClick={onLogout}>Logout</MenuItem>
                                        </Menu>
                                    </>
                                    :
                                    <Button variant="text" color="secondary" sx={{ color: "common.black", display: { xs: 'none', md: 'inline-flex' } }} startIcon={<UserIcon />}
                                        component={RouterLink} to={ROUTES.LOGIN}
                                    >
                                        Sign in to get started
                                    </Button>
                                }
                            </Stack>
                        </Stack>
                        {isMdOrLess &&
                            <Stack direction="row" px={1.5} pb={1.5} spacing={1} height="36px">
                                <Stack direction="row" flex={1}>
                                    <Select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        size="small"
                                        sx={{
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                            color: "common.white",
                                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.5),
                                            textAlign: "center",
                                            "&:hover": {
                                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.7),
                                            },
                                            "fieldset": {
                                                border: "none"
                                            },
                                            ".MuiSelect-icon": {
                                                color: "common.white"
                                            }
                                        }}
                                    >
                                        <MenuItem value={0}>All</MenuItem>
                                        {categories?.map(category => {
                                            return (
                                                <MenuItem key={category.itemClassId} value={category.itemClassId}>{category.itemClass}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                    <Paper
                                        sx={{ p: '5px 4px', display: 'flex', alignItems: 'center', bgcolor: "grey.100" }}
                                        elevation={0}
                                    >
                                        <InputBase
                                            value={searchTerm}
                                            sx={{ ml: 1, flex: 1 }}
                                            onChange={handleInputChange}
                                            size="small"
                                        />
                                        <IconButton color="primary" sx={{ p: '10px' }} onClick={onSearchClick}>
                                            <SearchIcon />
                                        </IconButton>
                                    </Paper>
                                </Stack>
                                {isLoggedIn ?
                                    <>
                                        <Button variant="text" color="secondary" sx={{ color: "common.black" }} startIcon={<UserIcon />} endIcon={<ChevronIcon />}
                                            onClick={handleMenuClick}
                                        >
                                            Username
                                        </Button>
                                        <Menu
                                            anchorEl={menuAnchorEl}
                                            open={menuOpen}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Order history</MenuItem>
                                            <MenuItem onClick={handleMenuClose}>Recommendations</MenuItem>
                                            <MenuItem onClick={onLogout}>Logout</MenuItem>
                                        </Menu>
                                    </>
                                    :
                                    <Button variant="text" color="secondary" sx={{ color: "common.black" }} startIcon={<UserIcon />}
                                        component={RouterLink} to={ROUTES.LOGIN}
                                    >
                                        Sign in to get started
                                    </Button>
                                }
                            </Stack>
                        }
                        <Stack direction="row" justifyContent="center" position="relative" sx={{ minHeight: { xs: "40px", md: "70px" }, pl: { xs: "60px", md: 0 } }}>
                            {isLoggedIn &&
                                <Stack direction="row" justifyContent="center">
                                    <Button
                                        variant="text"
                                        sx={{
                                            fontWeight: 400, color: "common.black", fontSize: { xs: 13, md: 15 }, minWidth: { xs: 80, md: 180 },
                                            "&.active": {
                                                color: "primary.main"
                                            }
                                        }}
                                        component={RouterLink} to={ROUTES.HOME}
                                    >
                                        Home
                                    </Button>
                                    <Button
                                        variant="text"
                                        sx={{
                                            fontWeight: 400, color: "common.black", fontSize: { xs: 13, md: 15 }, minWidth: { xs: 80, md: 180 },
                                            "&.active": {
                                                color: "primary.main"
                                            }
                                        }}
                                        component={RouterLink} to={ROUTES.MYORDERS}
                                    >
                                        My orders
                                    </Button>
                                    <Button
                                        variant="text"
                                        sx={{
                                            fontWeight: 400, color: "common.black", fontSize: { xs: 13, md: 15 }, minWidth: { xs: 80, md: 180 },
                                            "&.active": {
                                                color: "primary.main"
                                            }
                                        }}
                                        component={RouterLink} to={ROUTES.PRODUCTS}
                                    >
                                        New order
                                    </Button>
                                    <Button
                                        variant="text"
                                        sx={{
                                            fontWeight: 400, color: "common.black", fontSize: { xs: 13, md: 15 }, minWidth: { xs: 80, md: 180 },
                                            "&.active": {
                                                color: "primary.main"
                                            }
                                        }}
                                        component={RouterLink} to={ROUTES.RMA}
                                    >
                                        RMA
                                    </Button>
                                </Stack>
                            }
                            <Button
                                variant={`${catalogOpen ? 'contained' : 'text'}`}
                                sx={{
                                    fontWeight: 400, fontSize: 15,
                                    position: "absolute",
                                    left: "0",
                                    top: "0",
                                    width: { xs: "66px", md: "200px" },
                                    height: "100%",
                                    ml: "0!important",
                                    borderRadius: 0,
                                    color: catalogOpen ? 'common.white' : 'common.black',
                                    bgcolor: (theme) => (isMdOrLess ? alpha(theme.palette.customOrange.main, 0.1) : ''),
                                    ".MuiButton-startIcon": { marginRight: { xs: 0, md: 1 } }
                                }}
                                startIcon={<BurgerIcon />}
                                onClick={handleCatalogClick}
                            >
                                {isMdOrLess ? "" : "Catalog"}
                            </Button>
                            <Popover
                                anchorReference={isMdOrLess ? 'anchorPosition' : 'anchorEl'}
                                anchorPosition={{ top: 0, left: 0 }}
                                open={catalogOpen}
                                anchorEl={catalogAnchorEl}
                                onClose={handleCatalogClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                sx={{
                                    ".MuiPopover-paper": {
                                        ml: "-16px",
                                        maxWidth: "calc(100% - 15px)",
                                        width: { xs: '70%', md: '100%' },
                                        borderRadius: 0
                                    }
                                }}
                            >
                                <Box p={{ xs: 0, md: 5 }} boxSizing="border-box">
                                    {isMdOrLess &&
                                        <Button
                                            variant='contained'
                                            sx={{
                                                fontSize: 15,
                                                borderRadius: 0,
                                                width: '100%',
                                                justifyContent: 'start',
                                                height: "51px"
                                            }}
                                            startIcon={<BurgerIcon />}
                                            onClick={() => setCatalogAnchorEl(null)}
                                        >
                                            Catalog
                                        </Button>
                                    }
                                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 4 }} p={{ xs: 2.5, md: 6 }}>
                                        {categories?.map(category => {
                                            return (
                                                <Box key={category.itemClassId}>
                                                    <Typography variant='subtitle2' color='primary' sx={{ cursor: 'pointer' }} onClick={() => onClassClick(category.itemClassId)}>
                                                        {category.itemClass}
                                                    </Typography>
                                                    {category?.children?.map(subCategory => {
                                                        return (
                                                            <Typography variant='subtitle1' key={subCategory.itemSubClassId} sx={{ cursor: 'pointer' }} onClick={() => onSubClassClick(category.itemClassId, subCategory.itemSubClassId)}>
                                                                {subCategory.itemSubClass}
                                                            </Typography>
                                                        )
                                                    })}
                                                </Box>
                                            )
                                        })}
                                    </Stack>
                                    <Button
                                        variant="text"
                                        endIcon={<ArrowIcon />}
                                        component={RouterLink} to={ROUTES.PRODUCTS}
                                        onClick={handleCatalogClose}
                                        sx={{ ml: { xs: 1.5, md: 0 } }}
                                    >
                                        View all Items
                                    </Button>
                                </Box>
                            </Popover>
                        </Stack>
                    </Stack>
                </Toolbar>
            </AppBar>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="success">
                    Logged out successfully!
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default Header