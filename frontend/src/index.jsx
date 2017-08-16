import React from 'react';
import ReactDOM from 'react-dom';
import { geolocated } from 'react-geolocated';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (geolocate, coords) => {
  try {
    const response = await fetch((!geolocate || !coords)
      ? `${baseURL}/weather/`
      : `${baseURL}/weather/${coords[0]}/${coords[1]}`);
    return response.json();
  } catch (error) {
    // Return an empty json object
    return {};
    // console.error(error);
  }
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      targetCity: '',
      iconCurrent: '',
      timeCurrent: '',
      iconForecast: '',
      timeForecast: '',
      forecastIndex: 1,
      forecastCount: 0,
      coords: [0, 0],    // [latitude, longitude]
      geolocationInUse: false,
    };

    // These bindings are necessary to make `this` work in the callback
    this.handleClickPrev = this.handleClickPrev.bind(this);
    this.handleClickNext = this.handleClickNext.bind(this);
    this.updateForecast = this.updateForecast.bind(this);
  }

  // is called before the render method is executed for the first time
  async componentWillMount() {
    this.updateForecast();
  }

  async componentDidMount() {
    // checks if there is geolocation used in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({ coords: [position.coords.latitude, position.coords.longitude],
            geolocationInUse: true });
          this.updateForecast();
        });
    } else {
       // console.log("No geolocation");
    }
  }


  async updateForecast() {
    const data = await getWeatherFromApi(this.state.geolocationInUse, this.state.coords);
    if (!this.state.geolocationInUse) {
      this.setState({ targetCity: data[0] });
    } else {
      this.setState({ targetCity: `φ: ${parseFloat(Math.round(data[0].latitude * 100) / 100).toFixed(2)}, ` +
        `λ: ${parseFloat(Math.round(data[0].longitude * 100) / 100).toFixed(2)}` });
    }
    this.setState({ iconCurrent: data[1][0].weather[0].icon.slice(0, -1),
      timeCurrent: data[1][0].dt_txt.slice(0, -3),
      iconForecast: data[1][this.state.forecastIndex].weather[0].icon.slice(0, -1),
      timeForecast: data[1][this.state.forecastIndex].dt_txt.slice(0, -3),
      forecastCount: (data[1].length - 1) });
  }

  handleClickPrev() {
    if (this.state.forecastIndex > 1) {
      this.setState(prevState => ({
        forecastIndex: prevState.forecastIndex - 1,
      }));
    }
    this.updateForecast();
  }

  handleClickNext() {
    if (this.state.forecastIndex < this.state.forecastCount) {
      this.setState(prevState => ({
        forecastIndex: prevState.forecastIndex + 1,
      }));
    }
    this.updateForecast();
  }


  render() {
    const { targetCity,
            iconCurrent,
            timeCurrent,
            iconForecast,
            timeForecast,
            forecastIndex } = this.state;

    const hours = forecastIndex * 3;

    return (
      <div className="icon">
        { targetCity && <h1>{targetCity}</h1> }
        { iconCurrent && <img src={`/img/${iconCurrent}.svg`} alt="" /> }
        { timeCurrent && <h2>Current {timeCurrent}</h2> }
        { iconForecast && <img src={`/img/${iconForecast}.svg`} alt="" /> }
        { timeForecast && <h2>Forecast {timeForecast} (+{hours} h)</h2> }
        <button onClick={this.handleClickPrev}>
          Prev
        </button>
        <button onClick={this.handleClickNext}>
          Next
        </button>
      </div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Weather);

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
