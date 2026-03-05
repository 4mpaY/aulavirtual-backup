import { Box, CircularProgress, Typography } from '@mui/material'

export default function Loading() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                gap: 4
            }}
        >
            <CircularProgress size={48} thickness={4} />
            <Typography variant='body1' color='text.secondary'>
                Preparando el creador de cursos...
            </Typography>
        </Box>
    )
}
