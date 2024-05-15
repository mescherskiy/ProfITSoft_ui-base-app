import React from 'react'
import SnackbarMUI  from '@mui/material/Snackbar'

function Snackbar({
    open,
    onClose,
    message,
}) {
    return (
        <SnackbarMUI
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message={message}
        />
    )
}

export default Snackbar