import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@mui/material/Typography';
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
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import api from '../services/api';

export default function ListaProdutos(props) {
    const classes = useStyles(); 
    const StyledTableRow = withStyles((theme) => ({
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
          },
        },
    }))(TableRow);
    
    const {produtos, addProduto, deleteProduto } = props;

    const [selectMaterials, setSelectMaterials] = useState([]);
    const [materialId, setMaterialId] = useState('');
    const [currentMaterial, setCurrentMaterial] = useState({});

    // const [locacao, setLocacao] = useState(Date.now());
    // const [devolucao, setDevolucao] = useState(null);
    const [metro, setMetro] = useState('');
    const [qtde, setQtde] = useState('');
    const [valorItem, setValorItem] = useState('');
    const [valorTotal, setValorTotal] = useState('');

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
        addProduto({
            id: currentMaterial._id,
            metro: metro,
            qtde: qtde,
            valorItem: valorItem,
            nomeMaterial: currentMaterial.nomeMaterial
        });

        setMaterialId('');
        setMetro('');
        setQtde('');
        setValorItem('');
    }

    // const handleDateLocacaoChange = (date) => {
    //   setLocacao(date);
    // }

    // const handleDateDevolucaoChange = (date) => {
    //   setDevolucao(date)
    // }

    return (
        <Box sx={{
              marginTop: '10px',
              border: "1px solid #E0E1E0",
              borderLeft: "5px solid #009DE0",
              borderRadius: "5px",
              padding: '16px'
            }}    
        >
            <Typography  style={{  color: '#009DE0', fontWeight: 'bold' }}>
              Itens do pedido 
            </Typography>
            <Divider variant="fullWidth" style={{  marginBottom: 15 }}/>

            <form>
            <FormControl variant="outlined" size="small" style={{ minWidth: '100%'}}>
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

            {/* <div className={classes.twoInputs}>
              <DatePicker
                label='Data locação'
                size='small'
                autoOk
                inputVariant='outlined'
                format="dd/MM/yyyy"
                value={locacao}
                onChange={handleDateLocacaoChange}
              />
              
              <DatePicker
                label='Data devolução'
                size='small'
                autoOk
                inputVariant='outlined'
                format="dd/MM/yyyy"
                value={devolucao}
                onChange={handleDateDevolucaoChange}
              />
            </div> */}

            <Box style={{ marginLeft: -7, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              {currentMaterial.nomeMaterial == 'Andaime' && 
                <TextField
                  variant="outlined"
                  size="small"
                  label="Metros"
                  value={metro}
                  onChange={(event) => setMetro(event.target.value)}
                />
              }

              {currentMaterial.nomeMaterial != 'Andaime' && 
                <TextField
                    variant="outlined"
                    size="small"
                    type='number'
                    label="Quantidade"
                    value={qtde}
                    onChange={(event) => setQtde(event.target.value)}
                />
              }

              <TextField
                  variant="outlined"
                  size="small"
                  label="Valor"
                  type='decimal'
                  value={valorItem}
                  onChange={(event) => setValorItem(event.target.value)}
              />
              <div style={{ marginLeft: 10 }}>
                <Button onClick={handleAddProduct} variant="contained" size="medium" className={classes.btnAddBlue} startIcon={<AddCircleOutlinedIcon />}>Adicionar</Button>
              </div>
            </Box>
            </form>

            <TableContainer>
              <Table className={classes.table} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Produto</TableCell>
                    <TableCell align="center">Qtde/Metros</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="right">Ações</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {produtos.map((prod) => ( 
                    <TableRow hover key={prod.id}>
                        <TableCell align="left">{prod.nomeMaterial}</TableCell>
                        <TableCell align="center">{prod.nomeMaterial == "Andaime" ? prod.metro : prod.qtde }</TableCell>
                        <TableCell align="right">{prod.valorItem}</TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <IconButton onClick={() => deleteProduto(prod.id)}>
                              <DeleteIcon />
                          </IconButton>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        margin: theme.spacing(2),
        minWidth: '50%',
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