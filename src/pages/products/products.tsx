import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import IconButton from "@mui/material/IconButton";
import MenuItem from '@mui/material/MenuItem';
import Grid from "@mui/material/Grid";
import CircularProgress from '@mui/material/CircularProgress';
import ProductCard from 'components/product-card/product-card.component';
import SideFilter from 'components/sidefilter/sidefilter.component';
import { ReactComponent as GridIcon } from 'assets/icons/grid.svg';
import { ReactComponent as ListIcon } from 'assets/icons/list.svg';
import { ReactComponent as FilterIcon } from 'assets/icons/filter.svg';
import { ItemSubClass, Product } from "interfaces/products.model";
import { getProducts } from "api/services/products.services";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const productsCount = 10
const defaultParams = `?take=${productsCount}`

export enum sortEnum {
    'Date' = 1,
    'Price' = 2,
}

const Products = () => {

    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const categories = useSelector((state: RootState) => state.categories.categories)
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

    const [queryParams, setQueryParams] = useState<string>(defaultParams)
    const [productsList, setProductsList] = useState<Product[]>([])
    const [pageNumber, setPageNumber] = useState<number>(0)
    const [isGridListing, setIsGridListing] = useState<boolean>(true)
    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<number | false>(false);
    const [selectedSub, setSelectedSub] = useState<ItemSubClass | null>(null);
    const [selectedSort, setSelectedSort] = useState<string>('');
    const hasMore = useRef<boolean>(true)
    const paramsRef = useRef<string>(defaultParams)

    const [searchParams] = useSearchParams()

    const { isLoading, isFetching } = useQuery<Product[]>(['products', queryParams], () => getProducts(queryParams),
        {
            onSuccess: (data) => {
                if (hasMore.current) {
                    const productsId = new Set(productsList.map(x => x.itemId))
                    const dataId = new Set(data.map(x => x.itemId))
                    const checkDups = ([...productsList.filter(x => !dataId.has(x.itemId)), ...data.filter(x => !productsId.has(x.itemId))])
                    if (checkDups.length > 0)
                        setProductsList(prev => [...prev, ...data])
                }
                if (data.length < productsCount)
                    hasMore.current = false
            },
            enabled: isLoggedIn
        }
    )

    const observer = useRef<IntersectionObserver | null>(null)
    const lastElementRef = useCallback(node => {
        if (isLoading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore.current)
                setPageNumber(prev => prev + 1)
        })
        if (node) observer.current.observe(node)
    }, [isLoading])

    useEffect(() => {
        if (pageNumber > 0)
            setQueryParams(`${paramsRef.current}&skip=${pageNumber * productsCount}`)
    }, [pageNumber])

    useEffect(() => {
        paramsRef.current = defaultParams
        if (selectedCategory)
            paramsRef.current += `&classId=${selectedCategory}`
        if (selectedSub)
            paramsRef.current += `&subClassId=${selectedSub?.itemSubClassId}`
        if (selectedSort !== '')
            paramsRef.current += `&sort_by=${selectedSort}`
        if (searchParams.get('search'))
            paramsRef.current += `&productName=${searchParams.get('search')}`
        setQueryParams(paramsRef.current)
        setPageNumber(0)
        setProductsList([])
        hasMore.current = true
    }, [selectedCategory, selectedSub, searchParams, selectedSort])

    useEffect(() => {
        if (searchParams.get('category') && searchParams.get('category') !== '0') {
            setSelectedCategory(Number(searchParams.get('category')))
            if (searchParams.get('subCategory')) {
                let parent = categories.find(category => category.itemClassId === Number(searchParams.get('category')))
                let child = parent?.children.find(sub => sub.itemSubClassId === Number(searchParams.get('subCategory')))
                if (child)
                    setSelectedSub(child)
            }
        } else {
            setSelectedCategory(false)
        }
    }, [searchParams, categories])

    const handleSortChange = (event: SelectChangeEvent) => {
        setSelectedSort(event.target.value as string);
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 4fr' },
                bgcolor: "grey.50"
            }}
        >
            <SideFilter
                selectedSub={selectedSub}
                selectedCategory={selectedCategory}
                setSelectedSub={setSelectedSub}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                open={openDrawer}
                setOpen={setOpenDrawer}
            />
            <Box py={3} px={{ xs: 2, md: 6 }} mb={10}>
                <Stack direction="row" justifyContent="space-between" alignItems={{ xs: 'start', md: 'center' }} sx={{ mb: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ xs: 'normal', md: 'center' }}>
                        <Typography variant="h4" component="h1" sx={{ mr: 1 }} >
                            Products
                        </Typography>
                        {productsList?.length > 0 &&
                            <Typography variant="subtitle1" component="span">
                                Displaying {productsList?.length} items
                            </Typography>
                        }
                        {selectedCategory &&
                            <Chip
                                color="success"
                                label={categories.find(category => category.itemClassId === selectedCategory)?.itemClass}
                                variant="outlined"
                                sx={{
                                    color: "customGreen.main",
                                    borderColor: "customGreen.main",
                                    ".MuiChip-deleteIcon": {
                                        color: "initial"
                                    }
                                }}
                                onDelete={() => { setSelectedCategory(false); setSelectedSub(null) }}
                            />
                        }
                        {selectedSub &&
                            <Chip
                                color="success"
                                label={selectedSub.itemSubClass}
                                variant="outlined"
                                sx={{
                                    color: "customGreen.main",
                                    borderColor: "customGreen.main",
                                    ".MuiChip-deleteIcon": {
                                        color: "initial"
                                    }
                                }}
                                onDelete={() => setSelectedSub(null)}
                            />
                        }
                    </Stack>
                    <Stack direction="row" spacing={4} alignItems="center">
                        {!isMdOrLess &&
                            <Select
                                value={selectedSort}
                                onChange={handleSortChange}
                                displayEmpty
                                sx={{
                                    textAlign: "center",
                                    minWidth: 176,
                                }}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return <Typography variant="body2" color="grey.400">Sort by&nbsp;</Typography>;
                                    }

                                    return (
                                        <Stack direction="row" justifyContent="center">
                                            <Typography variant="body2" color="grey.400">Sort by:&nbsp;</Typography>
                                            <Typography variant="body2">{sortEnum[Number(selected)]}</Typography>
                                        </Stack>
                                    )
                                }}
                            >
                                <MenuItem value="1">Date</MenuItem>
                                <MenuItem value="2">Price</MenuItem>
                            </Select>
                        }
                        <Stack direction="row" alignItems="center">
                            {isMdOrLess && <IconButton onClick={() => setOpenDrawer(true)}><FilterIcon /></IconButton>}
                            <IconButton onClick={() => setIsGridListing(true)}><GridIcon color={isGridListing ? "black" : "#8A8A8A"} /></IconButton>
                            <IconButton onClick={() => setIsGridListing(false)}><ListIcon color={isGridListing ? "#8A8A8A" : "black"} /></IconButton>
                        </Stack>
                    </Stack>
                </Stack>
                <Grid container spacing={3} px={{ xs: 2, md: 0 }}>
                    {productsList.length > 0 ?
                        productsList?.map((product, index) => {
                            return (
                                (productsList.length === index + 1) ?
                                    <Grid item xs={12} lg={isGridListing ? 4 : 12} key={product.itemId} ref={lastElementRef} sx={{display: "flex"}}>
                                        <ProductCard product={product} isFullWidth={!isGridListing} />
                                    </Grid>
                                    :
                                    <Grid item xs={12} lg={isGridListing ? 4 : 12} key={product.itemId} sx={{display: "flex"}}>
                                        <ProductCard product={product} isFullWidth={!isGridListing} />
                                    </Grid>
                            )
                        })
                        :
                        !isLoading && !isFetching &&
                        <Typography variant="h5" component="div" color="grey.900" sx={{ m: "auto", py: 5 }}>
                            No Items Found
                        </Typography>
                    }
                </Grid>
                {(isLoading || isFetching) &&
                    <Stack alignItems="center" justifyContent="center" p={10}>
                        <CircularProgress />
                    </Stack>
                }
            </Box>
        </Box>
    )
}

export default Products;