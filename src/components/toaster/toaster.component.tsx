import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { alpha } from "@mui/material/styles";
import { ReactComponent as AlertIcon } from "assets/icons/alert.svg";

type props = {
  open: boolean;
  title: string;
  description: string;
  buttonText: string;
  handleClose: () => void;
  handleConfirm: () => void;
};

const Toaster = (props: props) => {
  const { open, handleClose, handleConfirm, title, description, buttonText } =
    props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        ".MuiDialog-container": {
          alignItems: "flex-end",
          justifyContent: "flex-start",
        },
        ".MuiDialog-paperScrollPaper": {
          bgcolor: "customGrey.dark",
          color: "common.white",
        },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        <Stack direction="row" spacing={1}>
          <AlertIcon />
          <span>{title}</span>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          color="grey.400"
          ml={4}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-start", ml: 6 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          autoFocus
          sx={{
            bgcolor: (theme) => alpha(theme.palette.common.white, 0.35),
            mb: 1,
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Toaster;
