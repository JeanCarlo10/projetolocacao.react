import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box, Grid, Typography } from '@mui/material';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import { styled } from '@mui/material/styles';
import MenuAdmin from '../../../components/menu-admin';
import Stack from '@mui/material/Stack';
import NotificationCard from '../../../components/notification-card';
import CardLocacoesAtivas from '../../../components/card-locacoes-ativas';
import CardAcoesPendentes from '../../../components/card-acoes-pendentes';
import CardRetiradas from '../../../components/card-retiradas';
import TextField from '@mui/material/TextField';
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveIcon from '@material-ui/icons/Save';
import { IconButton } from '@mui/material';
import api from '../../../services/api';
import { Card } from '@material-ui/core';
import Avatar from '@mui/material/Avatar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function Dashboard() {
  const classes = useStyles();

  const [value, setValue] = useState(new Date(Date.now()));
  const [expanded, setExpanded] = useState(false);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
};

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
}

  return (
    <div className={classes.root}>
      <MenuAdmin title={'Dashboard'} />

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          
          <Grid container spacing={3} marginBottom={4}>
            <Grid item xs={12} sm={6} md={4}>
              <CardLocacoesAtivas />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardAcoesPendentes />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <CardRetiradas />
            </Grid>
          </Grid>

          <Card style={{ borderRadius: 15, padding: 20, marginBottom: 10 }}>
            <Stack style={{  justifyContent:'center', flexDirection: 'row' }}>
              <DatePicker
                label='De'
                size='small'
                autoOk
                inputVariant='outlined'
                variant='inline'
                format="dd/MM/yyyy"
                value={value}
                onChange={handleChange}
                // renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label='Até'
                size='small'
                autoOk
                inputVariant='outlined'
                variant='inline'
                format="dd/MM/yyyy"
                value={value}
                onChange={handleChange}
                // renderInput={(params) => <TextField {...params} />}
              />
            </Stack>
          </Card>
          

          <Card  style={{ borderRadius: 15, marginBottom: 10 }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" {...stringAvatar('Janete Nunes')}/>
                }
                title='Janete Nunes'
                subheader="Endereço: Av. Nacional, 482 - Três bandeiras">
            </CardHeader>

            <CardActions disableSpacing>
                <div style={{ color: '#FF5252' }}> 
                    <IconButton aria-label="add to favorites">
                        <CalendarTodayIcon />
                    </IconButton>
                    Data de retirada: 25/02/2022
                </div>
                <CardContent>
                    <Typography variant="body2">
                        Observação: Retirar as 14:30h, falar com João.
                    </Typography>
                </CardContent>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    >
                    <ExpandMoreIcon />
                </ExpandMore>
                
            </CardActions>

            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                <CardContent>
                    <Typography paragraph>MATERIAIS</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                        minutes.
                    </Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                        without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                        medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                        again without stirring, until mussels have opened and rice is just tender, 5 to 7
                        minutes more. (Discard any mussels that don’t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                </CardContent>
            </Collapse>
          </Card>

          <Card style={{ borderRadius: 15, marginBottom: 10, backgroundColor: '#FF7878' }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" {...stringAvatar('Roberto Carlos')}/>
                }
                title='Roberto Carlos'
                subheader="Endereço: Av. Brasil, 1000 - Centro">
            </CardHeader>

            <CardActions disableSpacing >
                <IconButton aria-label="add to favorites">
                        <CalendarTodayIcon />
                </IconButton>
                Data de retirada: 20/02/2022
                <CardContent>
                    <Typography variant="body2">
                        Observação: Retirar as 14:30h, falar com João.
                    </Typography>
                </CardContent>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    >
                    <ExpandMoreIcon />
                </ExpandMore>
                
            </CardActions>

            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                <CardContent>
                    <Typography paragraph>MATERIAIS</Typography>
                    <FormGroup>
                      <FormControlLabel control={<Checkbox defaultChecked />} label="Escada" />
                    </FormGroup>
                    
                </CardContent>
            </Collapse>
          </Card>

          <Card style={{ borderRadius: 15, marginBottom: 10}}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe" {...stringAvatar('Willian Santos')}/>
                }
                title='Willian Santos'
                subheader="Endereço: Av. Brasil, 1000 - Centro">
            </CardHeader>

            <CardActions disableSpacing>
                <div style={{ color: '#FF5252' }}> 
                    <IconButton aria-label="add to favorites">
                        <CalendarTodayIcon />
                    </IconButton>
                    Data de retirada: 20/02/2022
                </div>
                <CardContent>
                    <Typography variant="body2">
                        Observação: Retirar as 14:30h, falar com João.
                    </Typography>
                </CardContent>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    >
                    <ExpandMoreIcon />
                </ExpandMore>
                
            </CardActions>

            <Collapse in={expanded} timeout={'auto'} unmountOnExit>
                <CardContent>
                    <Typography paragraph>MATERIAIS</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                        minutes.
                    </Typography>
                    <Typography paragraph>
                        Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
                        without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
                        medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
                        again without stirring, until mussels have opened and rice is just tender, 5 to 7
                        minutes more. (Discard any mussels that don’t open.)
                    </Typography>
                    <Typography>
                        Set aside off of the heat to let rest for 10 minutes, and then serve.
                    </Typography>
                </CardContent>
            </Collapse>
          </Card>

          {/* <NotificationCard /> */}
        </Container>
      </main>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: '#F8F8F8'
  },
  title: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    // padding: theme.spacing(2),
  },
  
  appBarSpacer: theme.mixins.toolbar,
}));