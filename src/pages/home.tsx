import { useState, useEffect } from "react";
import { useQuery } from 'react-query';
import { getManufacturerImages, getProducts } from "api/services/products.services";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'store/store'
import { setCategories } from 'store/slices/categoriesSlice'
import { Category, Product } from "interfaces/products.model";
import { Link as RouterLink } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
// MUI Components
import Stack from '@mui/material/Stack';
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import { useTheme, alpha } from '@mui/material/styles';

import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import { ReactComponent as GlobalIcon } from 'assets/icons/global.svg';
import { ReactComponent as BoxIcon } from 'assets/icons/box.svg';
import { ReactComponent as CostIcon } from 'assets/icons/cost.svg';
import HomeCard from "components/home-card/home-card.component";
import SwiperComponent from "components/swiper/swiper.component"
import useMediaQuery from '@mui/material/useMediaQuery';

const productsCount = 8
const defaultParams = `?take=${productsCount}`

const Home = () => {

    const dispatch = useDispatch()
    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const categories = useSelector((state: RootState) => state.categories.categories)
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

    const [selectedCategory, setSelectedCategory] = useState<null | Category>(null)
    const [queryParams, setQueryParams] = useState<string>(defaultParams)

    const {
        isLoading: isLoadingProducts,
        isFetching: isFetchingProducts,
        data: products
    } = useQuery<Product[]>(['home-products', queryParams], () => getProducts(queryParams), { enabled: isLoggedIn })

    const {
        data: images
    } = useQuery('manufacturers', getManufacturerImages)

    const handleChipClick = (selected: Category) => {
        setSelectedCategory(selected)
    };

    useEffect(() => {
        let params = defaultParams
        if (selectedCategory)
            params += `&classId=${selectedCategory.itemClassId}`
        setQueryParams(params)
    }, [selectedCategory])

    useEffect(() => {
        if (!isLoggedIn)
            dispatch(setCategories([]))
    }, [isLoggedIn, dispatch])

    return (
        <>
            <SwiperComponent />
            <Container sx={{ py: 4, mb: 6 }} component={"section"}>
                <Typography variant="h4" component="h2" textAlign="center">
                    New Products
                </Typography>
                <Stack direction="row" justifyContent={{ xs: 'normal', md: 'center' }} sx={{ mt: 2, mb: 4, width: '100%', overflow: 'auto' }}>
                    {
                        categories?.map((category) => {
                            return (
                                <div key={category.itemClassId}>
                                    {
                                        category.itemClassId === selectedCategory?.itemClassId ?
                                            <Chip
                                                color="success"
                                                label={category.itemClass}
                                                variant="outlined"
                                                onClick={() => handleChipClick(category)}
                                                sx={{ m: 1, borderRadius: "7px", color: "customGreen.main", borderColor: "customGreen.main" }}
                                            />
                                            :
                                            <Chip
                                                color="info"
                                                label={category.itemClass}
                                                onClick={() => handleChipClick(category)}
                                                sx={{ m: 1, bgcolor: (theme) => alpha(theme.palette.info.main, 0.38), borderRadius: "7px" }}
                                            />
                                    }
                                </div>
                            )
                        })}
                    <Button variant="text" endIcon={<ArrowIcon />} component={RouterLink} to={ROUTES.PRODUCTS} sx={{ color: "common.black", flexShrink: 0 }}>
                        Browse All
                    </Button>
                </Stack>
                <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                    {
                        isLoggedIn ?
                            (
                                (isLoadingProducts || isFetchingProducts) ?
                                    Array.from(Array(productsCount).keys()).map((key) => {
                                        return (
                                            <Grid item xs={6} sm={4} md={3} key={key}>
                                                <HomeCard isLoading={isLoadingProducts || isFetchingProducts} />
                                            </Grid>
                                        )
                                    })
                                    :
                                    products && products?.length > 0 ?
                                        products?.map((product) => {
                                            return (
                                                <Grid item xs={6} sm={4} md={3} key={product.itemId} sx={{ display: "flex" }}>
                                                    <HomeCard product={product} />
                                                </Grid>
                                            )
                                        })
                                        :
                                        <Typography variant="h5" component="div" color="grey.900" sx={{ m: "auto", py: 5 }}>
                                            No Items Found
                                        </Typography>
                            )
                            :
                            <Typography variant="h5" component="div" color="grey.900" sx={{ m: "auto", py: 5 }}>
                                Please log in to view products
                            </Typography>
                    }
                </Grid>
                <Box textAlign="center" sx={{ mt: 4 }}>
                    <Button variant="text" component={RouterLink} to={ROUTES.PRODUCTS}
                        sx={{ borderRadius: "50px", color: "common.black", boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.25)", px: 8, py: 1 }}>
                        More items
                    </Button>
                </Box>
            </Container>
            <Container sx={{ py: 4, mb: 8 }} component={"section"}>
                <Typography variant="h4" component="h2" textAlign="center" mb={8}>
                    What makes us stand out
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 3, md: 0 }} justifyContent="space-between" divider={<Divider orientation="vertical" flexItem />}>
                    <Stack alignItems="center">
                        <Box width={{ xs: 92, md: 132 }} height={{ xs: 92, md: 132 }}
                            sx={{
                                border: "4px solid",
                                borderColor: "primary.main",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3
                            }}
                        >
                            <GlobalIcon />
                        </Box>
                        <Typography maxWidth={300} textAlign="center">
                            A global network of trustworthy drop shippers and wholesalers
                        </Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Box width={{ xs: 92, md: 132 }} height={{ xs: 92, md: 132 }}
                            sx={{
                                border: "4px solid",
                                borderColor: "primary.main",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3,
                                color: "primary.main"
                            }}
                        >
                            <BoxIcon width={42} height={42} />
                        </Box>
                        <Typography maxWidth={300} textAlign="center">
                            Fill your  store with high-profit products in minutes
                        </Typography>
                    </Stack>
                    <Stack alignItems="center">
                        <Box width={{ xs: 92, md: 132 }} height={{ xs: 92, md: 132 }}
                            sx={{
                                border: "4px solid",
                                borderColor: "primary.main",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 3
                            }}
                        >
                            <CostIcon />
                        </Box>
                        <Typography maxWidth={300} textAlign="center">
                            No startup costs, no risk, no monthly fees
                        </Typography>
                    </Stack>
                </Stack>
            </Container>
            {!isMdOrLess &&
                <Box sx={{ py: 4, mb: 8 }} component={"section"}>
                    <Typography variant="h4" component="h2" textAlign="center" mb={8}>
                        Variety brands
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="center" flexWrap="wrap">
                        {
                            images?.map((key: string) => {
                                return (
                                    <Box width={200} px={3} py={4} key={key}>
                                        <img
                                            src={key}
                                            alt=""
                                            className="manufacturer-image"
                                        />
                                    </Box>
                                )
                            })
                        }
                    </Stack>
                </Box>
            }
        </>
    )
}

export default Home;