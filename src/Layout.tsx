import { Grid } from '@mui/material'
import { PropsWithChildren } from 'react'
const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Grid container display={'flex'}>
            <Grid
                item
                sx={{
                    maxWidth: '1400px',
                    mx: 'auto',
                    p: 2,
                }}
            >
                {children}
            </Grid>
        </Grid>
    )
}

export default Layout
