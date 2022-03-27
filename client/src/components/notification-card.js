import React, {useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@mui/material/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import api from '../services/api';
import Avatar from '@mui/material/Avatar';

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
  
export default function NotificationCard() {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);
    const [dados, setDados] = useState([]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const fetchClients = async() => {
            const {data} = await api.get (
                '/api/users'
            );

            setDados(data);
        };
        fetchClients();
    }, []);

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
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
    }
      
    

    return (
        <Card style={{ borderRadius: 15}} className={classes.root}>
            {/* {dados.map((row) => (
            <CardHeader key={row._id}
                avatar={
                    <Avatar aria-label="recipe" {...stringAvatar('Jean Carlo')} />
                }
                title={row.nmUsuario}
                subheader="Endereço: Av. Nacional, 482 - Três bandeiras">
            </CardHeader>
            ))}

            <CardContent>
                Observação: 
                <Typography variant="body2" color="text.secondary">
                    Retirar as 14:30h, falar com João.
                </Typography>
            </CardContent>

            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <CalendarTodayIcon  />
                </IconButton>
                05/01/2021

                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>

                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
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
                </CardContent>
            </Collapse> */}

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


        
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
}));
