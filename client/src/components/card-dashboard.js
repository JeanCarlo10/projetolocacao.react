import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Grid, Typography, Card } from '@mui/material';
import '../components/card-dashboard.css';

export default function CardDashboard({ number, text, icon, color, className }) {
    return (
        <>
            <Card className={`card-container ${className}`}>
                <Grid container >
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography color={color} variant="h3">{number}</Typography>
                        <Typography variant="subtitle2" color={'#78909c'} fontWeight={'bold'}>
                            {text}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton>
                                {icon}
                            </IconButton>
                        </div>
                    </Grid>
                </Grid>
            </Card>
        </>
    )
} 