import { Close } from '@mui/icons-material'
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material'
import BtnOption, { BtnOptionProps } from 'Common/Components/BtnOption'
import React, { PropsWithChildren } from 'react'
import LoadingScreen from 'Common/Components/LoadingScreen'
import ConfirmDialog from './ConfirmDialog'

export type DrawerBaseProps = PropsWithChildren<{
    title: React.ReactNode,
    onSubmitted: (type: string) => Promise<any>,
    isDisableSubmit: boolean
    loading: boolean
    onClose: () => void
    isConfirm?: boolean,
    submidOptions: { label: string, value: string }[]
}>
const DrawerBase: React.FC<DrawerBaseProps> = (props) => {
    const { title, onSubmitted, children , isDisableSubmit, loading, onClose, isConfirm, submidOptions: options} = props
    const [isOpen, setIsOpen] = React.useState<boolean>()
    const [isConfirmOpen, setIsConfirm] = React.useState<boolean>(false)
    const [loadingBtn, setLoadingBtn] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    
    const handleSubmit: BtnOptionProps['onClick'] = (e, key) => {
        setLoadingBtn(true)
        onSubmitted(options[key].value).then(
            () => {
                setIsOpen(false)
            }
        ).finally(()=> {
            setLoadingBtn(false)
        })
    }
    React.useEffect(() => {
        setIsOpen(true)
    }, [])
    React.useEffect(() => {
        if(isOpen === false && onClose) {
            const timeout = setTimeout(() => {
                onClose()
                clearTimeout(timeout)
            }, 300)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])
    return (
        <>
            <ConfirmDialog
                onConfirm={() => {
                    setIsOpen(false)
                    return Promise.resolve()
                }}
                open={isConfirmOpen}
                setOpen={setIsConfirm}
            />
            <Drawer
                anchor={'right'}
                open={isOpen}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        backgroundColor: (theme) =>
                            theme.palette.background.default,
                        width: '80%',
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1,
                        backgroundColor: (theme) => theme.palette.background.paper,
                    }}
                >
                    <Tooltip title={'Close'} enterDelay={300}>
                        <IconButton
                            color="inherit"
                            onClick={() => isConfirm ? setIsConfirm(true):setIsOpen(false)}
                            edge="start"
                            sx={{ mx: 1 }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {title}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <BtnOption disabled={isDisableSubmit} loading={loadingBtn} options={options} onClick={handleSubmit}/>
                    </Stack>
                </Box>
                <Divider />
                <LoadingScreen isLoading={isLoading || loading}>
                    {children}
                </LoadingScreen>
            </Drawer>
        </>
    )
}

export default DrawerBase
