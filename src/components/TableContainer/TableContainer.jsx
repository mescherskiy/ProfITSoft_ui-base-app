import React from 'react'
import TableContainerMUI from '@mui/material/TableContainer';

function TableContainer(
  {
    children,
    maxHeight=440,
}) {
  return (
    <TableContainerMUI sx={{maxHeight}}>
        {children}
    </TableContainerMUI>
  )
}

export default TableContainer