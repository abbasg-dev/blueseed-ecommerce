import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { alpha } from '@mui/material/styles';
// import { ReactComponent as Tick } from 'assets/icons/tick.svg';
import { ReactComponent as NavButton } from 'assets/icons/button.svg';
import { getNotifications, notificationSeen } from 'api/services/updates.services';
import { QueryResult } from 'interfaces/orders.model';
import { NotificationModel } from 'interfaces/updates.model';
import * as ROUTES from 'constants/routes'

const defaultPageSize = '15'

const Updates = () => {

    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState<string>(defaultPageSize);
    const [pageCount, setPageCount] = useState<string>('1');
    const [queryParams, setQueryParams] = useState<string>('');
    let seenNotification = useRef<NotificationModel>()

    const { data } = useQuery<QueryResult<NotificationModel>>(['notifications', queryParams], () => getNotifications(queryParams), { enabled: !!queryParams })


    const seenMutation = useMutation(notificationSeen, {
        onSuccess() {
            notificationNavigation()
        }
    })

    useEffect(() => {
        if (pageSize && pageCount) {
            let params = `?PageSize=${pageSize}&PageStart=${Number(pageSize) * (Number(pageCount) - 1)}`
            setQueryParams(params)
        }
    }, [pageSize, pageCount])


    const handlePageSizeChange = (event: SelectChangeEvent) => {
        setPageSize(event.target.value as string);
        setPageCount('1')
    };

    const handlePageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (event.target.value.trim() === '')
            setPageCount('');
        if (!isNaN(Number(value)) && Number(value) > 0 && Number(value) <= getTotalPages())
            setPageCount(value);
    };

    const handleNextClick = () => {
        if (Number(pageCount) >= getTotalPages())
            setPageCount(getTotalPages().toString())
        else
            setPageCount(c => (Number(c) + 1).toString())
    }

    const handlePrevClick = () => {
        if (Number(pageCount) <= 1)
            setPageCount('1')
        else
            setPageCount(c => (Number(c) - 1).toString())
    }

    const getPagesOptions = () => {
        const options = [15, 30, 50, 75, 100]
        let result = [15]
        for (let i = 0; i < options.length; i++)
            if (data && data?.count > options[i] && options[i + 1])
                result.push(options[i + 1])
        return result
    }

    const getTotalPages = () => {
        if (data?.count && pageSize)
            return Math.ceil(data.count / Number(pageSize))
        return 1
    }

    const checkNotification = (notification: NotificationModel) => {
        seenNotification.current = notification
        if (notification.isSeen)
            notificationNavigation()
        else
            seenMutation.mutate([notification.ecommerceNotificationId])
    }

    const notificationNavigation = () => {
        let route = seenNotification.current?.referenceType === 1 ? `/${ROUTES.MYORDERS}/${ROUTES.ORDERS}` : `/${ROUTES.RMA}`
        navigate(`${route}/${seenNotification.current?.referenceId}`)
    }

    return (

        <Box py={3} bgcolor="grey.50" minHeight={"40vh"}>
            <Container>
                <Typography variant="h4" component="h1" mb={1.5} >
                    New updates
                </Typography>
                <Paper sx={{ py: 2 }}>
                    {data?.data.map(update => {
                        return (
                            <Stack direction="row" key={update.ecommerceNotificationId} className="update" onClick={() => checkNotification(update)}
                                sx={{
                                    pl: 4, pr: 10, py: 2, borderBottom: "1px solid", borderColor: "grey.300",
                                    cursor: "pointer",
                                    // bgcolor: (theme) => update.isSeen ? '' : alpha(theme.palette.customGreen.main, 0.1),
                                    '&.update:last-child': {
                                        pb: 4
                                    }
                                }}
                            >
                                <Stack direction="row" flexGrow={1} position="relative">

                                    {!update.isSeen &&
                                        <Box width={7} height={7} bgcolor="error.main"
                                            sx={{ position: 'absolute', left: '-17px', top: '50%', transform: 'translateY(-50%)', borderRadius: '50%' }} />
                                    }
                                    <Typography variant='body2' fontWeight={update.isSeen ? 'normal' : 'bold'}>
                                        {update.message.split(' ').map((t, index) => {
                                            if (t.startsWith("#"))
                                                return <span key={index} className='hashtag'>{t} </span>;
                                            return <span key={index}>{t} </span>
                                        })}
                                    </Typography>
                                    {/* {!update.isSeen &&
                                        <Stack sx={{ position: 'absolute', left: '-21px', top: '50%', transform: 'translateY(-50%)' }}>
                                            <Tick />
                                        </Stack>
                                    } */}
                                </Stack>
                                <Typography variant='subtitle2' fontWeight={update.isSeen ? 'normal' : 'bold'}>
                                    {new Date(update.modifiedDate).toLocaleDateString()}
                                </Typography>
                            </Stack>
                        )
                    })}
                    <Stack direction="row" p={2} justifyContent={{ xs: "center", md: 'space-between' }}>
                        <Stack direction="row" alignItems="center">
                            <IconButton onClick={handlePrevClick}>
                                <NavButton />
                            </IconButton>
                            <Box width="32px" height="32px" sx={{ border: "1px solid", borderColor: "grey.400" }}>
                                <input type="number" className='paging-input' value={pageCount} onChange={handlePageChange} />
                            </Box>
                            <Typography variant='body2' mx={1} sx={{ color: 'grey.400' }}>
                                /
                            </Typography>
                            <Typography variant='body2'>
                                {getTotalPages()}
                            </Typography>
                            <IconButton className='flip' onClick={handleNextClick}>
                                <NavButton />
                            </IconButton>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <InputLabel sx={{ color: "common.black" }}>Rows per page</InputLabel>
                            <Select
                                value={getPagesOptions().includes(Number(pageSize)) ? pageSize : ''}
                                onChange={handlePageSizeChange}
                                size="small"
                                sx={{
                                    textAlign: "center",
                                }}
                            >
                                {getPagesOptions().map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                            </Select>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    )
}

export default Updates;