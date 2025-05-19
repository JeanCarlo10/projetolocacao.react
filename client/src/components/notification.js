import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Notification(props) {
    const { notify, setNotify } = props;

    const handleClose = (event, reason) => {
        setNotify({
            ...notify,
            isOpen: false
        })
    }

    return (
        <Snackbar
            open={notify.isOpen}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={handleClose}
        >
            <Alert
                style={{
                    fontSize: 16,
                    fontWeight: 600
                }}
                severity={notify.type} /*se eu quiser o X para fechar tenho que habilitar isso => onClose={handleClose}*/>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}