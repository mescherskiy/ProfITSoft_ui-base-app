import React from 'react'
import TableBodyMUI from '@mui/material/TableBody';

function TableBody({
    children,
}) {
  return (
    <TableBodyMUI>
        {children}
    </TableBodyMUI>
  )
}

export default TableBody