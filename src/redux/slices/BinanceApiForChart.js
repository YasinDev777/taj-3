import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchBitCoinData = createAsyncThunk(
  "candlestick/fetchBitCoinData",
  async ({ analysisSymbols, timeFrameIdState }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://api.binance.com/api/v3/klines",
        {
          params: {
            symbol: analysisSymbols,
            interval: timeFrameIdState,
            limit: 1000,
          },
        }
      );
      if (response.data) {
        const formattedData = response.data.map((item) => ({
          time: item[0] / 1000,
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
        }));

        if (formattedData.length > 0) {
          const lastDataPointTime =
            formattedData[formattedData.length - 1].time;
          const extendedData = [...formattedData];
          let currentTime = lastDataPointTime;
          let endDate =new Date(new Date().setDate(new Date().getDate() + 100)).getTime() / 1000;
          let time = "";
          if (timeFrameIdState === "1d") {
            time = 24 * 60 * 60;
          } else if (timeFrameIdState === "4h") {
            endDate =new Date(new Date().setDate(new Date().getDate() + 20)).getTime() / 1000;
            time = 4 * 60 * 60;
          } else {
            endDate =new Date( new Date().setDate(new Date().getDate() + 3) ).getTime() / 1000;
            time = 60 * 60;
          }
          while (currentTime < endDate) {
            currentTime += time;
            extendedData.push({
              time: currentTime,
              open: NaN,
              high: NaN,
              low: NaN,
              close: NaN,
            });
          }

          return extendedData;
        }
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const candlestickSlice = createSlice({
  name: "candlestick",
  initialState: {
    main: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBitCoinData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBitCoinData.fulfilled, (state, action) => {
        state.loading = false;
        state.main = action.payload;
      })
      .addCase(fetchBitCoinData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default candlestickSlice.reducer;
