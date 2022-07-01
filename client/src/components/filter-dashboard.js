import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import { Grid, Card } from '@mui/material';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { formatCurrentMonth } from '../helpers/dateFilter';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';

const RootStyle = styled(Card)(({ theme }) => ({
  // justifyContent: 'space-between',
  flexDirection: 'row',
  display: 'flex',
  padding: theme.spacing(2),
  backgroundColor: '#FFF',
  borderRadius: 15,
  marginBottom: 10,
}));

export default function FilterDashboard(props) {
  const classes = useStyles();
  const { currentMonth, onMonthChange } = props;

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

  return (
    <RootStyle>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
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

        <Grid item xs={12} sm={6} md={4}>
          
        </Grid>

        {/* <Grid item xs={12} sm={6} md={8}>
          <FormGroup row>
            <FormControlLabel control={<Checkbox checked={checked} onChange={() => changeChecked(id)} />} label={label}/>
          </FormGroup>
        </Grid> */}
      </Grid>

    </RootStyle>
  );
}

const useStyles = makeStyles((theme) => ({
  containerFilterDate: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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