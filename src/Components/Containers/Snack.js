import React, { useRef, useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { socketPropTypes } from "../../prop-types";

const Snack = ({ socket }) => {
  const queueRef = useRef([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  const processQueue = () => {
    if (queueRef.current.length > 0) {
      setMessageInfo(queueRef.current.shift());
      setOpen(true);
    }
  };

  useEffect(() => {
    socket.on("message", (payload) => {
      queueRef.current.push(payload);

      if (open) {
        // immediately begin dismissing current message
        // to start showing new one
        setOpen(false);
      } else {
        processQueue();
      }
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    processQueue();
  };

  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      onExited={handleExited}
      message={messageInfo ? messageInfo.message : undefined}
      action={
        <IconButton aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      }
    >
      {messageInfo ? (
        <Alert onClose={handleClose} severity={messageInfo.severity}>
          {messageInfo.message}
        </Alert>
      ) : null}
    </Snackbar>
  );
};

Snack.propTypes = {
  socket: socketPropTypes.isRequired,
};

export default Snack;
