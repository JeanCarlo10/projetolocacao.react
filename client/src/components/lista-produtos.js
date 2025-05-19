import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Card, CardContent } from '@mui/material';
import { TextField, InputLabel, FormControl, Select, IconButton, Button, InputAdornment, FormHelperText } from '@mui/material';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';
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

export default function ListaProdutos(props) {
  const inputRef = React.createRef();

  const { produtos, addProduto, deleteProduto } = props;

  const [selectMaterials, setSelectMaterials] = useState([]);
  const [materialId, setMaterialId] = useState('');
  const [currentMaterial, setCurrentMaterial] = useState({});

  const [unidadeMedida, setUnidadeMedida] = useState('Unidade');
  const [qtde, setQtde] = useState('');
  const [valorItem, setValorItem] = useState('');

  const [errors, setErrors] = useState({
    materialId: false,
    qtde: false,
    valorItem: false
  });

  const unidadeMedidaMap = { 'Unidade': 'unidade(s)', 'Metro': 'metro(s)' };
  const handleChangeUnidadeMedida = (event) => {
    setUnidadeMedida(event.target.value);
  };

  useEffect(() => {
    async function getDadosMaterial() {

      const response = await api.get(`api/materials`);

      setSelectMaterials(response.data);
    }

    getDadosMaterial();
  }, []);

  function handleSelectMaterials(e) {
    const materialId = e.target.value;
    setCurrentMaterial(selectMaterials.find(e => e._id === materialId));
    setMaterialId(materialId);
  }

  const handleAddProduct = () => {
    const hasErrors = {
      materialId: materialId === '',
      qtde: qtde === '',
      valorItem: valorItem === '',
    };

    setErrors(hasErrors);

    const isValid = !hasErrors.materialId && !hasErrors.qtde && !hasErrors.valorItem;

    if (!isValid) return;

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
    setErrors({ materialId: false, qtde: false, valorItem: false });
  }

  return (
    <Box sx={{
      borderRadius: '8px',
      border: "1px solid #E0E1E0",
      boxShadow: "none"
    }}>

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
        <h3>ITENS DO PEDIDO</h3>
      </Box>

      <Card>
        <CardContent style={{ padding: '24px' }}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={12} md={12}>
              <FormControl
                variant="outlined"
                size="medium"
                style={{ minWidth: '100%' }}
                error={errors.materialId}
              >
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
                {errors.materialId && (
                  <FormHelperText>Selecione o material</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                type='number'
                label="Quantidade"
                value={qtde}
                error={errors.qtde}
                helperText={errors.qtde ? "Informe a quantidade" : ""}
                onChange={(event) => setQtde(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormControl variant="outlined" size="medium" fullWidth>
                <InputLabel>Unidade Medida</InputLabel>
                <Select
                  value={unidadeMedida}
                  onChange={handleChangeUnidadeMedida}
                  label="Unidade medida"
                >
                  <MenuItem value={'Unidade'}>Unidade</MenuItem>
                  <MenuItem value={'Metro'}>Metro</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                size="medium"
                label="Valor"
                getInputRef={inputRef}
                error={errors.valorItem}
                helperText={errors.qtde ? "Informe o valor do item" : ""}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
                value={valorItem}
                onChange={(event) => setValorItem(event.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Button onClick={handleAddProduct} variant="contained" fullWidth style={{ height: '56px', borderRadius: 8 }}>
                Adicionar
              </Button>
            </Grid>

            <Grid container item>
              <TableContainer style={{ borderRadius: 10 }}>
                <Table style={{ minWidth: 500 }} size="medium">
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
                        <StyledTableCell align="right">R${currencyFormatter(prod.valorItem)}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="right">
                          <Tooltip title="Excluir produto">
                            <IconButton onClick={() => deleteProduto(prod.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
                {produtos.length > 0 ? null : <div style={{ textAlign: 'center', paddingTop: 20, fontWeight: 700, fontSize: 16, color: '#3B4251' }}>
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