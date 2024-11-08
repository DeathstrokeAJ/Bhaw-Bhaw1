"use client"

import { createSlice } from '@reduxjs/toolkit';

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    selectedService: null,
  },
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
});

export const { setSelectedService, clearSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
