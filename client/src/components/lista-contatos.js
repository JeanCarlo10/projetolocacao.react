import React, { useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { TextField, InputLabel, FormControl, Divider, Select } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { flexbox } from '@mui/system';

export default function ListaContatos() {
    const classes = useStyles(); 

    const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
    }))(TableRow);

    const [contacts, setContacts] = useState([]);
    const [phoneclients, setPhoneClients] = useState({
        flTipoTelefone: '',
        nrTelefone: '',
        dsObservacao: '',
    });

  const handleChangeContact = (event) => {
    event.preventDefault();
    
    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newPhone = { ...phoneclients };
    newPhone[fieldName] = fieldValue;
    
    setPhoneClients(newPhone);
  };

  const handleSubmitAddContact = (event) => {
    event.preventDefault();

    const newContact = {
      // id: nanoid(),
      flTipoTelefone: phoneclients.flTipoTelefone,
      nrTelefone: phoneclients.nrTelefone,
      dsObservacao: phoneclients.dsObservacao,
    };

    const newContacts = [ ...contacts, newContact ];
    setContacts(newContacts);
  }

    return (
        <Box sx={{
            marginTop: '10px',
            border: "1px solid #E0E1E0",
            borderLeft: "5px solid #009DE0",
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomRightRadius: "5px"
            }}    
        >
            <Paper elevation={0} sx={{ p:2 }}>
            <Typography  style={{ marginBottom: 15, color: '#009DE0', fontWeight: 'bold' }}>
              Contato(s) 
              <Divider variant="fullWidth" />
            </Typography>
            <form onSubmit={handleSubmitAddContact}>
              <div className={classes.twoInputs}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  <InputLabel id="flTipoTelefone">Tipo</InputLabel>
                  <Select
                      id="flTipoTelefone"
                      // value={flTipoTelefone}
                      // onChange={handleChangeContact}
                      label="Tipo"
                    >
                    <MenuItem  value={30}>Celular</MenuItem>
                    <MenuItem  value={40}>Fixo</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  required
                  variant="outlined"
                  size="small"
                  id="nrTelefone"
                  name="nrTelefone"
                  label="Número"
                  // value={nrTelefone}
                  onChange={handleChangeContact}
                />
              </div>
              <Box style={{ marginLeft: -7, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <TextField
                  variant="outlined"
                  id="dsObservacao"
                  name="dsObservacao"
                  label="Observação"
                  size="small"
                  fullWidth
                  // value={dsObservacao}
                  onChange={handleChangeContact}
                />
                <div style={{ marginLeft: 10 }}>
                  <Button variant="contained" size="medium" className={classes.btnAddBlue} type='submit' startIcon={<AddCircleOutlinedIcon />}>Adicionar</Button>
                </div>
              </Box>
            </form>

            <TableContainer>
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Número</TableCell>
                    <TableCell>Observação</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {contacts.map((contact) => ( 
                    <TableRow hover >
                        <TableCell align="left"><Chip label={contact.flTipoTelefone} /></TableCell>
                        <TableCell>{contact.nrTelefone}</TableCell>
                        <TableCell>{contact.dsObservacao}</TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <IconButton>
                              <DeleteIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper> 
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    twoInputs: {
        display: 'flex',
        marginLeft: -7,
        '& .MuiTextField-root': {
        // margin: theme.spacing(1),
            width: '50%',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: '50%',
      },
      button: {
        margin: theme.spacing(0.5),
      },
    table: {
        minWidth: 750,
        '& .MuiTableCell-head': {
          fontWeight: 'bold',
          fontSize: 14,
        }    
    },
    btnAddBlue: {
      background: '#009DE0',
      color: '#FFF',
      borderRadius: 5,
      border: 'none',
      textTransform: 'none',
      boxShadow: 'none',
  
      '&:hover': {
        backgroundColor: '#052F5F',
        color: '#FFF',
      },
    },
}));