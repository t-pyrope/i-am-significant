import { Box, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  maxWidth: "calc(100vw - 20px)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
};

export const AppModal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <IconButton aria-label="Закрыть" onClick={onClose}>
          <CloseIcon fontSize="inherit" />
        </IconButton>
        {children}
      </Box>
    </Modal>
  );
};
