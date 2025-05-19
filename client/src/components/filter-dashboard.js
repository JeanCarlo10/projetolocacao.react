import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  Grid, Checkbox, Tooltip, FormControl, OutlinedInput,
  InputLabel, MenuItem, ListItemText, Select, Box
} from '@mui/material';
import { formatCurrentMonth } from '../helpers/dateFilter';
import { statusFilterDashboard } from '../../src/functions/static_data';

const ITEM_HEIGHT = 70;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  MenuListProps: {
    sx: {
      "&& .Mui-selected": {
        backgroundColor: "#00AB5514",

        '&: hover': {
          backgroundColor: "#00AB5514"
        }
      },
      "&& .Mui-checked": {
        color: '#00AB55'
      }
    }
  },

  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FilterDashboard(props) {
  const { currentMonth, onMonthChange, onResetFilters, search, onChangeSearch, status, onChangeStatus } = props;

  const handlePrevMonth = () => {
    var newCurrentMonth = new Date(currentMonth.valueOf());
    newCurrentMonth.setMonth(newCurrentMonth.getMonth() - 1);

    onMonthChange(newCurrentMonth);
  }

  const handleNextMonth = () => {
    var newCurrentMonth = new Date(currentMonth.valueOf());
    newCurrentMonth.setMonth(newCurrentMonth.getMonth() + 1);

    onMonthChange(newCurrentMonth);
  }

  return (
    <Box sx={{
      borderRadius: '10px',
      padding: 2,
      margin: '16px 0',
      border: "1px solid #E0E1E0",
      boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, color: '#616161' }}>
        <FilterAltRoundedIcon />
        <span style={{ fontSize: '18px', fontWeight: 600 }}>Filtros</span>
      </div>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <div style={{
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
            justifyContent: 'space-between',
          }}>
            <Tooltip title="Anterior">
              <IconButton
                sx={{
                  padding: 0,
                  borderRadius: '10px',
                  width: 55,
                  height: 55,
                  color: '#FFF',
                  backgroundColor: '#00AB55',

                  '&:hover': {
                    backgroundColor: '#08690A',
                  },
                }}
                onClick={handlePrevMonth}>
                <ArrowBackIosRoundedIcon />
              </IconButton>
            </Tooltip>

            <div style={{ fontWeight: 700, color: '#2d2a26', fontSize: 20 }}>
              {formatCurrentMonth(currentMonth)}
            </div>

            <Tooltip title="Próximo">
              <IconButton
                sx={{
                  padding: 0,
                  borderRadius: '10px',
                  width: 55,
                  height: 55,
                  color: '#FFF',
                  backgroundColor: '#00AB55',

                  '&:hover': {
                    backgroundColor: '#08690A',
                  },
                }}
                onClick={handleNextMonth}>
                <ArrowForwardIosRoundedIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size='medium'
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchRoundedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Buscar cliente"
            variant="outlined"
          />
        </Grid>

        <Grid item row xs={12} sm={6} md={3} >
          <FormControl fullWidth
            sx={{
              '& .MuiInputLabel-root': {
                '&.Mui-focused': {
                  color: '#00AB55',
                },
              },

              '& .MuiOutlinedInput-root': {
                fontWeight: 500,
                fontFamily: 'Nunito',
                height: '56px',

                '& fieldset': {
                  borderRadius: '6px',
                  borderColor: '#BCBCBC',
                  borderStyle: 'solid',
                },

                '&:hover fieldset': {
                  borderColor: '#00AB55',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00AB55',
                },
              }
            }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={status}
              onChange={(e) => onChangeStatus(e.target.value)}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {statusFilterDashboard.map((item) => (
                <MenuItem key={item.id} value={item.label}>
                  <Checkbox success checked={status.indexOf(item.label) > -1} />
                  <ListItemText primary={item.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item row xs={12} sm={6} md={2}>
          <Button variant="contained" style={{ height: '56px', borderRadius: 6 }} fullWidth onClick={onResetFilters}>
            Limpar filtros
          </Button>
        </Grid>
      </Grid>

    </Box>
  );
}

// const useStyles = makeStyles((theme) => ({
//   boxFilter: {
//     borderRadius: 10,
//     padding: 16,
//     margin: '16px 0',
//     border: "1px solid #E0E1E0",
//     boxShadow: "0px 2px 4px 0 rgba(0, 0, 0, .2)",
//   },

//   textFilter: {
//     display: 'flex',
//     alignItems: 'center',
//     marginBottom: 8,
//     color: '#616161'
//   },

//   containerFilterDate: {
//     flexDirection: 'row',
//     display: 'flex',
//     alignItems: 'center',
//     textAlign: 'center',
//     gap: '8px',
//     justifyContent: 'space-between',
//   },

//   select: {
//     '& .MuiInputLabel-root': {
//       '&.Mui-focused': {
//         color: '#00AB55',
//       },
//     },

//     '& .MuiOutlinedInput-root': {
//       fontWeight: 500,
//       fontFamily: 'Nunito',
//       height: '56px',

//       '& fieldset': {
//         borderRadius: 6,
//         borderColor: '#BCBCBC',
//         borderStyle: 'solid',
//       },

//       '&:hover fieldset': {
//         borderColor: '#00AB55',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#00AB55',
//       },
//     }
//   },

//   btnMonth: {
//     padding: 0,
//     borderRadius: 8,
//     width: 55,
//     height: 55,
//     color: '#FFF',
//     backgroundColor: '#00ab55',

//     '&:hover': {
//       backgroundColor: '#08690A',
//     },
//   }
// }));