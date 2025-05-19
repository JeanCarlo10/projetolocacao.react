import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent } from '@mui/material';
import { TextField, InputLabel, FormControl, Select, IconButton, Chip, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import { mask, unMask } from 'remask';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontFamily: 'Nunito',

  [`&.${tableCellClasses.head}`]: {
    fontWeight: 700,
    color: '#000',
    paddingTop: 6,
    paddingBottom: 6,
    background: '#D2D2D2',
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#3B4251',
    fontWeight: 500,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ListaContatos(props) {
  const { contacts, addContact, deleteContact } = props;

  const [tipoTelefone, setTipoTelefone] = useState('Celular');
  const [numero, setNumero] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleChangeNumber = (e) => {
    setNumero(mask(unMask(e.target.value), ['(99) 9999-9999', '(99) 9 9999-9999']));
  }

  const handleTipoTelefoneChange = (e) => {
    setTipoTelefone(e.target.value);
  };

  const handleAddContact = () => {
    if (numero !== '') {
      addContact({
        id: new Date().getTime(),
        tipoTelefone: tipoTelefone,
        numero: numero,
        observacao: observacao
      });
    }
    setTipoTelefone('Celular');
    setNumero('');
    setObservacao('');
  }

  return (
    <Box sx={{ borderRadius: '8px', border: "1px solid #E0E1E0", boxShadow: "none" }}>
      <Box
        sx={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          background: '#717171',
          color: '#FFF',
          fontWeight: 700,
          padding: "8px 16px",
          fontFamily: "Nunito"
        }}
      >
        <h3>CONTATO(S)</h3>
      </Box>

      <Card>
        <CardContent style={{ padding: 24 }}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6} md={6}>
              <FormControl variant="outlined" size="medium" fullWidth>
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
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                variant="outlined"
                fullWidth
                size="medium"
                label="Número"
                value={numero}
                onChange={handleChangeNumber}
              />
            </Grid>

            <Grid item xs={12} sm={8} md={10}>
              <TextField
                variant="outlined"
                label="Observação"
                size="medium"
                fullWidth
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={2}>
              <Button onClick={handleAddContact} variant="contained" fullWidth style={{ height: '56px', borderRadius: 8 }}>
                Adicionar
              </Button>
            </Grid>

            <Grid container item>
              <TableContainer style={{ borderRadius: 10 }}>
                <Table style={{ minWidth: 500 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Tipo</StyledTableCell>
                      <StyledTableCell align="center">Número</StyledTableCell>
                      <StyledTableCell align="left">Observação</StyledTableCell>
                      <StyledTableCell align="right">Ações</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {contacts && contacts.map((contact) => (
                      <StyledTableRow key={contact.id}>
                        <StyledTableCell align="center"><Chip label={contact.tipoTelefone} /></StyledTableCell>
                        <StyledTableCell align="center">{contact.numero}</StyledTableCell>
                        <StyledTableCell align="left">{contact.observacao}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="right">
                          <Tooltip title="Excluir contato">
                            <IconButton onClick={() => deleteContact(contact.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
                {contacts.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
                  Nenhum registro encontrado.
                </div>}
              </TableContainer>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box >
  );
}