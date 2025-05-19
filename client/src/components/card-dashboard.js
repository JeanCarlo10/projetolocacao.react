import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import '../assets/css/card-dashboard.css';

export default function CardDashboard({ number, text, icon, color, className }) {
    return (
        <>
            <Card className={`card__container ${className}`}>
                <CardContent className={'card__content'}>
                    <div>
                        {icon}
                    </div>

                    <Typography color={color} variant="h3" style={{ fontFamily: 'Nunito', fontWeight: 700 }}>
                        {number}
                    </Typography>
                </CardContent>

                <Typography className={'content__title'}>
                    {text}
                </Typography>
            </Card>
        </>
    )
} 