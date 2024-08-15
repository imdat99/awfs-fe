import { styled } from '@mui/system'
import React from 'react'
import { debounce, tryGetData } from 'Utils/helper'

export interface MaxtrixProps {
    row: number
    column: number
    data: number[][]
    rowHeight?: number
    colWidth?: number
    onChange: (
        data: number,
        position: {
            row: number
            column: number
        },
        isError?: boolean,
    ) => void
    errorLocation?: {
        row: number
        column: number
    }
    isChanged?: number
    onCellClick?: (row: number, column: number) => void
}

const Maxtrix: React.FC<MaxtrixProps> = ({
    row: rowCount,
    column: colCount,
    data,
    onChange,
    rowHeight = 56,
    colWidth = 56,
    errorLocation,
    onCellClick,
    isChanged: isChanged
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const tableRef = React.useRef<HTMLDivElement>(null)
    const tableHeaderRowRef = React.useRef<HTMLDivElement>(null)
    const tableHeaderColRef = React.useRef<HTMLDivElement>(null)
    const [currentCell, setCurrentCell] = React.useState<[number, number]>([0, 0])
    const container = containerRef.current
    const table = tableRef.current
    const tableHeaderRow = tableHeaderRowRef.current
    const tableHeaderCol = tableHeaderColRef.current
    const addCell = React.useCallback((
        table: HTMLDivElement,
        content: string,
        top: number,
        left: number,
        isEdit = false,
        name: string,
        className = 'cell',
    ) => {
        const cell = document.createElement('div')
        if (isEdit) {
            cell.setAttribute('contenteditable', 'true')
        }
        cell.setAttribute('name', name)
        cell.className = className
        cell.style.top = `${top}px`
        cell.style.left = `${left}px`
        cell.style.position = 'absolute'
        cell.textContent = content
        if(Number(content) < 1 || Number(content) > rowCount*colCount) {
            cell.style.background = '#d32f2f'
        }
        table.appendChild(cell)
    }, [colCount, rowCount])

    const renderVisibleCells = () => {
        if (!container || !table || !tableHeaderRow || !tableHeaderCol) return
        const scrollTop = container.scrollTop
        const scrollLeft = container.scrollLeft
        const visibleRowCount = Math.ceil(container.clientHeight / rowHeight)
        const visibleColCount = Math.ceil(container.clientWidth / colWidth)
        const firstVisibleRow = Math.floor(scrollTop / rowHeight)
        const lastVisibleRow = Math.min(rowCount, firstVisibleRow + visibleRowCount)

        const firstVisibleCol = Math.floor(scrollLeft / colWidth)
        const lastVisibleCol = Math.min(
            colCount,
            firstVisibleCol + visibleColCount,
        )
        tableHeaderCol.innerHTML = ''
        tableHeaderRow.innerHTML = ''
        table.innerHTML = '' // Xóa các ô trước khi render lại
        for (let row = firstVisibleRow; row < lastVisibleRow; row++) {
            for (let col = firstVisibleCol; col < lastVisibleCol; col++) {
                if (row == firstVisibleRow) {
                    addCell(
                        tableHeaderRow!,
                        `${col + 1}`,
                        0,
                        col * colWidth + colWidth,
                        false,
                        `header-row-${col + 1}`,
                        'cell-header',
                    )
                }
                if (col == firstVisibleCol) {
                    addCell(
                        tableHeaderCol!,
                        `${row + 1}`,
                        row * rowHeight,
                        0,
                        false,
                        `header-col-${row + 1}`,
                        'cell-left',
                    )
                }
                addCell(
                    table!,
                    tryGetData(() => String(data[row][col] || ''), ''),
                    row * rowHeight,
                    col * colWidth + colWidth,
                    true,
                    `cell-${row}-${col}`,
                )
            }
        }
    }
    function scrollToPosition(rowIndex: number, colIndex: number) {
        const targetScrollTop = rowIndex * rowHeight
        const targetScrollLeft = colIndex * colWidth
        container!.scrollTo({
            top: targetScrollTop,
            left: targetScrollLeft,
            behavior: 'smooth',
        })
        setCurrentCell([rowIndex, colIndex])

        renderVisibleCells()
    }
    React.useEffect(() => {
        let isDragging = false
        let startX: number,
            startY: number,
            scrollLeft: number,
            scrollTop: number

        if (!container || !table || !tableHeaderRow || !tableHeaderCol) return
        const rowHeight = 56
        const colWidth = 56

        const totalHeight = rowCount * rowHeight
        const totalWidth = colCount * colWidth

        table.style.height = `${totalHeight}px`
        table.style.width = `${totalWidth}px`
        tableHeaderRow.style.height = `${rowHeight}px`
        tableHeaderCol.style.width = `${colWidth}px`

     
        // scrollToPosition(100, 10)
        container.addEventListener('scroll', renderVisibleCells)
        container.onmousedown = (e) => {
            isDragging = true
            container.style.cursor = 'grabbing'
            startX = e.pageX - container.offsetLeft
            startY = e.pageY - container.offsetTop
            scrollLeft = container.scrollLeft
            scrollTop = container.scrollTop
        }
        container.onmouseup = () => {
            isDragging = false
            container.style.cursor = 'auto'
        }
        container.onmouseleave = () => {
            isDragging = false
            container.style.cursor = 'auto'
        }
        container.onmousemove = (e) => {
            if (!isDragging) return
            e.preventDefault()
            const x = e.pageX - container.offsetLeft
            const y = e.pageY - container.offsetTop
            const walkX = (x - startX) * 1.5 // Tăng tốc độ kéo theo trục X
            const walkY = (y - startY) * 1.5 // Tăng tốc độ kéo theo trục Y
            container.scrollLeft = scrollLeft - walkX
            container.scrollTop = scrollTop - walkY
        }
        renderVisibleCells()
        return () => {
            container.removeEventListener('scroll', renderVisibleCells)
        }
        // Rest of the code...
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowCount, colCount, containerRef.current])
    React.useEffect(() => {
        if (errorLocation) {
            scrollToPosition(errorLocation.row, errorLocation.column)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorLocation])
    React.useEffect(() => {
        const cell = container?.querySelector(
            `[name="cell-${currentCell[0]}-${currentCell[1]}"]`,
        ) as HTMLDivElement;
        if(cell) {
            cell!.classList.add('current-cell')
            cell!.textContent = String(data[currentCell[0]][currentCell[1]])
            validateCell(cell)
        }
    }
    ,[data, currentCell, isChanged])
    React.useEffect(() => {
        if(onCellClick) {onCellClick(currentCell[0], currentCell[1])}
        container?.querySelectorAll('.current-cell').forEach((cell) => {cell.classList.remove('current-cell')})
        const cell = container?.querySelector(
            `[name="cell-${currentCell[0]}-${currentCell[1]}"]`,
        ) as HTMLDivElement;
        if(cell) {
            cell!.classList.add('current-cell')
           cell.focus()
        }
    }, [currentCell])
    const validateCell = (cell: HTMLDivElement) => {
        let isError = false
        if (
            Number(cell.textContent) == 0 ||
            Number(cell.textContent) > rowCount * colCount
        ) {
            isError = true
            // (cell.textContent as any) = 1;
            cell.style.background = '#d32f2f'
        } else {
            isError = false
            cell.style.background = 'unset'
        }
        return isError
    }
    const handleInput = React.useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            const cell = e.target as HTMLDivElement
            const cellName = cell.getAttribute('name')!
            cell.textContent = cell.textContent!.replace(/[^0-9]/g, '')
            const isError = validateCell(cell)
            const cellValue = cell.textContent
            const prosition = cellName
                .split('-')
                .slice(1)
                .reduce(
                    (acc, cur, index) => {
                        if (index == 0) {
                            acc.row = Number(cur)
                        } else {
                            acc.column = Number(cur)
                        }
                        return acc
                    },
                    { row: 0, column: 0 },
                )
            handleChange(Number(cellValue), prosition, isError)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [colCount, rowCount],
    )
    const handleChange = React.useCallback(debounce(onChange, 200), [])
    const handleOnClick = (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
        const cell = e.target as HTMLDivElement
        const cellName = cell.getAttribute('name')!
        if (cellName?.includes('cell')) {
            const prosition = cellName
                .split('-')
                .slice(1)
                .reduce(
                    (acc, cur, index) => {
                        if (index == 0) {
                            acc.row = Number(cur)
                        } else {
                            acc.column = Number(cur)
                        }
                        return acc
                    },
                    { row: 0, column: 0 },
                )
            setCurrentCell([prosition.row, prosition.column])
        }
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        console.log(e.currentTarget)
        e.currentTarget.focus()
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault()
                const nextRow = currentCell[0] - 1
                if (nextRow >= 0) {
                    scrollToPosition(nextRow, currentCell[1])
                }
                break
            }
            case 'ArrowLeft': {
                e.preventDefault()
                const nextCol = currentCell[1] - 1
                if (nextCol >= 0) {
                    scrollToPosition(currentCell[0], nextCol)
                }
                break
            }
            case 'Tab':
            case 'ArrowRight': {
                e.preventDefault()
                const nextCol = currentCell[1] + 1
                if (nextCol < colCount) {
                    scrollToPosition(currentCell[0], nextCol)
                }
                break
            }
            case 'Enter': 
            case 'ArrowDown': {
                console.log('down')
                e.currentTarget.click()
                // e.preventDefault()
                const nextRow = currentCell[0] + 1
                if (nextRow < rowCount) {
                    scrollToPosition(nextRow, currentCell[1])
                }
                break
            }
                
            default:
                break
        }
        // if (e.key === 'Enter') {
        //     e.preventDefault()
        //     const nextRow = currentCell[0] + 1
        //     if (nextRow < rowCount) {
        //         setCurrentCell([nextRow, currentCell[1]])
        //     }
        // }
        // if (e.key === 'ArrowDown') {
        //     e.preventDefault()
        //     const nextRow = currentCell[0] + 1
        //     if (nextRow < rowCount) {
        //         setCurrentCell([nextRow, currentCell[1]])
        //     }
    }
    return (
        <FormStyled id="table-vip" onInput={handleInput} onClick={handleOnClick} onKeyDown={handleKeyDown}>
            <div className="table-container" ref={containerRef}>
                <div className="table-header-row" ref={tableHeaderRowRef}></div>
                <div className="table-header-col" ref={tableHeaderColRef}></div>
                <div className="virtual-table" ref={tableRef}></div>
            </div>
        </FormStyled>
    )
}
const FormStyled = styled('form')`
    transition: all 0.3s ease;
    width: 100%;
    height: 100%;
    // max-width: 1500px;
    // max-height: 1200px;
    overflow: auto;
    position: relative;
    font-size: 16px;
    .table-container {
        width: 100%;
        height: 100%;
        overflow: auto;
        position: relative;
    }
    .current-cell {
        border: 2px solid #000!important;
    }
    .table-header-row {
        height: 100%;
        position: sticky;
        top: 0;
        right: 0;
        background: #fff;
        z-index: 101;
    }
    .table-header-col {
        width: 100%;
        position: sticky;
        left: 0;
        background: #fff;
        z-index: 100;
    }
    .virtual-table {
        position: absolute;
        width: 100%;
    }

    .cell,
    .cell-header,
    .cell-left {
        display: inline-block;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border: 2px solid #ddd;
        border-radius: 3px;
        text-align: center;
        line-height: 56px;
        transition: all 0.3s ease;
    }
    .cell-header {
        user-select: none;
        border: none;
        box-shadow: 0 2px 2px #ddd;
        background-color: #f1f1f1;
    }
    .cell-left {
        user-select: none;
        border: none;
        box-shadow: 2px 0 2px #ddd;
        background-color: #f1f1f1;
    }
    .cell {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    [contenteditable='true'] {
        user-select: none;
    }
`
export default Maxtrix
