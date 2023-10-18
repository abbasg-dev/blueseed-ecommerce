import { useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from '@mui/material/Typography';
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import { ReactComponent as HeartIcon } from 'assets/icons/heart.svg';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { ReactComponent as BoxIcon } from 'assets/icons/box.svg';
import { Product } from "interfaces/products.model";
import { useDispatch } from 'react-redux'
import { addItem } from 'store/slices/cartSlice'
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import placeholder from 'assets/images/placeholder-image.png';


type ProductCardProps = {
    product: Product,
    isFullWidth: boolean
};

const ProductCard = (props: ProductCardProps) => {

    const { product, isFullWidth } = props
    const dispatch = useDispatch()
    const theme = useTheme();
    const isMdOrLess =
        useMediaQuery(theme.breakpoints.down('md'));

    const [quantity, setQuantity] = useState<string>('');
    const [openNotification, setOpenNotification] = useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.trim() === '')
            setQuantity('');
        else if (!isNaN(Number(event.target.value)))
            setQuantity(event.target.value);
    };

    const onAddItem = (product: Product) => {
        if (product.isInStock) {
            dispatch(addItem({ ...product, quantity: Number(quantity) ? Number(quantity) : 1 }))
            setQuantity('')
            setOpenNotification(true);
        }
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    return (
        <>
            <Card sx={{ p: isFullWidth ? 1.5 : 2.5, width: "100%" }}>
                <Stack direction={isFullWidth && !isMdOrLess ? 'row' : 'column'}>
                    {isFullWidth &&
                        <Box sx={{ display: "flex", mr: { xs: 0, md: 5 }, alignItems: "center" }}>
                            <CardMedia
                                component="img"
                                height="159"
                                image={product?.imageUrl ?? placeholder}
                            />
                        </Box>
                    }
                    <Box flexGrow={1}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={{ xs: 0, md: 2 }} px={{ xs: 0, md: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} color="secondary.main" >
                                <BoxIcon />
                                <Typography variant="caption"> {product?.categoryName ?? "Category"} </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="baseline" spacing={1}>
                                {isFullWidth &&
                                    <Typography variant="h6" component="p">${product?.itemPrice?.toLocaleString()}</Typography>
                                }
                                <IconButton>
                                    <HeartIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        {!isFullWidth &&
                            <Box px={5}>
                                <CardMedia
                                    component="img"
                                    height="159"
                                    image={product?.imageUrl ?? placeholder}
                                    sx={{ objectFit: 'contain' }}
                                />
                            </Box>
                        }
                        <CardContent sx={{ px: { xs: 1, md: 2 }, pb: { xs: 0, md: 2 } }}>
                            {!isFullWidth &&
                                <Stack direction="row" mb={1} spacing={1}>
                                    <Typography variant="caption" color="grey.600">{product?.manufacturerName ?? "Brand Name"}</Typography>
                                    <Divider orientation="vertical" flexItem />
                                    <Typography variant="caption" color="grey.600">Item No. {product?.itemNumber ?? "00200200"}</Typography>
                                </Stack>
                            }
                            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between">
                                <Typography variant="body2">{product?.itemDescription}</Typography>
                                {isFullWidth &&
                                    <Box>
                                        <Typography variant="caption" color="grey.600" component="div">{product?.manufacturerName ?? "Brand Name"}</Typography>
                                        <Typography variant="caption" color="grey.600" component="div">Item No. {product?.itemNumber ?? "00200200"}</Typography>
                                    </Box>
                                }
                            </Stack>
                            {!isFullWidth &&
                                <Typography variant="h6" component="p">${product?.itemPrice?.toLocaleString()}</Typography>
                            }
                        </CardContent>
                        <CardActions>
                            <Stack width="100%">
                                {!isFullWidth &&
                                    <InputLabel sx={{ color: "common.black", textAlign: { xs: "center", md: "left" } }}>
                                        QTY
                                    </InputLabel>
                                }
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                                    {isFullWidth &&
                                        <InputLabel sx={{ color: "common.black" }}>
                                            QTY
                                        </InputLabel>
                                    }
                                    <TextField variant="outlined" size="small" sx={{ width: "106px" }} value={quantity} onChange={handleChange} disabled={!product.isInStock} />
                                    <Button variant="outlined" sx={{ m: 'auto', borderRadius: "50px" }} startIcon={<CartIcon />}
                                        onClick={() => onAddItem(product)} disabled={!product.isInStock}
                                    >
                                        Add to Cart
                                    </Button>
                                </Stack>
                                {!product.isInStock && <Typography textAlign="center" color="error" mt={2}>Out of stock</Typography>}
                            </Stack>
                        </CardActions>
                    </Box>
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

export default ProductCard;