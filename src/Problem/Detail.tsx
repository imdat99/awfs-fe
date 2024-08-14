import { Close } from '@mui/icons-material'
import {
    Box,
    Divider,
    Drawer,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material'
import BtnOption from 'Common/Components/BtnOption'
import React from 'react'
import Maxtrix, { MaxtrixProps } from './Maxtrix'
const options = [
    {
        label: 'Lưu và Giải',
        value: 'solve',
    },
    {
        label: 'Chỉ Lưu',
        value: 'save',
    },
]
const Detail = () => {
    const [matrixData, setMatrixData] = React.useState<{
        row: number
        column: number
        data: number[][]
    }>({
        row: 5,
        column: 5,
        data: [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 25],
        ],
    })
    const [isChanged, setIsChanged] = React.useState(0)
    const [currentCell, setCurrentCell] = React.useState<[number, number]>([0, 0])
    const errorObj = React.useMemo(() => {
        let errorIndex = [0,0];
        const error = matrixData.data.some((row, i) => row.some((value, j) => {
            if(value < 1 || value > matrixData.row * matrixData.column) {
                errorIndex = [i,j];
                return true;
            }
            return false;
        }))
        return {
            isError: error,
            errorIndex
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, matrixData.data.flat())
    const updateMatrix = React.useCallback(
        (newRows: number, newColumns: number) => {
            setMatrixData((prevState) => {
                const currentRows = prevState.row
                const currentColumns = prevState.column
                if (newRows < 0) newRows = currentRows
                if (newColumns < 0) newColumns = currentColumns
                const newData = Array(newRows)
                    .fill(0)
                    .map(() => Array(newColumns).fill(0))
                for (let i = 0; i < currentRows; i++) {
                    for (let j = 0; j < currentColumns; j++) {
                        if (i < newRows && j < newColumns) {
                            newData[i][j] = prevState.data[i][j]
                        }
                    }
                }

                return {
                    row: newRows,
                    column: newColumns,
                    data: newData,
                }
            })
        },
        [],
    )
    const handleChangeMatrix: MaxtrixProps['onChange'] = React.useCallback(
        (data, position, isError) => {
            setIsChanged(Math.random())
            setMatrixData((p) => {
                const cloneData = p.data
                cloneData[position.row][position.column] = data
                return {
                    ...p,
                    data: cloneData,
                }
            })
        },
        [],
    )
    return (
        <Drawer
            anchor={'right'}
            open={true}
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
                        // onClick={handleClose}
                        edge="start"
                        sx={{ mx: 1 }}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {/* {title} */}chào
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                >
                    <BtnOption options={options} />
                </Stack>
            </Box>
            <Divider />
            <Box
                sx={{
                    p: 2,
                    height: 'calc(100% - 52px)',
                    overflowY: 'auto',
                    "& div:not(:last-of-type)": {
                        marginRight: 2,
                    }
                }}
            >
                <Box sx={{ mb: 2,  }}>
                    <TextField
                        label="Số hàng (n)"
                        inputMode="numeric"
                        variant="standard"
                        value={matrixData.row}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value) && value > 0 && value <= 500) {
                                updateMatrix(value, -1)
                            }
                        }}
                    />
                    <TextField
                        label="Số cột (m)"
                        inputMode="numeric"
                        variant="standard"
                        value={matrixData.column}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value)) {
                                updateMatrix(-1, value)
                            }
                        }}
                    />
                    <TextField
                        label="Số loại rương"
                        inputMode="numeric"
                        variant="standard"
                        value={matrixData.column}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value)) {
                                // updateMatrix(-1, value)
                            }
                        }}
                    />
                    <TextField
                        label={`fx(${currentCell.map((v) => v + 1)})`}
                        inputMode="numeric"
                        variant="standard"
                        value={matrixData.data[currentCell[0]][currentCell[1]]}
                        onChange={(e) => {
                            const value = parseInt(e.target.value)
                            if (!isNaN(value)) {
                                handleChangeMatrix(value, {
                                    row: currentCell[0],
                                    column: currentCell[1],
                                }, value > 0 && value <= 500)
                                // updateMatrix(-1, value)
                            }
                        }}
                    />
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Ma trận {matrixData.row} hàng {matrixData.column} cột &nbsp;
                </Typography>
                <Typography variant="caption" sx={{ color: errorObj.isError ? "red" : 'gray' }}>
                    (Nhập giá trị vào ô, giá trị nhỏ nhất là 1, lớn nhất là{' '}
                    {matrixData.row * matrixData.column} {errorObj.isError ? <span>Lỗi ở ô ({errorObj.errorIndex[0] + 1}, {errorObj.errorIndex[1] + 1})</span> : ""})
                </Typography>
                <Box
                    sx={{
                        height: 'calc(100% - 120px)',
                    }}
                >
                    <Maxtrix
                        {...matrixData}
                        // errorLocation={errorObj.isError ? {
                        //     row: errorObj.errorIndex[0],
                        //     column: errorObj.errorIndex[1]
                        // }: undefined}
                        isChanged={isChanged}
                        onCellClick={(row, column) => setCurrentCell([row, column])}
                        onChange={handleChangeMatrix}
                    />
                </Box>
            </Box>
        </Drawer>
    )
}

export default Detail
