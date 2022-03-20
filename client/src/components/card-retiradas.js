import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@material-ui/core/IconButton';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import { Grid, Typography, Card } from '@mui/material';

const RootStyle = styled(Card)(({ theme }) => ({
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1),
    color: '#FF5252',
    backgroundColor: '#FFF',
    boxShadow: '2px 2px 6px #8888',
    borderLeftStyle: 'solid',
    borderLeftWidth: 10,
    borderLeftColor: '#FF5252',
    borderRadius: 15,
  }));
  
  const IconWrapperStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
  }));
  
  const TOTAL = 3;
  
  export default function CardRetiradas() {
    return (
      <RootStyle>
        <Grid container >
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h3">{(TOTAL)}</Typography>
            <Typography variant="subtitle2" color={'#78909c'} fontWeight={'bold'}>
              Retiradas da Semana
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <IconWrapperStyle>
              <IconButton >
                  <GppMaybeOutlinedIcon sx={{ fontSize: 50 }}/>
              </IconButton>
            </IconWrapperStyle>
          </Grid>
        </Grid>
      </RootStyle>
    );
  }