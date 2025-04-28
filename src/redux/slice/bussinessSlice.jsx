import { apiGet } from "@/lib/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBusinesses = createAsyncThunk("businesses/fetchBusinesses",
async ({categoryslug,subcategoryslug}) => {
  let url = "/businesses?isVerified=false&limit=40";

  if (categoryslug) {
    url += `&categoryslug=${categoryslug}`;
  }


  if (subcategoryslug) {
    url += `&subcategoryslug=${subcategoryslug}`;
  }
  const response = await apiGet(url);
  return response;
    }
  );


const businessesSlice = createSlice({
  name: "businesses",
  initialState: {
    businesses: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
        state.error = "";
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default businessesSlice.reducer;
