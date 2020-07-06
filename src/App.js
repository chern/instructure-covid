import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

import '@instructure/canvas-theme';
import { Heading } from '@instructure/ui-elements';
import { RadioInput, RadioInputGroup } from '@instructure/ui-radio-input';
import { View } from '@instructure/ui-view';
import { Grid } from '@instructure/ui-grid';
import { Table } from '@instructure/ui-table';
import { Flex } from '@instructure/ui-flex';
import { Spinner } from '@instructure/ui-spinner';

import AppNavExample from './components/Navbar';

const API_ENDPOINT_GLOBALDATA = 'https://api.covid19api.com/summary';
const API_ENDPOINT_COUNTRYDATA = 'https://api.covid19api.com/dayone/country/';

const country_inputs = [
  { value: 'united-states', label: 'United States' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'italy', label: 'Italy' },
];

const DEFAULT_COUNTRY = country_inputs[1].value;

const countryDataReducer = (state, action) => {
  switch(action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
      };
    case 'DATA_FETCH_SUCCESS':
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    default:
      break;
  }
};

const globalDataReducer = (state, action) => {
  switch(action.type) {
    case 'DATA_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
      };
    case 'DATA_FETCH_SUCCESS':
      // console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    default:
      break;
  }
};

function App() {
  const [selectedCountry, setSelectedCountry] = React.useState(DEFAULT_COUNTRY);
  const [countryData, dispatchCountryData] = React.useReducer(
    countryDataReducer,
    { data: [], isLoading: false, }
  );
  const [globalData, dispatchGlobalData] = React.useReducer(
    globalDataReducer,
    { data: [], isLoading: false, }
  );

  const handleCountryChange = function (event, value) {
    console.log(`selectedCountry: ${value}`);
    setSelectedCountry(value);
    // event.preventDefault();
  };

  const handleFetchCountryData = React.useCallback(async () => {
    console.log(`handleFetchCountryData: ${selectedCountry}`);
    dispatchCountryData({ type: 'DATA_FETCH_INIT' });

    try {
      const result = await axios.get(`${API_ENDPOINT_COUNTRYDATA}${selectedCountry}`);
      console.log(result.data);

      dispatchCountryData({
        type: 'DATA_FETCH_SUCCESS',
        payload: result.data,
      });
    } catch {
      // throw new Error();
    }
  }, [selectedCountry]);

  React.useEffect(() => {
    handleFetchCountryData();
  }, [handleFetchCountryData]);

  const handleFetchGlobalData = React.useCallback(async () => {
    dispatchGlobalData({ type: 'DATA_FETCH_INIT' });

    try {
      const result = await axios.get(`${API_ENDPOINT_GLOBALDATA}`);
      console.log(result.data);

      dispatchGlobalData({
        type: 'DATA_FETCH_SUCCESS',
        payload: result.data.Countries,
      });
    } catch {
      // throw new Error();
    }
  }, []);

  React.useEffect(() => {
    handleFetchGlobalData();
  }, [handleFetchGlobalData]);

  return (
    <>
      <AppNavExample />
      {/* <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div> */}

      <View
        as="div"
        margin="small"
        padding="large"
        textAlign="center"
        background="primary"
        shadow="resting"
      >
        <Heading>Data by Country</Heading>
        <br />
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <RadioInputCountry name="select-country" inputs={country_inputs} onCountryChange={handleCountryChange} />
            </Grid.Col>
            <Grid.Col>
              {countryData.isLoading ? (
                <Spinner renderTitle="Loading" size="small" margin="0 0 0 medium" />
              ) : (
                <CovidCountryTable name="country-table" data={countryData.data} />
              )}
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </View>

      <View
        as="div"
        margin="small"
        padding="large"
        textAlign="center"
        background="primary"
        shadow="resting"
      >
        <Heading>Global Data</Heading>
        <br/>
        <displayStats />
        {/* <CovidTable entries={globalDataPromise.data.Countries} /> */}
        {globalData.isLoading ? (
          <Spinner renderTitle="Loading" size="small" margin="0 0 0 medium" />
        ) : (
          <CovidGlobalTable name="global-table" data={globalData.data} />
        )}
      </View>
    </>
  );
}

function RadioInputCountry({ name, inputs, onCountryChange }) {
  const handleChange = function (event, value) {
    console.log(value);
  };

  return (
    <Flex alignItems="start">
      <Flex.Item margin="small">
        <RadioInputGroup
          onChange={onCountryChange}
          name={name}
          defaultValue={DEFAULT_COUNTRY}
          description="Select a country"
        >
          {inputs.map(input => (
            <RadioInput key={input.value} value={input.value} label={input.label} />
          ))}
        </RadioInputGroup>
      </Flex.Item>
    </Flex>
  );
}

