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
import { mask, unMask } from 'remask';

export default function ListaContatos(props) {
    const classes = useStyles(); 
    const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
    }))(TableRow);
    
    const telefoneMap = {30: 'Celular', 40: 'Fixo'};
    const {contatos, addContato} = props;

    const [tipoTelefone, setTipoTelefone] = useState(30);
    const [telefone, setTelefone] = useState('');
    const [observacao, setObservacao] = useState('');

    const handleChangeTelefone = (event) => {
      setTelefone(mask(unMask(event.target.value), ['(99) 9999-9999', '(99) 9 9999-9999']));
  }

    const handleTipoTelefoneChange = (event) => {
      setTipoTelefone(event.target.value);
    };

    const handleAddContact = () => {
      addContato({
        flTipoTelefone: tipoTelefone,
        nrTelefone: telefone,
        dsObservacao: observacao
      });

      setTipoTelefone(30);
      setTelefone('');
      setObservacao('');
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

            <form>
              <div className={classes.twoInputs}>
                <FormControl variant="outlined" size="small" className={classes.formControl}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                      value={tipoTelefone}
                      onChange={handleTipoTelefoneChange}
                      label="Tipo"
                    >
                    <MenuItem  value={30}>Celular</MenuItem>
                    <MenuItem  value={40}>Fixo</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  variant="outlined"
                  size="small"
                  label="Número"
                  value={telefone}
                  onChange={handleChangeTelefone}
                />
              </div>
              <Box style={{ marginLeft: -7, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <TextField
                  variant="outlined"
                  label="Observação"
                  size="small"
                  fullWidth
                  value={observacao}
                  onChange={(event) => setObservacao(event.target.value)}
                />
                <div style={{ marginLeft: 10 }}>
                  <Button onClick={handleAddContact} variant="contained" size="medium" className={classes.btnAddBlue} startIcon={<AddCircleOutlinedIcon />}>Adicionar</Button>
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
                  {contatos.map((contact) => ( 
                    <TableRow hover >
                        <TableCell align="left"><Chip label={telefoneMap[contact.flTipoTelefone]} /></TableCell>
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