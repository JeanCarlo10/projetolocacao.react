import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

import NumberFormat from 'react-number-format';
import api from '../services/api';

export function currencyFormatter(value) {
  if (!Number(value)) return "";

  const amount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100).replace('R$', '');

  return `${amount}`;
}

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      format={currencyFormatter}
    />
  );
});

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

export default function ListaProdutos(props) {
  const classes = useStyles();
  const inputRef = React.createRef();

  const { produtos, addProduto, deleteProduto } = props;

  const [selectMaterials, setSelectMaterials] = useState([]);
  const [materialId, setMaterialId] = useState('');
  const [currentMaterial, setCurrentMaterial] = useState({});

  const [unidadeMedida, setUnidadeMedida] = useState('Unidade');
  const [qtde, setQtde] = useState('');
  const [valorItem, setValorItem] = useState('');

  const unidadeMedidaMap = { 'Unidade': 'unidade(s)', 'Metro': 'metro(s)' };
  const handleChangeUnidadeMedida = (event) => {
    setUnidadeMedida(event.target.value);
  };

  useEffect(() => {
    async function getDadosMaterial() {

      const results = await api.get('http://localhost:5000/api/materials');
      setSelectMaterials(results.data);
    }

    getDadosMaterial();
  }, []);

  function handleSelectMaterials(e) {
    const materialId = e.target.value;
    setCurrentMaterial(selectMaterials.find(e => e._id == materialId));
    setMaterialId(materialId);
  }

  const handleAddProduct = () => {
    if (materialId != '') {
      addProduto({
        id: currentMaterial._id,
        unidadeMedida: unidadeMedida,
        qtde: qtde,
        valorItem: parseFloat(valorItem),
        nomeMaterial: currentMaterial.nomeMaterial
      });

      setMaterialId('');
      setQtde('');
      setValorItem('');
    }
  }

  return (
    <Box display="flex" flexDirection="column" className={classes.boxCustom}>
      <Typography style={{ padding: '15px 15px 0 15px', color: '#009DE0', fontWeight: 'bold' }}>
        Itens do pedido
        <Divider variant="fullWidth" />
      </Typography>

      <form>
        <Grid container direction="column" padding={2} spacing={2}>
          <Grid container item direction="row">
            <FormControl variant="outlined" size="small" style={{ minWidth: '100%' }}>
              <InputLabel>Material</InputLabel>
              <Select
                onChange={handleSelectMaterials}
                value={materialId}
                label="Material"
              >
                {selectMaterials.map((material) => (
                  <MenuItem value={material._id} key={material._id}>{material.nomeMaterial}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container item direction="row" spacing={2} className={classes.aligns}>
            <Grid item xs={12} sm={3} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type='number'
                label="Quantidade"
                value={qtde}
                onChange={(event) => setQtde(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3} md={3}>
              <FormControl variant="outlined" size="small" fullWidth style={{margin: '8px'}}>
                <InputLabel>Unidade Medida</InputLabel>
                <Select
                  value={unidadeMedida}
                  onChange={handleChangeUnidadeMedida}
                  label="Unidade Medida"
                >
                  <MenuItem value={'Unidade'}>Unidade</MenuItem>
                  <MenuItem value={'Metro'}>Metro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                label="Valor"
                getInputRef={inputRef}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
                value={valorItem}
                onChange={(event) => setValorItem(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={2} md={2}>
              <Button onClick={handleAddProduct} variant="contained" size="medium" fullWidth className={classes.btnAddBlue} startIcon={<AddCircleOutlinedIcon />}>Adicionar</Button>
            </Grid>
          </Grid>

          <Grid container item>
            <TableContainer>
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Produto</StyledTableCell>
                    <StyledTableCell align="center">Quantidade</StyledTableCell>
                    <StyledTableCell align="right">Valor</StyledTableCell>
                    <StyledTableCell align="right">Ação</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {produtos && produtos.map((prod) => (
                    <StyledTableRow key={prod.id}>
                      <StyledTableCell align="left">{prod.nomeMaterial}</StyledTableCell>
                      <StyledTableCell align="center">{prod.qtde + " " + unidadeMedidaMap[(prod.unidadeMedida)]}</StyledTableCell>
                      <StyledTableCell align="right">{currencyFormatter(prod.valorItem)}</StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="right">
                        <IconButton onClick={() => deleteProduto(prod.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
              {produtos.length > 0 ? null : <div className={classes.noRegisters}>Nenhum registro</div>}
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
    boxShadow: 'none',
    fontWeight: 'bold',
    marginLeft: '8px',
    padding: '8px 16px',

    '&:hover': {
      backgroundColor: '#052F5F',
      color: '#FFF',
    },
  },
}));