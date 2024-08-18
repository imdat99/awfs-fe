import { Delete, Loop } from '@mui/icons-material'
import { Box, Button, IconButton, Pagination, Tooltip } from '@mui/material'
import EnhancedTable from 'Common/Components/EnhancedTable'
import LoadingScreen from 'Common/Components/LoadingScreen'
import useGetData from 'Hooks/useGetData'
import React from 'react'
import Client from 'Utils/Client'
import Actions from './Actions'
import Detail from './Detail'
import ConfirmDialog, { ConfirmDialogProps } from 'Common/Components/ConfirmDialog'
import { CLOSE_TYPE } from 'Common/Enums'
const Problem = () => {
    // const [selectedRow, setSelected] = React.useState<string[]>([])
    const [detailId, setDetailId] = React.useState<number>(-1)
    const [selectedRow, setSelectedRow] = React.useState<string[]>([])
    const [query, setQuery] = React.useState<Record<string, any>>({
        title: undefined,
        isSolved: null,
        page: 1,
        pageSize: 10,
    })
    const [trigger, setTrigger] = React.useState(0)
    const [clickType, setclickType] = React.useState<string>('')
    const [dialogData, setDialogData] = React.useState<Omit<ConfirmDialogProps, 'setOpen'>>({
        open: false,
        onConfirm: () => Promise.resolve(),
    })
    const [loading, setLoading] = React.useState(false)
    const [data, isLoading] = useGetData(
        [query.isSolved ?? undefined, query.title, query.page, query.pageSize],
        Client.getProblem,
        { trigger: trigger },
    )
    React.useEffect(() => {
        if (clickType !== '') {
            const [type, id] = clickType.split('/')
            switch (type) {
            case 'add':
                setDetailId(0)
                break
            case 'bulk-delete':
                setDialogData({
                    open: true,
                    onConfirm: () => handleRemove(selectedRow),
                })
                break
            case 're-calculate':
                handleReSolver(id)
                break
            case 'delete':
                setDialogData({
                    open: true,
                    onConfirm: () => handleRemove([id])
                })
                break
            case 'view':
                setDetailId(parseInt(id))
                break
            default:
                console.log(clickType)
                break
            }
            setclickType('')
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clickType])
    const handleRemove = (ids: string[]) => {
        return Client.remove(ids.map((id) => parseInt(id))).then(() => {
            setQuery((prev) => ({ ...prev, page: 1 }))
            setTrigger(Math.random())
            setSelectedRow([])
        })
    }
    const handleReSolver = (id: string) => {
        setLoading(true)
        Client.resolve(parseInt(id)).then(() => setTrigger(Math.random())).finally(() => setLoading(false))
    }
    return (
        <>
            <ConfirmDialog
                open={dialogData.open}
                setOpen={(open) => {
                    setDialogData((prev) => ({ ...prev, open }))
                }}
                onConfirm={dialogData.onConfirm}
            />
            {detailId !== -1 && (
                <Detail
                    id={detailId}
                    onClose={(type?: CLOSE_TYPE) => {
                        setDetailId(-1)
                        if (type === CLOSE_TYPE.SUCCESS)
                            setTrigger(Math.random())
                    }}
                />
            )}
            <LoadingScreen isLoading={isLoading || loading}>
                <Actions
                    onFilterChange={(filter) =>
                        setQuery((p) => ({ ...p, ...filter }))
                    }
                />
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
                                headProps: selectedRow.length
                                    ? { colSpan: 3 }
                                    : {},
                            },
                            {
                                dataIndex: 'title',
                                label: selectedRow.length ? '' : 'Title',
                            },
                            {
                                dataIndex: 'result',
                                label: selectedRow.length ? '' : 'Result',
                                render: (v) =>
                                    !isNaN(Number(v.result))
                                        ? v.result
                                        : 'Chưa có kết quả',
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
                                props: {
                                    sx: { textAlign: 'end', width: '120px' },
                                },
                                render: (v) => (
                                    <Box display="flex" justifyContent={'end'}>
                                        <Tooltip title="Tính lại" aria-disabled>
                                            <Box>
                                                <IconButton
                                                    disabled={
                                                        !!selectedRow.length
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setclickType(
                                                            're-calculate/' +
                                                                v.id,
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
                                                    disabled={
                                                        !!selectedRow.length
                                                    }
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
                    {!!data?.totalPage && data.totalPage > 1 && (
                        <Pagination
                            sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
                            count={data?.totalPage}
                            color="secondary"
                            onChange={(_e, page) => {
                                setQuery((prev) => ({ ...prev, page }))
                            }}
                        />
                    )}
                </Box>
            </LoadingScreen>
        </>
    )
}

export default Problem
