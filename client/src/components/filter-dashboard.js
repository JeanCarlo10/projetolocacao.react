import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import {
  Grid, Card, Checkbox, Tooltip, FormControl, OutlinedInput,
  InputLabel, MenuItem, ListItemText, Select
} from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import SearchIcon from '@material-ui/icons/Search';
import { formatCurrentMonth } from '../helpers/dateFilter';
import { statusFilterDashboard } from '../../src/functions/static_data';

const RootStyle = styled(Card)(({ theme }) => ({
  flexDirection: 'row',
  display: 'flex',
  padding: theme.spacing(2),
  backgroundColor: '#FFF',
  borderRadius: 15,
  marginBottom: 10,
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FilterDashboard(props) {
  const classes = useStyles();
  const { currentMonth, onMonthChange, onChecked, onChangeKeyword } = props;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState([]);

  const onChangeSearch = (text) => {
    setSearch(text);
    onChangeKeyword(text);
  }

  const handlePrevMonth = () => {
    var newCurrentMonth = new Date(currentMonth.valueOf());
    newCurrentMonth.setMonth(newCurrentMonth.getMonth() - 1);

    onMonthChange(newCurrentMonth);
  }

  const handleNextMonth = () => {
    var newCurrentMonth = new Date(currentMonth.valueOf());
    newCurrentMonth.setMonth(newCurrentMonth.getMonth() + 1);

    onMonthChange(newCurrentMonth);
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setStatus(value);
    onChecked(value);
  };

  return (
    <RootStyle>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} md={4}>
          <div className={classes.containerFilterDate}>
            <Tooltip title="Anterior">
              <IconButton className={classes.btnPrevMonth} onClick={handlePrevMonth}>
                <ArrowBackIosRoundedIcon />
              </IconButton>
            </Tooltip>

            <div style={{ fontWeight: 'bold', color: '#2d2a26', fontSize: 20 }}>
              {formatCurrentMonth(currentMonth)}
            </div>
            <Tooltip title="Próximo">
              <IconButton className={classes.btnNextMonth} onClick={handleNextMonth}>
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>

        <Grid item xs={12} sm={4} md={4}>
          <div className={classes.iconButton}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <InputBase
              value={search}
              onChange={({target}) => onChangeSearch(target.value)}
              placeholder="Buscar por cliente..."
            />
          </div>
        </Grid>

        <Grid item row xs={12} sm={4} md={4} className={classes.input}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select className={classes.select}
              multiple
              value={status}
              onChange={handleChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {statusFilterDashboard.map((item) => (
                <MenuItem key={item.id} value={item.label}>
                  <Checkbox success checked={status.indexOf(item.label) > -1} />
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </RootStyle>
  );
}

const useStyles = makeStyles((theme) => ({
  containerFilterDate: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  iconButton: {
    borderRadius: 10,
    borderColor: '#BCBCBC',
    borderStyle: 'solid',
    borderWidth: 2
  },
  select: {
    '& .MuiSelect-select': {
      padding: '14.5px !important'
    },
  },
  input: {
    '& label.Mui-focused': {
      color: '#00AB55',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 10,
        borderColor: '#BCBCBC',
        borderStyle: 'solid',
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: '#00AB55',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00AB55',
      },
    },
  },
  btnPrevMonth: {
    padding: 0,
    borderRadius: 10,
    width: 35,
    height: 35,
    color: '#FFF',
    backgroundColor: '#00ab55',
    '&:hover': {
      backgroundColor: '#1D7874',
      color: '#FFF',
    },
  },
  btnNextMonth: {
    padding: 0,
    borderRadius: 10,
    width: 35,
    height: 35,
    color: '#FFF',
    backgroundColor: '#00ab55',
    '&:hover': {
      backgroundColor: '#1D7874',
      color: '#FFF',
    },
  },
}));