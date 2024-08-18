import { Box, Chip, TextField, Typography } from '@mui/material';
import React from 'react';
import { debounce } from 'Utils/helper';
interface ActionsProps {
    onFilterChange: (filter: {isSolved: boolean | null; title: string}) => void
}
const Actions: React.FC<ActionsProps> = ({onFilterChange}) => {
    const [filter, setFilter] = React.useState<{isSolved: boolean | null; title: string}>({
        isSolved: null,
        title: "",
    })
    React.useEffect(() => {
        onFilterChange(filter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeTitle = React.useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter((p) => ({...p, title: e.target.value}))
    }, 500), [])
    return (
        <Box display={'flex'} sx={{ mb: 2, justifyContent: "end" }}>
            <Typography variant="overline" sx={{ my: 'auto', mr: 2, cursor: "pointer", userSelect : "none" }} onClick={(_e) => {
                setFilter((p) => ({...p, isSolved: p.isSolved === null ? true : p.isSolved ? !p.isSolved : null}))
            }}>
                <Chip label={filter.isSolved === null ? "Tất cả" : filter.isSolved ? "Đã giải" : "Chưa giải"} />
                
            </Typography>
            <TextField
                sx={{ width: 500 }}
                size="small"
                label="Tìm kiếm"
                variant="outlined"
                onChange={handleChangeTitle}
            />
        </Box>
    )
}

export default Actions
