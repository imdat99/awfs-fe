import { Delete, Loop } from '@mui/icons-material'
import {
    Box,
    Button,
    IconButton,
    Pagination,
    Tooltip
} from '@mui/material'
import EnhancedTable from 'Common/Components/EnhancedTable'
import LoadingScreen from 'Common/Components/LoadingScreen'
import useGetData from 'Hooks/useGetData'
import React from 'react'
import Client from 'Utils/Client'
import Actions from './Actions'
import Detail from './Detail'
const Problem = () => {
    // const [selectedRow, setSelected] = React.useState<string[]>([])
    const [selectedRow, setSelectedRow] = React.useState<string[]>([])
    const [query, setQuery] = React.useState({
        page: 1,
        pageSize: 10,
    })
    const [clickType, setclickType] = React.useState<string>("")
    const [data, isLoading] = useGetData(
        [undefined, undefined, query.page, query.pageSize],
        Client.getProblem,
    )
    React.useEffect(() => {
        if (clickType !== "") {
            if (clickType === "add") {
                console.log("add")
            } else if (clickType === "bulk-delete") {
                console.log("bulk-delete")
            } else {
                console.log(clickType)
            }
            setclickType("")
        }
    }, [clickType])
    return (
        <LoadingScreen isLoading={isLoading}>
            <Actions />
            <Detail />
            <Box
                sx={{
                    minWidth: '1300px',
                    '& .app-table-cell': { fontWeight: 'bold' },
                }}
            >
                <EnhancedTable
                    rows={data?.items || []}
                    columns={[
                        {
                            dataIndex: 'id',
                            label: selectedRow.length ? (
                                <Tooltip title="Xoá">
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() =>
                                            setclickType('bulk-delete')
                                        }
                                    >
                                        <Delete fontSize="medium" />
                                    </IconButton>
                                </Tooltip>
                            ) : (
                                'ID'
                            ),
                            headProps: selectedRow.length ? { colSpan: 3 } : {},
                        },
                        {
                            dataIndex: 'title',
                            label: selectedRow.length ? '' : 'Title',
                        },
                        {
                            dataIndex: 'result',
                            label: selectedRow.length ? '' : 'Result',
                            render: (v) =>
                                v.result ? v.result : 'Chưa có kết quả',
                        },
                        {
                            dataIndex: 'id',
                            label: (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ my: 'auto' }}
                                    onClick={() => setclickType('add')}
                                >
                                    Thêm
                                </Button>
                            ),
                            props: { sx: { textAlign: 'end', width: '120px' } },
                            render: (v) => (
                                <Box display="flex" justifyContent={'end'}>
                                    <Tooltip title="Tính lại" aria-disabled>
                                        <Box>
                                            <IconButton
                                                disabled={!!selectedRow.length}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setclickType(
                                                        're-calculate/' + v.id,
                                                    )
                                                }}
                                            >
                                                <Loop />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                    <Tooltip title="Delete" aria-disabled>
                                        <Box>
                                            <IconButton
                                                disabled={!!selectedRow.length}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setclickType(
                                                        'delete/' + v.id,
                                                    )
                                                }}
                                            >
                                                <Delete
                                                    color={
                                                        selectedRow.length
                                                            ? 'disabled'
                                                            : 'error'
                                                    }
                                                />
                                            </IconButton>
                                        </Box>
                                    </Tooltip>
                                </Box>
                            ),
                        },
                    ]}
                    onRowClick={
                        selectedRow.length
                            ? undefined
                            : (row) => setclickType('view/' + row.id)
                    }
                    getRowKey={(row) => row.id!}
                    onSelect={setSelectedRow}
                />
                {data?.totalPage && data.totalPage > 1 && (
                    <Pagination count={data?.totalPage} color="secondary" onChange={(_e, page) => {
                        setQuery((prev) => ({ ...prev, page }))
                    }}/>
                )}
            </Box>
        </LoadingScreen>
    )
}

export default Problem
