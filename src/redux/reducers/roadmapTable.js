import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRoadmapTable } from "../../services/RoadMapData";

// Asinxron ma’lumot olish funksiyasi
export const fetchRoadmapTable = createAsyncThunk(
  "roadmap/fetchRoadmapTable",
  async (_, { getState }) => {
    const { roadmapTable } = getState();
    if (roadmapTable.data.length > 0) return roadmapTable.data; // Agar ma’lumot allaqachon yuklangan bo‘lsa, qaytmaydi

    const data = await getRoadmapTable(); // Firebase’dan ma’lumotni olib keladi
    
    return data;
  }
);

const roadmapTableSlice = createSlice({
  name: "roadmapTable",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoadmapTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoadmapTable.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRoadmapTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default roadmapTableSlice.reducer;
