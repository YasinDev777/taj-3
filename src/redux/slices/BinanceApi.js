import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchKlines = createAsyncThunk(
    "klines/fetchKlines",
    async (symbol,   { rejectWithValue }) => {
        const API_URL = `https://api.binance.com/api/v3/klines`;
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        const oneDayAndFiveHoursInMilliseconds = (1 * 24 * 60 * 60 * 1000) + (5 * 60 * 60 * 1000);
        const newDate = new Date(currentDate.getTime() - sevenDaysInMilliseconds + oneDayAndFiveHoursInMilliseconds);
        const getTime = newDate.getTime();
        try {
            const response = await axios.get(API_URL, {
                params: {
                    symbol: symbol,
                    interval: "1d",
                    limit: 1000,
                },
            });

            if (response.data) {
                const formattedData = response.data.map((item) => ({
                    time: item[0] / 1000,
                    close: parseFloat(item[4]),
                }));

                const lastClosePrice =
                    formattedData.length > 0
                        ? formattedData[formattedData.length - 1].close
                        : "";

                return {
                    symbol,
                    data: response.data,
                    lastClosePrice,
                    active_card:
                        formattedData.length > 7 &&
                        formattedData[formattedData.length - 7].time === getTime / 1000
                            ? true
                            : false,
                };
            }
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);
const klinesSlice = createSlice({
    name: "klines",
    initialState: {
        data: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchKlines.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchKlines.fulfilled, (state, action) => {
                state.loading = false;
                state.data[action.payload.symbol] = action.payload;
            })
            .addCase(fetchKlines.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default klinesSlice.reducer;
