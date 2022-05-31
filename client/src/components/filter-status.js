import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function FilterStatus(props) {
  const classes = useStyles();
  const { status, changeChecked, id, label  } = props;

  const {checked} = undefined || {};

  return (
    <>
      <FormGroup row>
        <FormControlLabel control={<Checkbox checked={checked} onChange={() => changeChecked(id)} />} label={label} />
      </FormGroup>
    </>
  );
}

const useStyles = makeStyles((theme) => ({


}));