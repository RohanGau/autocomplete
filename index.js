const CACHE_KEY = "search_cache";
const CACHE_DURATION = 60 * 60 * 1000;

var search_terms =  [
  { "type": "company", "text": "Microsoft" },
  { 
    "type": "organization", 
    "text": "Red Cross", 
    "subtitle": "Nonprofit organization, Washington, DC" 
  },
  { "type": "text", "text": "micro" },
  { "type": "text", "text": "microsoft office" },
  { "type": "text", "text": "microsoft teams" },
  { 
    "type": "television", 
    "text": "Mr. Robot", 
    "subtitle": "TV series" 
  },
  { 
    "type": "musician", 
    "text": "Metallica", 
    "subtitle": "Heavy metal band" 
  },
  { 
    "type": "television", 
    "text": "Mindhunter", 
    "subtitle": "TV series" 
  },
  { "type": "company", "text": "Amazon" },
  { 
    "type": "organization", 
    "text": "Amnesty International", 
    "subtitle": "Nonprofit organization, London, UK" 
  },
  { "type": "text", "text": "amazon prime" },
  { "type": "text", "text": "amazon web services" },
  { 
    "type": "television", 
    "text": "American Idol", 
    "subtitle": "TV program" 
  },
  { 
    "type": "musician", 
    "text": "Adele", 
    "subtitle": "Singer-songwriter" 
  },
  { 
    "type": "television", 
    "text": "America's Got Talent", 
    "subtitle": "TV series" 
  },
  { "type": "company", "text": "Tesla" },
  { 
    "type": "organization", 
    "text": "The Nature Conservancy", 
    "subtitle": "Environmental organization, Arlington, VA" 
  },
  { "type": "text", "text": "tesla model 3" },
  { "type": "text", "text": "tesla stock" },
  { 
    "type": "television", 
    "text": "The Mandalorian", 
    "subtitle": "TV series" 
  },
  { 
    "type": "musician", 
    "text": "Taylor Swift", 
    "subtitle": "Singer-songwriter" 
  },
  { 
    "type": "television", 
    "text": "The Office", 
    "subtitle": "TV series" 
  },
  { "type": "company", "text": "Netflix" },
  { 
    "type": "organization", 
    "text": "NPR", 
    "subtitle": "Public radio network, Washington, DC" 
  },
  { "type": "text", "text": "netflix series" },
  { "type": "text", "text": "netflix movies" },
  { 
    "type": "television", 
    "text": "Narcos", 
    "subtitle": "TV series" 
  },
  { 
    "type": "musician", 
    "text": "Nirvana", 
    "subtitle": "Rock band" 
  },
  { 
    "type": "television", 
    "text": "New Girl", 
    "subtitle": "TV series" 
  }
];

// get cache data
function getCacheData() {
  try {
    const cacheData = localStorage.getItem(CACHE_KEY);
    return cacheData ? JSON.parse(cacheData) : null;
  } catch(error) {
    console.error("Error getting cache data :", error);
    return null;
  }
}

// save cache data
function saveToCache(query, data) {
  try {
    const value = {
      timeStamp: Date.now(),
      data: data,
    }
    const foundDataMap = getCacheData();
    let dataMap = foundDataMap ? new Map(foundDataMap) : new Map();
    dataMap.set(query, value);
    localStorage.setItem(CACHE_KEY, JSON.stringify(Array.from(dataMap.entries())));
  } catch(error) {
    console.error("Error saving to cache :", error);
  }
}

// debounce function delay
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function searchResults(query) {
  return new Promise((resolve, reject) => {
    try {
      var regex = new RegExp(query, 'i');
      const foundDataMap = getCacheData(); // found data in local storage

      if(foundDataMap) {
        const dataMap = new Map(foundDataMap);
        const cacheData = dataMap.get(query);
        if(cacheData) {
          return resolve(cacheData.data);
        }
      }

      const filteredData = search_terms.filter((item) => {
        if(item.text.match(regex)) {
          return item;
        }
      });
      saveToCache(query, filteredData);
      setTimeout(() => {
        resolve(filteredData);
      }, 1000);
    } catch(error) {
      reject(error);
    }
  });
}

function handleClick(value) {
  document.getElementById("q").value= value;
  document.getElementById("result").style.display= "none";
}

async function showResults(query) {
  const res = document.getElementById("result");
  res.value = '';
  let list = '';
  let terms = await searchResults(query);
  console.log(terms);
  for(let i = 0; i < terms.length; i++) {
    list += '<li id="item-' + i + '" onClick="handleClick(\'' + terms[i].text + '\')" >' + terms[i].text + '</li>';
  }
  res.style.display = "block";
  res.innerHTML = '<ul>' + list + '</ul>';
}

const debounceShowResult = debounce(showResults, 500);

document.getElementById('q').addEventListener("keyup", function(event) {
  const query = event.target.value.trim();
  // const query = event.target.value.trim();
  if(query.length >= 0) {
    debounceShowResult(query);
    // debouncedSearch(query);
  }
})

export { showResults, handleClick }
