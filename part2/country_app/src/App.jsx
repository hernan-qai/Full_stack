import { useState, useEffect } from 'react';
import axios from 'axios';

// Wearher info componet
const WeatherInfo = ({weatherData, loading, error}) => {
  if (loading) return <p>Loading weather....</p>;
  if (error) return <p>Error loading weather data: {error}</p>;
  if (!weatherData) return null;

  return (

    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
      <h3>Weather in {weatherData.capital}</h3>
      <p><strong>Temperature:</strong> {weatherData.temp} °C</p>
      <p><strong>COnditions:</strong> {weatherData.description}</p>
      <img
        src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
        alt={weatherData.description}
        style={{ width: '50px' }}
      />
    </div>
  );
};

// Country Detail Component (for single match or selected country)
const CountryDetail = ({ country, getWeather }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  
  useEffect(() => {
    if (country && country.capital?.[0]) {
      getWeather(country, setWeatherData, setWeatherLoading, setWeatherError);
    } 
  }, [country, getWeather]);

  const languages = Object.entries(country.languages || {}).map(([code, name]) => (
    <li key={code}>{name}</li>
  ));

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
      <p><strong>Area:</strong> {country.area} km²</p>
      <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
      <img src={country.flags.png} alt={`${country.name.common} flag`} style={{ width: '200px' }} />
      <h3>Languages:</h3>
      <ul>{languages}</ul>
      <WeatherInfo
        weatherData={weatherData}
        loading={weatherLoading}
        error={weatherError}
      />
    </div>
  );
};

// Country List Item Component (for multiple matches)
const CountryListItem = ({ country, onShow }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', display: 'flex', alignItems: 'center' }}>
      <h3 style={{ margin: 0, flexGrow: 1 }}>{country.name.common}</h3>
      <button onClick={() => onShow(country)}>Show</button>
    </div>
  );
};

// Results Component (handles display based on matches)
const Results = ({ countries, onShow, selectedCountry, getWeather }) => {
  if (selectedCountry) {
    return <CountryDetail country={selectedCountry} getWeather={getWeather}/>;
  } else if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <CountryListItem key={country.cca3} country={country} onShow={onShow} />
        ))}
      </div>
    );
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} getWeather={getWeather} />;
  } else {
    return <p>No matches found</p>;
  }
};

// App Component
const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null); // State for selected country

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async (country, setWeatherData, setWeatherLoading, setWeatherError) => {
    try {
      setWeatherLoading(true);
      setWeatherError(null);
      setWeatherData(null);
      const capital = country.capital?.[0];
      if (!capital) {
        throw new Error('No capital city found');
      }
      // Step 1: Geocode capital to get lat/lon (using country code for accuracy)
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${capital},${country.cca2}&limit=1&appid=${API_KEY}`
      );

      const { lat, lon } = geoResponse.data[0];

      // Step 2: Fetch current weather
       const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const weather = {
        capital: capital,
        temp: Math.round(weatherResponse.data.main.temp),
        description: weatherResponse.data.weather[0].description,
        icon: weatherResponse.data.weather[0].icon,
      };
      setWeatherData(weather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherError(error.response?.data?.message || error.message || 'Weather data unavailable');
    } finally {
      setWeatherLoading(false);
    }
  };

  // Fetch all countries on mount
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('Countries fetched:', response.data.length); // Debug log
        setCountries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        alert('Failed to fetch countries from API');
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setSelectedCountry(null); // Reset selected country on new search
  };

  const handleShowCountry = (country) => {
    console.log('Showing country:', country.name.common); // Debug log
    setSelectedCountry(country);
  };

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading countries carajo...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Country Search</h1>
      <div>
        Find countries: <input value={searchQuery} onChange={handleSearchChange} />
      </div>
      <Results
        countries={filteredCountries}
        onShow={handleShowCountry}
        selectedCountry={selectedCountry}
        getWeather={getWeather}
      />
      {/* Debugging: Display current search */}
      <div>Debug - Search query: "{searchQuery}" | Matches: {filteredCountries.length} | Selected: {selectedCountry ? selectedCountry.name.common : 'None'}</div>
    </div>
  );
};

export default App;