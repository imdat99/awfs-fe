import {
    Box,
    Button,
    Card,
    IconButton,
    Pagination,
    Tooltip,
    Typography,
} from '@mui/material'
import LoadingScreen from 'Common/Components/LoadingScreen'
import useGetData from 'Hooks/useGetData'
import React from 'react'
import Client, { ProblemPagingResponseDTO } from 'Utils/Client'
import { AddBox, CheckCircle, Delete, Edit, Loop } from '@mui/icons-material'
import Actions from './Actions'
import EnhancedTable from 'Common/Components/EnhancedTable'
const Problem = () => {
    const [query, setQuery] = React.useState({
        page: 1,
        pageSize: 10,
    })
    const [data, isLoading] = useGetData(
        [undefined, undefined, query.page, query.pageSize],
        Client.getProblem,
    )
    console.log('data', data)
    return (
        <LoadingScreen isLoading={isLoading}>
            <Actions />

            <Box sx={{ minWidth: '1300px' }}>
                <EnhancedTable
                    rows={data?.items || []}
                    columns={[
                        {
                            dataIndex: "id",
                            headProps: { sx: { fontWeight: "bold" } },
                            label: "ID",
                        },
                        {
                            dataIndex: "title",
                            headProps: { sx: { fontWeight: "bold" } },
                            label: "Title",
                        },
                        {
                            dataIndex: "result",
                            label: "Result",
                            render: (v) => v.result ? v.result : "Chưa có kết quả"
                        },
                        {
                            dataIndex: "id",
                            label: <Button variant="outlined" color="primary" sx={{ my: 'auto' }}>
                                Thêm
                            </Button>,
                            props: { sx: { textAlign: "end", width: "120px" } },
                            render: (v) => (
                                <Box display="flex" justifyContent={"end"}>
                                    <Tooltip title="Tính lại">
                                        <IconButton>
                                            <Loop />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton>
                                            <Delete color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            ),
                        }
                    ]}
                    getRowKey={(row) => row.id!}
                    onSelect={console.log}
                />
                {data?.totalPage && data.totalPage > 1 && (
                    <Pagination count={data?.totalPage} color="secondary" />
                )}
            </Box>
        </LoadingScreen>
    )
}

export default Problem
