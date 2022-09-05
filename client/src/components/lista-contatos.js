import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { TextField, InputLabel, FormControl, Divider, Select } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@mui/material/Grid';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import { mask, unMask } from 'remask';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Public Sans',
  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700,
    color: '#2d2a26',
    paddingTop: 6,
    paddingBottom: 6,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#374151',
    fontWeight: 500,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ListaContatos(props) {
  const classes = useStyles();

  // const telefoneMap = {30: 'Celular', 40: 'Fixo'};
  const { contatos, addContato, deleteContato } = props;

  const [tipoTelefone, setTipoTelefone] = useState('Celular');
  const [numero, setNumero] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleChangeNumero = (e) => {
    setNumero(mask(unMask(e.target.value), ['(99) 9999-9999', '(99) 9 9999-9999']));
  }

  const handleTipoTelefoneChange = (e) => {
    setTipoTelefone(e.target.value);
  };

  const handleAddContact = () => {
    addContato({
      id: new Date().getTime(),
      tipoTelefone: tipoTelefone,
      numero: numero,
      observacao: observacao
    });

    setTipoTelefone('Celular');
    setNumero('');
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
      <Paper elevation={0} sx={{ p: 2 }}>
        <Typography style={{ marginBottom: 15, color: '#009DE0', fontWeight: 'bold' }}>
          Contato(s)
          <Divider variant="fullWidth" />
        </Typography>
        <form>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <div>

                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={tipoTelefone}
                    onChange={handleTipoTelefoneChange}
                    label="Tipo"
                  >
                    <MenuItem value={'Celular'}>Celular</MenuItem>
                    <MenuItem value={'Fixo'}>Fixo</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={6}>

              <TextField
                variant="outlined"
                fullWidth
                size="small"
                label="Número"
                value={numero}
                onChange={handleChangeNumero}
              />
            </Grid>

            <Box style={{ marginLeft: -7, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
          </Grid>
        </form>

        <TableContainer>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <StyledTableCell>Tipo</StyledTableCell>
                <StyledTableCell>Número</StyledTableCell>
                <StyledTableCell>Observação</StyledTableCell>
                <StyledTableCell align="right">Ações</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {contatos &&
                contatos.map((contact) => (
                  <StyledTableRow key={contact.id}>
                    <StyledTableCell align="left"><Chip label={contact.tipoTelefone} /></StyledTableCell>
                    <StyledTableCell>{contact.numero}</StyledTableCell>
                    <StyledTableCell>{contact.observacao}</StyledTableCell>
                    <StyledTableCell component="th" scope="row" align="right">
                      <IconButton onClick={() => deleteContato(contact.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
          {contatos.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro</div>}
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
  noRegisters: {
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 700,
    fontSize: 16,
    color: '#595A4A'
  },
  button: {
    margin: theme.spacing(0.5),
  },
  table: {
    minWidth: 700,
    borderRadius: 5,
    background: '#F3F4F6'
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