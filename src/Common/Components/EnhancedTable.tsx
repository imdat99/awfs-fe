import {
    Box,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableCellProps,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import React, { memo, useMemo } from 'react'


export type Render<T> = (v: T, i?: number) => JSX.Element | string | number | null;

export interface IColumn<T = any> {
  label?: React.ReactNode;
  headProps?: TableCellProps;
  props?: TableCellProps;
  dataIndex: keyof T;
  key?: string;
  render?: Render<T>;
}
const genericMemo: <T>(component: T) => T = memo
// type T = Record<string, React.ReactNode>;

const randomId = (n = 1) => (Math.random() + n).toString(36).substring(7)

interface EnhancedTableProps<T> {
    rows: T[];
    columns: IColumn<T>[];
    title: React.ReactNode;
    setSelected: React.Dispatch<React.SetStateAction<number[]>>;
    selected: number[];
    onRowChange?: React.FormEventHandler<HTMLTableRowElement>;
}
const EnhancedTable = <T,>({
    rows,
    columns,
    title,
    setSelected,
    selected,
    onRowChange,
}: EnhancedTableProps<T>) => {
    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            const newSelected = rows.map((_, i) => i)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: number[] = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            )
        }
        setSelected(newSelected)
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1
    const indeterminate = useMemo(
        () => selected.length > 0 && selected.length < rows.length,
        [rows, selected],
    )
    const checked = useMemo(
        () => rows.length > 0 && selected.length === rows.length,
        [rows, selected],
    )
    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer>
                {title}
                <Table aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    indeterminate={indeterminate}
                                    checked={checked}
                                    onChange={handleSelectAllClick}
                                    inputProps={{
                                        'aria-label': 'select all desserts',
                                    }}
                                />
                            </TableCell>
                            {columns.map(
                                (column, index) =>
                                    column.label && (
                                        <TableCell
                                            {...column?.[
                                                column?.headProps
                                                    ? 'headProps'
                                                    : 'props'
                                            ]}
                                            key={column.key || index}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ),
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rows.map((row, index) => {
                            const isItemSelected = isSelected(index)
                            return (
                                <TableRow
                                    data-rowindex={index}
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={index}
                                    selected={isItemSelected}
                                    classes={{
                                        selected: 'app-row-selected',
                                    }}
                                    onChange={onRowChange}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            onClick={(event) =>
                                                handleClick(event, index)
                                            }
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={randomId(index)}
                                            {...column?.props}
                                        >
                                            {column.render ? column.render(row, index) : row[column.dataIndex as keyof T] as React.ReactNode}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export default EnhancedTable;
