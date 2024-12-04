const Navbar = ({
  setSelectedPreset,
  setSelectedTicker,
  setSelectedDesc,
  setSelectedSignal,
  selectedPreset,
  selectedTicker,
  selectedDesc,
  selectedSignal,
  inputValue,
  setInputValue,
  isGrid,
  setIsGrid
}) => {
  const handlePresetChange = (event) => {
    setSelectedPreset(event.target.value);
  };

  const handleTickerChange = (event) => {
    setSelectedTicker(event.target.value);
  };
  const handleDescChange = (event) => {
    setSelectedDesc(event.target.value);
  };
  const handleSignalChange = (event) => {
    setSelectedSignal(event.target.value);
  };
  const handleSearch = (event) => {
    setInputValue(event.target.value);
  };

  const handleGrid = (event) =>{
    setIsGrid(event.target.value)
  }

  return (
    <nav>
      <div className="options-div">
        <div>
          <select value={selectedPreset} onChange={handlePresetChange}>
            <option value="My Presets">My Presets</option>
            <option value="Save Screen">Save Screen</option>
            <option value="Edit screens">Edit Screens</option>
          </select>
        </div>
        <div>
          <span>Order by</span>
          <div>
          <select className="order" value={selectedTicker} onChange={handleTickerChange}>
            <option value="Ticker">Ticker</option>
            <option value="Tickers input filter">Tickers input filter</option>
            <option value="Price/Earnings">Price/Earnings</option>
            <option value="Company">Company</option>
            <option value="Sector">Sector</option>
            <option value="Industry">Industry</option>
          </select>
          </div>
          <select className="descs" value={selectedDesc} onChange={handleDescChange}>
            <option value="Desc">Desc</option>
            <option value="Asc">Asc</option>
          </select>
        </div>
        <div>
          <span>Signal</span>
          <select value={selectedSignal} onChange={handleSignalChange}>
            <option value="None (all stocks)">None (all stocks)</option>
            <option value="Top gainers">Top gainers</option>
            <option value="Top losers">Top losers</option>
            <option value="New Hight">New Hight</option>
            <option value="New Low">New Low</option>
          </select>
        </div>
        <div>
          <span>Tickers</span>
          <input type="text" onInput={handleSearch} placeholder="Search" />
        </div>
        <div>
          <span>Per Page pagination</span>
          <select onChange={handleGrid} value={isGrid}>
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;