import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@mui/material/Tooltip';
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
    if (numero != '') {
      addContato({
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
    <Box display="flex" flexDirection="column" className={classes.boxCustom}>
      <Typography style={{ padding: '15px', color: '#009DE0', fontWeight: 'bold' }}>
        Contato(s)
        <Divider variant="fullWidth" />
      </Typography>
      <form>
        <Grid container direction="column" padding={2} spacing={2}>
          <Grid container item direction="row" spacing={2} className={classes.aligns}>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl style={{ margin: '8px' }} variant="outlined" size="small" fullWidth>
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
                size="small"
                label="Número"
                value={numero}
                onChange={handleChangeNumero}
              />
            </Grid>
          </Grid>

          <Grid container item direction="row" spacing={2} className={classes.aligns}>
            <Grid item xs={12} sm={8} md={10}>
              <TextField
                variant="outlined"
                label="Observação"
                size="small"
                fullWidth
                value={observacao}
                onChange={(event) => setObservacao(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <Button onClick={handleAddContact} variant="contained" fullWidth size="medium" className={classes.btnAddBlue} startIcon={<AddCircleOutlinedIcon />}>Adicionar</Button>
            </Grid>
          </Grid>
          <Grid container item>
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
                  {contatos && contatos.map((contact) => (
                    <StyledTableRow key={contact.id}>
                      <StyledTableCell align="left"><Chip label={contact.tipoTelefone} /></StyledTableCell>
                      <StyledTableCell>{contact.numero}</StyledTableCell>
                      <StyledTableCell>{contact.observacao}</StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="right">
                        <Tooltip title="Excluir">
                          <IconButton onClick={() => deleteContato(contact.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              {contatos.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro</div>}
            </TableContainer>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  boxCustom: {
    border: "1px solid #E0E1E0",
    borderLeft: "5px solid #009DE0",
    borderTopLeftRadius: "5px",
    borderBottomLeftRadius: "5px",
    borderTopRightRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  aligns: {
    paddingLeft: "8px !important",
    paddingRight: "8px !important",
    paddingTop: "0px !important",
    paddingBottom: "0px !important",
    display: 'flex',
    alignItems: 'center'
  },
  noRegisters: {
    textAlign: 'center',
    paddingTop: 10,
    fontWeight: 700,
    fontSize: 16,
    color: '#595A4A'
  },
  table: {
    minWidth: 700,
    borderRadius: 5,
    background: '#F3F4F6'
  },
  btnAddBlue: {
    background: '#009DE0',
    color: '#FFF',
    borderRadius: '5px',
    border: 'none',
    textTransform: 'none',
    marginLeft: '8px',
    boxShadow: 'none',
    fontWeight: 'bold',
    padding: '8px 16px',

    '&:hover': {
      backgroundColor: '#052F5F',
      color: '#FFF',
    },
  },
}));