import { useState, useRef } from "react";
import { useMutation } from "react-query";
import { contactService } from "api/services/login.services";
import { useSelector } from 'react-redux';
import { RootState } from 'store/store'
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import InputLabel from '@mui/material/InputLabel';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Contact = () => {

    const [value, setValue] = useState<string>('');
    const [openNotification, setOpenNotification] = useState<boolean>(false)
    const notificationSeverity = useRef<number>(0)

    const info = useSelector((state: RootState) => state.userInfo.userInfo)

    const mutation = useMutation(contactService,
        {
            onSuccess() {
                notificationSeverity.current = 1
                setOpenNotification(true)
                setValue('')
            },
            onError() {
                notificationSeverity.current = 2
                setOpenNotification(true)
            },
        }
    )

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenNotification(false);
    };

    const onSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setOpenNotification(false)
        mutation.mutate(value)
    }

    return (
        <>
            <Box px={{ xs: 0, md: 3 }} py={{ xs: 2, md: 3 }} sx={{ bgcolor: "grey.50" }}>
                <Container>
                    <Paper>
                        <Stack direction="row" spacing={{ xs: 1, md: 4 }} alignItems="center" pt={2} mx={{ xs: 0, md: 2 }} mb={3}>
                            <Box flexGrow={1} height="2px" bgcolor="primary.main" />
                            <Typography variant="h4" fontSize={{ xs: "15px", md: "40px" }}>Welcome to Ecommerce Blueseed</Typography>
                            <Box flexGrow={1} height="2px" bgcolor="primary.main" />
                        </Stack>
                        <Stack mx={{ xs: 1.5, md: 14 }} pb={{ xs: 4, md: 10 }} component="form" onSubmit={onSubmit}>
                            {info&& <Typography variant="body1" mb={5}>Hello “Mr(s). {info.fullname}“ please write down your message</Typography>}
                            <InputLabel sx={{ color: "common.black", mb: 1 }}>Message</InputLabel>
                            <TextField
                                value={value}
                                onChange={handleChange}
                                multiline
                                variant="outlined"
                                fullWidth
                                minRows={8}
                                sx={{ mb: 4 }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                sx={{ m: "auto", px: 10, py: 1.5, borderRadius: "50px", zIndex: 1 }}
                                disabled={value.trim() === ''}
                            >
                                Send
                            </Button>
                        </Stack>

                    </Paper>
                </Container>
            </Box>
            <Snackbar open={openNotification} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity={notificationSeverity.current === 1 ? "success" : "error"}>
                    {notificationSeverity.current === 1 ?
                        "Message sent successfully"
                        :
                        "Failed to send message"
                    }
                </MuiAlert>
            </Snackbar>
        </>
    )
}

export default Contact;