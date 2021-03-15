// react modules
import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';

// components
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';

import {sortData, prettyPrintStat} from './components/util';

// css
import './App.css';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [countries, setCountries] = useState(['USA', 'UK', 'India']);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState([34.80746,-40.4796]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  // fetch table data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom
            value: country.countryInfo.iso2, // UK, USA, FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
        //! worldwide error comes from here
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]); //center the map to the selected country <<<<<
        setMapZoom(4);
      });
  };

  //console.log('COUNTRY INFO >>>', countryInfo);

  /* Header */
  /* Title + Select input dropdown field */

  return (
    <div className="app">
      <section className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              {/* Loop through all the countries and return a dropdown list of all the options */}

              {/* Worldwide */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* All the other countries */}
              {countries.map((country) => (
                <MenuItem value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Info Boxes */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        {/* Map */}
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </section>

      {/* Table and graph */}
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          {/*Line Graph */}
          <h3 className="app__graphTitle">
            Worldwide new {casesType}
          </h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  ); // BEM naming convention
};

export default App;
