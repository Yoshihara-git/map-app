const getLocationButton = document.getElementById("getLocation");
const statusText = document.getElementById("status");
const initialLatitude = 35.681236;
const initialLongitude = 139.767125;

const map = L.map("map").setView([initialLatitude, initialLongitude], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "&copy; " +
    '<a href="https://www.openstreetmap.org/copyright">' +
    "OpenStreetMap</a> contributors",
}).addTo(map);

let marker = null;
let accuracyCircle = null;

getLocationButton.addEventListener("click", () => {
  // Geolocation APIが利用可能か確認
  if (!navigator.geolocation) {
    statusText.textContent = "位置情報を利用できません";
    return;
  }

  // 位置情報の取得開始
  statusText.textContent = "位置情報を取得しています...";
  getLocationButton.disabled = true;

  navigator.geolocation.getCurrentPosition(showPosition, showError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  });
});

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  document.getElementById("latitude").textContent = latitude.toFixed(6);

  document.getElementById("longitude").textContent = longitude.toFixed(6);

  document.getElementById("accuracy").textContent = Math.round(accuracy) + "m";

  map.setView([latitude, longitude], 16);

  // 既存のマーカーを削除
  if (marker !== null) {
    map.removeLayer(marker);
  }

  // 現在位置にマーカーを配置
  marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("現在位置")
    .openPopup();

  // 既存の精度表示を削除
  if (accuracyCircle !== null) {
    map.removeLayer(accuracyCircle);
  }

  // 位置情報の精度を円で表示
  accuracyCircle = L.circle([latitude, longitude], {
    radius: accuracy,
    color: "red",
    fillColor: "lightblue",
    fillOpacity: 0.3,
  }).addTo(map);

  statusText.textContent = "位置情報を取得しました";
  getLocationButton.disabled = false;
}

function showError(error) {
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "位置情報の利用が許可されませんでした";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "位置情報を取得できませんでした";
      break;
    case error.TIMEOUT:
      message = "位置情報の取得がタイムアウトしました";
      break;
    default:
      message = "不明なエラーが発生しました";
  }
  statusText.textContent = message;
  getLocationButton.disabled = false;
}
