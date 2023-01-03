const request = require("request");

const geocode = (address, callback) => {
  const url =
    "http://api.positionstack.com/v1/forward?access_key=efe48814c9b0a934d7fcd850accb93a6&query=" +
    encodeURIComponent(address);
  request({ url }, (error, {body}={}) => {
    if (error) {
      callback("Unable to connect to location services", undefined);
    } else if (JSON.parse(body).data === undefined) {
      callback("Unable to find location. Try another search", undefined);
    } else if (JSON.parse(body).data.length === 0) {
      callback("Unable to find location. Try another search", undefined);
    } else {
      callback(undefined, {
        latitude: JSON.parse(body).data[0].latitude,
        longitude: JSON.parse(body).data[0].longitude,
        location: JSON.parse(body).data[0].label,
      });
    }
  });
};

module.exports = geocode;