function CovidCountryTable({ name, data }) {
  console.log(data);

  // data.map(entry => {
  //   console.log(entry.Date)
  // })

  return (
    <div>
      <Table id={name} caption="Data by country" layout="auto">
        <Table.Head>
          <Table.Row>
            <Table.ColHeader id="date">Date</Table.ColHeader>
            <Table.ColHeader id="confirmed-cases">Confirmed Cases</Table.ColHeader>
            <Table.ColHeader id="deaths">Deaths</Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {/* <Table.Row>
            <Table.RowHeader>2020-07-02</Table.RowHeader>
            <Table.Cell>42123</Table.Cell>
            <Table.Cell>210</Table.Cell>
          </Table.Row> */}
          {data.map(entry => (
            <Table.Row key={entry.Date}>
              <Table.RowHeader>{entry.Date}</Table.RowHeader>
              <Table.Cell>{entry.Confirmed}</Table.Cell>
              <Table.Cell>{entry.Deaths}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

function CovidGlobalTable({ name, data }) {
  console.log(data);

  // data.map(entry => {
  //   console.log(entry.Date)
  // })

  return (
    <div>
      <Table id={name} caption="Data by country" layout="auto">
        <Table.Head>
          <Table.Row>
            <Table.ColHeader id="country">Country</Table.ColHeader>
            <Table.ColHeader id="new-cases">New Cases</Table.ColHeader>
            <Table.ColHeader id="total-cases">Total Cases</Table.ColHeader>
            <Table.ColHeader id="new-deaths">New Deaths</Table.ColHeader>
            <Table.ColHeader id="total-deaths">Total Deaths</Table.ColHeader>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.map(entry => (
            <Table.Row>
              <Table.RowHeader>{entry.Country}</Table.RowHeader>
              <Table.Cell>{entry.NewConfirmed}</Table.Cell>
              <Table.Cell>{entry.TotalConfirmed}</Table.Cell>
              <Table.Cell>{entry.NewDeaths}</Table.Cell>
              <Table.Cell>{entry.TotalDeaths}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

class CovidTable extends React.Component {
  state = {
    layout: 'auto',
    hover: false,
  };

  constructor ({ data, props }) {
    super(props)

    this.entries = data;
  }

  handleChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  renderOptions() {
    const { layout, hover } = this.state;

    return (
      <Flex alignItems="start">
        <Flex.Item margin="small">
          <RadioInputGroup
            name="layout"
            description="layout"
            value={layout}
            onChange={(e, value) => this.handleChange('layout', value)}
          >
            <RadioInput label="auto" value="auto" />
            <RadioInput label="fixed" value="fixed" />
            <RadioInput label="stacked" value="stacked" />
          </RadioInputGroup>
        </Flex.Item>
        {/* <Flex.Item margin="small">
          <Checkbox
            label="hover"
            checked={hover}
            onChange={(e, value) => this.handleChange('hover', !hover)}
          />
        </Flex.Item> */}
      </Flex>
    );
  }

  render() {
    const { layout, hover } = this.state;

    return (
      <div>
        {this.renderOptions()}
        <Table caption="Data by country" layout={layout} hover={hover}>
          <Table.Head>
            <Table.Row>
              <Table.ColHeader id="country">Country</Table.ColHeader>
              <Table.ColHeader id="new-cases">New Cases</Table.ColHeader>
              <Table.ColHeader id="total-cases">Total Cases</Table.ColHeader>
              <Table.ColHeader id="new-deaths">New Deaths</Table.ColHeader>
              <Table.ColHeader id="total-deaths">Total Deaths</Table.ColHeader>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <CovidTableRows entries={this.entries} />
            {/* <Table.Row>
              <Table.RowHeader>1</Table.RowHeader>
              <Table.Cell>The Shawshank Redemption</Table.Cell>
              <Table.Cell>1994</Table.Cell>
              <Table.Cell>9.3</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeader>2</Table.RowHeader>
              <Table.Cell>The Godfather</Table.Cell>
              <Table.Cell>1972</Table.Cell>
              <Table.Cell>9.2</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.RowHeader>3</Table.RowHeader>
              <Table.Cell>The Godfather: Part II</Table.Cell>
              <Table.Cell>1974</Table.Cell>
              <Table.Cell>9.0</Table.Cell>
            </Table.Row> */}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

// Column Headers: Country, New Cases, Total Cases, New Deaths, Total Deaths
const CovidTableRows = ({entries}) =>
  entries.map(entry =>
    <Table.Row>
      <Table.RowHeader>{entry.Country}</Table.RowHeader>
      <Table.Cell>{entry.NewConfirmed}</Table.Cell>
      <Table.Cell>{entry.TotalConfirmed}</Table.Cell>
      <Table.Cell>{entry.NewDeaths}</Table.Cell>
      <Table.Cell>{entry.TotalDeaths}</Table.Cell>
    </Table.Row>
);

export default App;
