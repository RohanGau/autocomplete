import React, { useCallback, useState } from "react";

const AutoCompleteSearch = () => {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState("");

  const query = useCallback((text) => {
    console.log("Fetching query:", text);
    setResult(text);
  }, []);

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      const context = this;
      clearInterval(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  }

  const debounceQuery = debounce(query, 1000);

  const handleChange = (e) => {
    const value = e.target.value;
    debounceQuery(value);
    setSearchText(value);
  };

  return (
    <div>
      <input value={searchText} onChange={handleChange} />
      <div>search text: {searchText}</div>
      <div>result: {result}</div>
    </div>
  );
};

export default AutoCompleteSearch;
