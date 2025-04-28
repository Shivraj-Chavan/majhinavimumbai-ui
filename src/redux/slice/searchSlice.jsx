import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiGet } from "@/lib/apiClient";

export const fetchAllSuggestions = createAsyncThunk("search/fetchAllSuggestions",
    async (_, { rejectWithValue }) => {
      try {
        const response = await apiGet("/categories"); 
        console.log("Fetched all categories/services: ", response);

        let allServices = [];
  
        response.forEach(category => {
          if (category.subcategories) {
            category.subcategories.forEach(subcat => {
              allServices.push({
                name: subcat.name,
                slug: subcat.slug,
                category: category.slug, 
              });
            });
          }
        });
  
        return allServices;
      } catch (error) {
        console.error("Error fetching all services:", error);
        return rejectWithValue(error.message || "Error fetching services");
      }
    }
  );
  
  const searchSlice = createSlice({
    name: "search",
    initialState: {
      query: "",
      allSuggestions: [], 
      filteredSuggestions: [],
      loading: false,
      error: null,
    },
    reducers: {
      setQuery(state, action) {
        state.query = action.payload;
  
        // filter locally
        state.filteredSuggestions = state.allSuggestions.filter(service =>
          service.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      },
      clearSuggestions(state) {
        state.filteredSuggestions = [];
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllSuggestions.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllSuggestions.fulfilled, (state, action) => {
          state.loading = false;
          state.allSuggestions = action.payload;
          state.filteredSuggestions = []; 
          state.error = "";
        })
        .addCase(fetchAllSuggestions.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { setQuery, clearSuggestions } = searchSlice.actions;
  export default searchSlice.reducer;