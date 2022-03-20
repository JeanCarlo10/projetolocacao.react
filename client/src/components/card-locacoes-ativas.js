import React from 'react';
import { styled } from '@mui/material/styles';
import IconButton from '@material-ui/core/IconButton';
import { Grid, Typography, Card } from '@mui/material';
import EmojiFlagsOutlinedIcon from '@mui/icons-material/EmojiFlagsOutlined';

const RootStyle = styled(Card)(({ theme }) => ({
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1),
    color: '#448AFF',
    backgroundColor: '#FFF',
    boxShadow: '2px 2px 6px #8888',
    borderLeftStyle: 'solid',
    borderLeftWidth: 10,
    borderLeftColor: '#448AFF',
    borderRadius: 15,
  }));
  
  const IconWrapperStyle = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
  }));
  
  const TOTAL = 30;
  
  export default function CardLocacoesAtivas() {
    return (
      <RootStyle>
        <Grid container >
          <Grid item xs={12} sm={6} md={6}>
            <Typography variant="h3">{(TOTAL)}</Typography>
            <Typography variant="subtitle2" color={'#78909c'} fontWeight={'bold'}>
              Locações Ativas
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <IconWrapperStyle>
              <IconButton>
                  <EmojiFlagsOutlinedIcon sx={{ fontSize: 50 }} />
              </IconButton>
            </IconWrapperStyle>
          </Grid>
        </Grid>
      </RootStyle>
    );
  }