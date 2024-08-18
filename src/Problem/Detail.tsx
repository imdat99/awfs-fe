import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import DrawerBase from 'Common/Components/DrawerBase'
import React from 'react'
import client, { ProblemDTO } from 'Utils/Client'
import Maxtrix, { MaxtrixProps } from './Maxtrix'
import { Repeat } from '@mui/icons-material'
import { CLOSE_TYPE } from 'Common/Enums'

interface DetailProps {
    id: number
    onClose: (type?: CLOSE_TYPE) => void
}
const Detail: React.FC<DetailProps> = ({ id, onClose }) => {
    const [problemData, setProblemData] = React.useState<ProblemDTO>(
        ProblemDTO.fromJS({
            col: 1,
            row: 1,
            chestTypes: 1,
            matrix: [[0]],
        }),
    )
    const [isLoading, setIsLoading] = React.useState(true)
    const [triggerReload, setTrigger] = React.useState(0)
    const [isChanged, setIsChanged] = React.useState(0)
    const [currentCell, setCurrentCell] = React.useState<[number, number]>([
        0, 0,
    ])
    const errorObj = React.useMemo(() => {
        let errorIndex = [0, 0]
        const greaterThan: number[] = [];
        problemData.matrix?.forEach((row, i) =>
            row.filter((value, j) => {
                if (
                    value < 1 ||
                        value >= problemData.chestTypes!
                ) {
                    errorIndex = [i, j]
                    greaterThan.push(value)
                    return true
                }
                return false
            }).length > 0,
        )
        return {
            isError: greaterThan.length != 1 || (problemData.matrix!.flat().length < 2 && greaterThan.some((v) => v < 1 || v >= problemData.chestTypes!)),
            errorIndex,
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [problemData.matrix?.flat(), problemData.chestTypes])
    React.useEffect(() => {
        if(id) {
            setIsLoading(true)
            client
                .getProblemById(id)
                .then(setProblemData)
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [id])
    const handleSubmit = (type: string) => {
        if(id === 0) {
            return client.addProblem(type === "solve", problemData)
        }
        return client.updateProblem(id, problemData)
    }
    const updateMatrix = React.useCallback(
        (newRows: number, newColumns: number) => {
            setIsChanged(Math.random())
            setProblemData((prevState) => {
                const currentRows = prevState.row
                const currentColumns = prevState.col
                if (newRows < 0) newRows = Number(currentRows)
                if (newColumns < 0) newColumns = Number(currentColumns)
                const newData = Array(newRows)
                    .fill(0)
                    .map(() => Array(newColumns).fill(0))
                for (let i = 0; i < currentRows!; i++) {
                    for (let j = 0; j < currentColumns!; j++) {
                        if (i < newRows && j < newColumns) {
                            newData[i][j] = prevState.matrix![i][j]
                        }
                    }
                }
                return ProblemDTO.fromJS({
                    ...prevState,
                    row: newRows,
                    col: newColumns,
                    matrix: newData,
                })
            })
        },
        [],
    )
    const handleChangeMatrix: MaxtrixProps['onChange'] = React.useCallback(
        (data, position, _isError) => {
            setIsChanged(Math.random())
            setProblemData((p) => {
                const cloneData = p.matrix!
                cloneData[position.row][position.column] = data
                return ProblemDTO.fromJS({
                    ...p,
                    matrix: cloneData,
                })
            })
        },
        [],
    )
    const handleFillRandom = React.useCallback(() => {
        setProblemData((p) => {
            const cloneData = p.matrix!.map((row) =>
                row.map(
                    () =>
                        Math.floor(
                            Math.random() * (problemData.chestTypes! - 1) || 0,
                        ) + 1,
                ),
            )
            const random = (num: number) => Math.floor(Math.random() * num!)
            cloneData[random(cloneData.length)][random(cloneData[0].length)] = problemData.chestTypes!
            return ({
                ...p,
                matrix: cloneData,
            } as ProblemDTO) 
        })
        setIsChanged(Math.random())
        setTrigger(Math.random())
    }, [problemData.chestTypes])
    return (
        <>
            <DrawerBase
                submidOptions={id == 0 ? [
                    {
                        label: 'Lưu và Giải',
                        value: 'solve',
                    },
                    {
                        label: 'Chỉ Lưu',
                        value: 'save',
                    },
                ]: [
                    {label: 'Lưu', value: 'save'}
                ]}
                onClose={onClose}
                title={<TextField
                    fullWidth
                    sx={{width: "70%"}}
                    label="Title"
                    size='small'
                    value={problemData.title || ''}
                    onChange={(e) => {
                        setProblemData((p) =>
                            ProblemDTO.fromJS({
                                ...p,
                                title: e.target.value,
                            }),
                        )
                    }}
                />}
                onSubmitted={handleSubmit}
                isDisableSubmit={errorObj.isError || !problemData.title}
                isConfirm={isChanged > 0}
                loading={isLoading}
            >
                <Box
                    sx={{
                        p: 2,
                        height: 'calc(100% - 52px)',
                        overflowY: 'auto',
                        '& div:not(:last-of-type)': {
                            marginRight: 2,
                        },
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            label="Số hàng (n)"
                            inputMode="numeric"
                            variant="standard"
                            value={problemData.row}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (
                                    !isNaN(value) &&
                                    value > 0 &&
                                    value <= 500
                                ) {
                                    updateMatrix(value, -1)
                                }
                            }}
                        />
                        <TextField
                            label="Số cột (m)"
                            inputMode="numeric"
                            variant="standard"
                            value={problemData.col}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (
                                    !isNaN(value) &&
                                    value > 0 &&
                                    value <= 500
                                ) {
                                    updateMatrix(-1, value)
                                }
                            }}
                        />
                        <TextField
                            label="Số loại rương"
                            inputMode="numeric"
                            variant="standard"
                            value={problemData.chestTypes}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (
                                    !isNaN(value) &&
                                    value > 0 &&
                                    value <= problemData.col! * problemData.row!
                                ) {
                                    setIsChanged(Math.random())
                                    setProblemData((p) =>
                                        ProblemDTO.fromJS({
                                            ...p,
                                            chestTypes: value,
                                        }),
                                    )
                                }
                            }}
                        />
                        <TextField
                            label={`fx(${currentCell.map((v) => v + 1)})`}
                            inputMode="numeric"
                            variant="standard"
                            value={String(
                                problemData.matrix![currentCell[0]][
                                    currentCell[1]
                                ],
                            )}
                            onChange={(e) => {
                                const value = parseInt(e.target.value)
                                if (!isNaN(value)) {
                                    handleChangeMatrix(
                                        value,
                                        {
                                            row: currentCell[0],
                                            column: currentCell[1],
                                        },
                                        value > 0 && value <= problemData.chestTypes!,
                                    )
                                    // updateMatrix(-1, value)
                                }
                            }}
                        />
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Ma trận {problemData.row} hàng {problemData.col} cột
                        &nbsp;
                        {problemData.result && !isChanged && (
                            <b style={{ color: 'green' }}>
                                Kết quả: {problemData.result}
                            </b>
                        )}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{ color: errorObj.isError ? 'red' : 'gray' }}
                    >
                        (Sử dụng các phím mũi tên để di chuyển, giá trị nhỏ nhất
                        là 1, lớn nhất là {problemData.chestTypes}{' '}
                        {errorObj.isError ? (
                            <span>
                                Lỗi ở ô ({errorObj.errorIndex[0] + 1},{' '}
                                {errorObj.errorIndex[1] + 1})
                            </span>
                        ) : (
                            ''
                        )}
                        )
                        <Tooltip title="Fill giá trị random vào bảng">
                            <IconButton size="small" onClick={handleFillRandom}>
                                <Repeat fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Typography>
                    <Box
                        sx={{
                            height: 'calc(100% - 130px)',
                        }}
                    >
                        {!isNaN(problemData.row!) &&
                            !isNaN(problemData.col!) && (
                            <Maxtrix
                                column={problemData.col!}
                                row={problemData.row!}
                                data={problemData.matrix!}
                                chestTypes={problemData.chestTypes!}
                                isMatrixError={errorObj.isError}
                                triggerReload={triggerReload}
                                onCellActive={(row, column) =>
                                    setCurrentCell([row, column])
                                }
                                isChanged={isChanged}
                                onCellClick={(row, column) =>
                                    setCurrentCell([row, column])
                                }
                                onChange={handleChangeMatrix}
                            />
                        )}
                    </Box>
                </Box>
            </DrawerBase>
        </>
    )
}

export default Detail
