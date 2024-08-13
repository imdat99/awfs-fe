import { AddBox, VisibilityOff } from '@mui/icons-material'
import { Box, Button, IconButton, TextField, Tooltip } from '@mui/material'
import React from 'react'

const Actions = () => {
    return (
        <Box display={'flex'} sx={{ mb: 2, justifyContent: "end" }}>
            
            <TextField
                size="small"
                label="Tìm kiếm"
                variant="outlined"
                sx={{ mr: 2 }}
                InputProps={{
                    endAdornment: (
                        <IconButton aria-label="toggle password visibility">
                            <VisibilityOff />
                        </IconButton>
                    ),
                }}
            />
            <Button variant="contained" color="primary" sx={{ my: 'auto' }}>
                Thêm
            </Button>
        </Box>
    )
}

export default Actions
