import React from "react";
import CityForecastContainer from "./CityForecastContainer";

class CityPageContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      isUserCity: false,
      title: "",
      parent: "",
      woeId: null,
      dbId: null,
      forecast: [],
      allJson: null,
      loaded: false
    };
  }

  componentDidMount() {
    fetch(`http://localhost:3000/convert-woe-plus-parent`, {
      method: "POST",
      body: JSON.stringify({
        woeId: this.props.woeId
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(r => r.json())
      .then(json => {
        console.log("json from API:", json);
        let fiveDayForecast = json.consolidated_weather.slice(0, 5);
        this.setState({
          title: json.title,
          parent: json.parent.title,
          woeId: json.woeid,
          dbId: json.db_id,
          forecast: fiveDayForecast,
          allJson: json
        });
      })
      .then(() => this.setState({ loaded: true }))
      .then(() => this.userCityCheck());
  }

  userCityCheck = () => {
    console.log("state", this.state);
    console.log("currentUser", this.props.currentUser);
    if (this.props.currentUser.id) {
      this.props.currentUser.cities.forEach(city => {
        if (city.woe_id === this.state.woeId) {
          this.setState({
            isUserCity: true
          });
        }
      });
    }
  };

  addCity = () => {
    let city = {
      title: this.state.title,
      parent: this.state.parent,
      woeId: this.state.woeId,
      dbId: this.state.dbId
    };
    this.props.addMyCityHandler(city);
  };

  removeCity = () => {
    let city = {
      title: this.state.title,
      parent: this.state.parent,
      woeId: this.state.woeId,
      dbId: this.state.dbId
    };
    this.props.removeMyCityHandler(city);
  };

  render() {
    return (
      <div>
        {this.state.loaded ? (
          <div>
            <CityForecastContainer
              cityName={`${this.state.title}, ${this.state.parent}`}
              weatherData={this.state.forecast}
              loggedIn={this.props.loggedIn}
              isUserCity={this.state.isUserCity}
              removeCity={this.removeCity}
              addCity={this.addCity}
            />

            {this.state.loaded ? (
              <div className="ui segment">
                Current Time:{" "}
                {`${this.state.allJson.time} (${
                  this.state.allJson.timezone_name
                })`}
                <br />
                Sunrise: {this.state.allJson.sun_rise}
                <br />
                Sunset: {this.state.allJson.sun_set}
              </div>
            ) : null}
          </div>
        ) : (
          <div style={{ paddingTop: "100px" }}>
            <div className="ui inverted active centered inline loader" />
          </div>
        )}
      </div>
    );
  }
}

export default CityPageContainer;
