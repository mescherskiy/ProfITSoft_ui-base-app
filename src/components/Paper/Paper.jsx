import React from 'react'
import PaperMUI from '@mui/material/Paper';

function Paper({
    children,
    overflow,
    width,
}) {
  return (
    <PaperMUI sx={{ width, overflow }}>
        {children}
    </PaperMUI>
  )
}

export default Paper