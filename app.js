function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length !== 2)
    return new Error({ error: "getCookie function length is not 2" });
  return parts.pop();
}

function deleteCookie(name) {}

function hasCookie(name) {
  const cookie = document.cookie;
  return cookie.includes("accessToken");
}

function isAccessTokenExpired(accessToken) {
  return fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  )
    .then(res => res.json())
    .then(data => (data.error === "invalid_token" ? true : false))
    .catch(error => {
      throw error;
    });
}

function refreshAccessToken(accessToken) {
  fetch(`https://accounts.google.com/o/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=refresh_token&refresh_token=${accessToken}&client_id=468852174650-ggnokgn4bn6hlu4vdurhvldr1icqdar0.apps.googleusercontent.com&client_secret=dAeHf3Ph1TP7QpUEElbKi2C2`
  })
    .then(res => res.json())
    .then(data => {
      // new accessToken
      const newAccessToken = data.access_token;
      const date = new Date();
      const tomorrow = date.setDate(date.getDate() + 1);
      // save accessToken in cookie
      document.cookie = `accessToken=${newAccessToken}; expires=${new Date(
        tomorrow
      ).toUTCString()};`;
    })
    .catch(error => {
      throw error;
    });
}

function list(broadcastStatus) {
  const apiKey = "AIzaSyAwjwbrnOy6vPu-nju-ogaeb37xtxRy0r0";
  const accessToken = getCookie("accessToken");
  fetch(
    `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2CcontentDetails%2Cstatus&broadcastStatus=${broadcastStatus}&broadcastType=all&key=${apiKey}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => {
      throw error;
    });
}

function create() {
  console.log("create");
}

// Check accessToken is exist in stroage cookie ?
const isHas = hasCookie("accessToken");
if (!isHas) {
  window.location.pathname = "/login.html";
} else {
  const accessToken = getCookie("accessToken");
  isAccessTokenExpired(accessToken)
    .then(isExpired => {
      if (isExpired) refreshAccessToken(accessToken);
    })
    .catch(error => console.error(error));
}
