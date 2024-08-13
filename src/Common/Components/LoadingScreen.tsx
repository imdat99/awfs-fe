import { Box, CircularProgress } from '@mui/material'
import React from 'react'
interface LoadingScreenProps {
    isLoading: boolean
    children: React.ReactNode
}
const LoadingScreen: React.FC<LoadingScreenProps> = ({
    isLoading,
    children,
}) => {
    return (
        <Box sx={{ position: 'relative' }}>
            {isLoading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <CircularProgress sx={{m: "auto"}}/>
                </Box>
            )}
            {children}
        </Box>
    )
}

export default LoadingScreen
