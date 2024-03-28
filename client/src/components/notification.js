import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@material-ui/lab/Alert';

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
            autoHideDuration={5000}
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            onClose={handleClose}
        >
            <Alert 
                severity={notify.type} /*se eu quiser o X para fechar tenho que habilitar isso => onClose={handleClose}*/>
                {notify.message}
            </Alert>
        </Snackbar>
    )
}