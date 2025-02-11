import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRoadmapItems } from "../../services/RoadMapData";

// Asinxron ma’lumot olish funksiyasi
export const fetchRoadmapItems = createAsyncThunk(
  "roadmap/fetchRoadmapItems",
  async (_, { getState }) => {
    const { roadmap } = getState();
    if (roadmap.data.length > 0) return roadmap.data; // Agar ma’lumot allaqachon yuklangan bo‘lsa, qaytmaydi

    const data = await getRoadmapItems(); // Firebase’dan ma’lumotni olib keladi
    return data;
  }
);

const roadmapSlice = createSlice({
  name: "roadmap",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmapItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoadmapItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoadmapItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roadmapSlice.reducer;
