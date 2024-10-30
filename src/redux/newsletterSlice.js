// redux/newsletterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const subscribeToNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email, { rejectWithValue }) => {
    try {
      // Simulate an API call or Firestore operation
      // Here you would normally interact with Firestore or any API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return email; // Return email as subscribed
    } catch (error) {
      return rejectWithValue("Subscription failed");
    }
  }
);

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState: {
    message: '',
    loading: false,
    subscribed: false,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.loading = true;
      })
      .addCase(subscribeToNewsletter.fulfilled, (state, action) => {
        state.loading = false;
        state.subscribed = true;
        state.message = `Subscribed with ${action.payload}`;
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      });
  },
});

export const { clearMessage } = newsletterSlice.actions;
export default newsletterSlice.reducer;
