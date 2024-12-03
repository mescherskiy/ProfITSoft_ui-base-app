import React from 'react'
import TableCellMUI from '@mui/material/TableCell';

function TableCell({
    children,
    
    align,
    style,
}) {
  return (
    <TableCellMUI align={align} style={style}>
        {children}
    </TableCellMUI>
  )
}

export default TableCell