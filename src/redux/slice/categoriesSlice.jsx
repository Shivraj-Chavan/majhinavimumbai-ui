import { apiGet } from '@/lib/apiClient';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let lastFetchTime = 0; // track last fetch timestamp
const FETCH_DELAY = 3000; // delay in milliseconds (3 seconds)

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    const now = Date.now();
    if (now - lastFetchTime < FETCH_DELAY) {
      // If last fetch was within delay period, reject
      return rejectWithValue('Please wait before fetching again.');
    }

    lastFetchTime = now; // update last fetch time
    try {
      const response = await apiGet('categories');
      console.log(response);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Something went wrong');
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default categorySlice.reducer;
