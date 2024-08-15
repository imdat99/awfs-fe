import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { LoadingButton } from '@mui/lab'

export interface ConfirmDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    onConfirm: () => Promise<any>;
}
const ConfirmDialog: React.FC<ConfirmDialogProps> = (props) => {
    const { open, setOpen, onConfirm } = props
    const [loading, setLoading] = React.useState(false)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
    const handleClose = () => {
        setOpen(false)
    }
    const handleConfirm = () => {
        setLoading(true)
        onConfirm().then(handleClose).finally(() => setLoading(false))
    }
    return (
        <React.Fragment>
            <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Bạn chắc chắn chứ?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn chắc chắn rằng mình có thể chịu trách nhiệm với hành động này chứ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Thôi
                    </Button>
                    <LoadingButton onClick={handleConfirm} autoFocus variant="contained" color="error" loading={loading}>
                        Chắc chắn!
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default ConfirmDialog