import { Box } from '@mui/material';
import IconEmptyState from '../assets/img/icon-empty-state.svg';

export default function EmptyState() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            padding={"16px"}
            borderRadius={"10px"}
            border={"1px solid #E0E1E0"}
            boxShadow={"0px 2px 4px 0 rgba(0, 0, 0, .2)"}
        >
            <img src={IconEmptyState} width={300} height={300} alt='Imagem' />

            <div style={{ color: '#00AB55', fontSize: '28px', fontWeight: 700  }} mt={2}>
                Nenhum resultado encontrado
            </div>
            <div style={{ color: '#3B4251', fontSize: '16px' }}>
                Tente ajustar os filtros ou a palavra-chave.
            </div>
        </Box>
    );
}