import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const checkInOutSlice = createSlice({
  name: 'checkInOut',
  initialState: {
    checkIn: today,
    checkOut: tomorrow,
  },
  reducers: {
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload;
    },
  },
});

export const { setCheckIn, setCheckOut } = checkInOutSlice.actions;
export default checkInOutSlice.reducer;
