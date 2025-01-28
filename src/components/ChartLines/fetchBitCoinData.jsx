// xozirchalik ishlamaydi.

const fetchBitCoinData = ({analysisSymbols , timeFrameIdState , setCandlestickData}) => {
    const fetchBitCoinData = async () => {
        try {
          const response = await axios.get('https://api.binance.com/api/v3/klines', {
            params: {
              symbol: analysisSymbols,
              interval: timeFrameIdState,
              limit: 1000,
            },
          });
          if (response.data) {
            const formattedData = response.data.map((item) => ({
              time: item[0] / 1000,
              open: parseFloat(item[1]),
              high: parseFloat(item[2]),
              low: parseFloat(item[3]),
              close: parseFloat(item[4]),
            }));
  
            if (formattedData.length > 0) {
              const lastDataPointTime = formattedData[formattedData.length - 1].time;
              const extendedData = [...formattedData];
              let currentTime = lastDataPointTime;
  
              let endDate = new Date(new Date().setDate(new Date().getDate() + 100)).getTime() / 1000
              let time = ""
              if(timeFrameIdState === "1d") {
                time = 24 * 60 * 60
              } else if(timeFrameIdState === "4h") {
                endDate =  new Date(new Date().setDate(new Date().getDate() + 20)).getTime() / 1000
                time = 4 * 60 * 60
              } else {
                endDate =  new Date(new Date().setDate(new Date().getDate() + 3)).getTime() / 1000
                time = 60 * 60
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
  
              setCandlestickData(extendedData);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
  return fetchBitCoinData
}

export default fetchBitCoinData