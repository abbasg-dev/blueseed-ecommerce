import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { ReactComponent as RemoveIcon } from 'assets/icons/remove.svg';
import { Product } from "interfaces/products.model";
import { useDispatch } from 'react-redux'
import { removeItem, changeItemQuantity } from 'store/slices/cartSlice'
import placeholder from 'assets/images/placeholder-image.png';

type props = {
    product: Product
}

const CartCard = (props: props) => {

    const { product } = props
    const dispatch = useDispatch()

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.trim() === '' || !isNaN(Number(event.target.value))) {
            dispatch(changeItemQuantity({ ...product, quantity: Number(event.target.value) }))
        }
    };

    return (
        <Box p={1}>
            <Stack direction="row" justifyContent="space-between" mb={2} alignItems="start">
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <Box width={60} height={60} sx={{ borderRadius: "17px", overflow: "hidden", flexShrink: 0 }}>
                        <img
                            src={product?.imageUrl ?? placeholder}
                            alt=""
                            width="100%"
                        />
                    </Box>
                    <Stack p={1}>
                        <Typography variant="subtitle1" fontSize={15}>{product?.itemNumber}</Typography>
                        <Typography variant="subtitle1" fontSize={15} sx={{ mt: "auto" }}>{product?.manufacturerName}</Typography>
                    </Stack>
                </Stack>
                <IconButton onClick={() => dispatch(removeItem({ ...product }))}>
                    <RemoveIcon />
                </IconButton>
            </Stack>
            <Typography variant="body2" mb={1}>{product?.itemDescription}</Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">${product?.itemPrice}</Typography>
                <TextField variant="outlined" size="small"
                    value={product?.quantity ?? ''} onChange={handleQuantityChange}
                    sx={{
                        width: "70px",
                        py: "5px",
                        borderRadius: "6px",
                        bgcolor: "customGrey.main",
                        "fieldset": { border: "none" },
                        "input": { textAlign: "center" }
                    }}
                />
                <Typography variant="subtitle2">${product?.itemPrice * product?.quantity}</Typography>
            </Stack>
        </Box>
    )
}

export default CartCard;