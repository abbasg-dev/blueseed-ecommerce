import { useState } from "react";
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import { Link as RouterLink } from 'react-router-dom';
import * as ROUTES from 'constants/routes'
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow.svg';
import SelectOrder from "./select-order";
import SelectItems from "./select-items";


const RmaRequest = () => {

    const [activeStep, setActiveStep] = useState<number>(0);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Box py={3} px={{ xs: 0, md: 3 }} sx={{ bgcolor: "grey.50" }}>
            <Container>
                <Button
                    variant="text" color="secondary"
                    startIcon={<ArrowIcon className='flip' width={24} height={24} />}
                    sx={{ color: "common.black", mb: 2 }}
                    component={RouterLink} to={`/${ROUTES.RMA}`}
                >
                    <Typography variant='h4' component='h1'>Request RMA</Typography>
                </Button>
                <Paper sx={{ px: { xs: 1, md: 3 }, py: 3 }}>
                    <Stepper nonLinear activeStep={activeStep} connector={<ArrowIcon />}
                        sx={{
                            mb: 3,
                            color: "grey.500",
                            ".MuiStepIcon-root": {
                                color: "common.white",
                                border: "1px solid",
                                borderRadius: "50%",
                                borderColor: "grey.500",
                                "text": {
                                    fill: (theme) => theme.palette.grey[500]
                                },
                                "&.Mui-active": {
                                    borderColor: "primary.main",
                                    color: "common.white",
                                    "text": {
                                        fill: (theme) => theme.palette.primary.main
                                    },
                                }
                            },
                            ".MuiStepLabel-label.Mui-active": {
                                color: "primary.main",
                                fontWeight: 400
                            }
                        }}
                    >
                        <Step>
                            <StepButton color="inherit" onClick={handleStep(0)}>
                                Select order
                            </StepButton>
                        </Step>
                        <Step >
                            <StepButton color="inherit" onClick={handleStep(1)} disabled={!selectedOrder}>
                                Select item to return
                            </StepButton>
                        </Step>
                    </Stepper>
                    <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
                        <SelectOrder setSelectedOrder={setSelectedOrder} />
                    </Box>
                    {selectedOrder && activeStep === 1 &&
                        <SelectItems selectedOrder={selectedOrder} />
                    }
                </Paper>
            </Container>
        </Box>
    )
}

export default RmaRequest;