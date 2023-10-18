import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from '@mui/material/Typography';
import Stack from "@mui/material/Stack";
import CardContent from "@mui/material/CardContent";
import Skeleton from '@mui/material/Skeleton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ReactComponent as BoxIcon } from 'assets/icons/box.svg';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import placeholder from 'assets/images/placeholder-image.png';
import { Product } from "interfaces/products.model";
import { useDispatch } from 'react-redux'
import { addItem } from 'store/slices/cartSlice'

type HomeCardProps = {
    isLoading?: boolean,
    product?: Product
};

const HomeCard = (props: HomeCardProps) => {

    const { isLoading, product } = props
    const dispatch = useDispatch()
    const [openNotification, setOpenNotification] = useState<boolean>(false);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    return (
        <>
            <Card sx={{ p: { xs: 1, md: 2 }, position: "relative" }}>
                <Stack height="100%">
                    <Stack direction="row" alignItems="center" spacing={0.5} mb={1} color="secondary.main">
                        {isLoading ?
                            <Skeleton >
                                <BoxIcon />
                                <Typography variant="caption"> {product?.categoryName ?? "Category"} </Typography>
                            </Skeleton>
                            :
                            <>
                                <BoxIcon />
                                <Typography variant="caption"> {product?.categoryName ?? "Category"} </Typography>
                            </>
                        }
                    </Stack>
                    <Box px={2.5}>
                        {isLoading ?
                            <Skeleton sx={{ height: { xs: 89, sm: 159 } }} variant="rectangular" />
                            :
                            <CardMedia
                                component="img"
                                image={product?.imageUrl ?? placeholder}
                                sx={{ height: { xs: 89, sm: 159 } }}
                            />
                        }
                    </Box>
                    <CardContent sx={{ p: 1 }}>
                        {isLoading ?
                            <Skeleton >
                                <Typography variant="body2">Description</Typography>
                                <Typography variant="h6" component="p">$499.00</Typography>
                            </Skeleton>
                            :
                            <>
                                <Typography variant="body2">{product?.itemDescription}</Typography>
                                <Typography variant="h6" component="p">${product?.itemPrice?.toLocaleString()}</Typography>
                            </>
                        }
                    </CardContent>
                    <CardActions sx={{ marginTop: "auto" }}>
                        {isLoading ?
                            <Skeleton sx={{ m: 'auto' }}>
                                <Button variant="outlined" startIcon={<CartIcon />}>Add to Cart</Button>
                            </Skeleton>
                            :
                            product &&
                            <Stack alignItems="center" width="100%">
                                <Button
                                    variant="outlined"
                                    sx={{ m: 'auto', borderRadius: "50px" }}
                                    startIcon={<CartIcon />}
                                    onClick={() => { product.isInStock && dispatch(addItem({ ...product, quantity: 1 })); setOpenNotification(true) }}
                                    disabled={!product.isInStock}
                                >
                                    Add to Cart
                                </Button>
                                {!product.isInStock && <Typography color="error" mt={2}>Out of stock</Typography>}
                            </Stack>
                        }
                    </CardActions>
                    {!isLoading &&
                        <Box
                            sx={{
                                position: "absolute",
                                right: "-25px",
                                top: "-25px",
                                transform: "rotate(43.91deg)",
                                bgcolor: "customYellow.main",
                                width: "50px",
                                height: "50px"
                            }}
                        >
                            <Typography variant="caption"
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: "12px"
                                }}>
                                New
                            </Typography>
                        </Box>
                    }
                </Stack>
            </Card>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="success">
                    Item added successfully!
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default HomeCard;