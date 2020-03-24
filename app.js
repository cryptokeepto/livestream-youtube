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
  return cookie.includes(name) && getCookie(name) !== undefined;
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
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json"
      }
    }
  )
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => {
      throw error;
    });
}

function createStream() {
  const apiKey = "AIzaSyAwjwbrnOy6vPu-nju-ogaeb37xtxRy0r0";
  const title = document.getElementById("titleStream").value;
  const description = document.getElementById("descriptionStream").value;
  const resolution = document.getElementById("resolutionStream").value;
  const frameRate = document.getElementById("frameRateStream").value;

  const accessToken = getCookie("accessToken");
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/liveStreams?part=id%2Csnippet%2Ccdn%2CcontentDetails%2Cstatus&key=${apiKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          snippet: {
            title,
            description
          },
          cdn: {
            frameRate,
            ingestionType: "rtmp",
            resolution
          },
          contentDetails: {
            isReusable: true
          }
        })
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        return resolve("stream is created");
      })
      .catch(error => {
        return reject(error);
      });
  });
}

function createBroadcast() {
  const apiKey = "AIzaSyAwjwbrnOy6vPu-nju-ogaeb37xtxRy0r0";
  const title = document.getElementById("titleBroadcast").value;
  const description = document.getElementById("descriptionBroadcast").value;
  const scheduledStartTime =
    document.getElementById("scheduledStartTimeBroadcast").value + ":00Z";
  const scheduledEndTime =
    document.getElementById("scheduledEndTimeBroadcast").value + ":00Z";
  // const actualStartTime =
  //   document.getElementById("actualStartTime").value + ":00Z";
  // const actualEndTime = document.getElementById("actualEndTime").value + ":00Z";

  const privacyStatus = document.getElementById("privacyStatusBroadcast").value;
  const accessToken = getCookie("accessToken");
  return new Promise((resolve, reject) => {
    fetch(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts?part=id%2Csnippet%2CcontentDetails%2Cstatus&key=${apiKey}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          snippet: {
            title,
            description,
            scheduledStartTime: new Date(scheduledStartTime).toISOString(),
            scheduledEndTime: new Date(scheduledEndTime).toISOString()
            // actualStartTime: new Date(actualStartTime).toISOString(),
            // actualEndTime: new Date(actualEndTime).toISOString()
            // thumbnails: {
            //   default: {
            //     height: 0,
            //     url: "",
            //     width: 0
            //   },
            //   high: {
            //     height: 0,
            //     url: "",
            //     width: 0
            //   },
            //   medium: {
            //     height: 0,
            //     url: "",
            //     width: 0
            //   },
          },
          status: {
            privacyStatus
          }
        })
      }
    )
      .then(res => res.json())
      .then(data => {
        const { id } = data;
        const element = document.getElementById("videoLive");
        const h3 = document.createElement("h3");
        h3.innerText = "Learner";
        const iframe = document.createElement("iframe");
        iframe.setAttribute("width", "400");
        iframe.setAttribute("height", "345");
        iframe.setAttribute(
          "src",
          `https://www.youtube.com/embed/${id}?autoplay=1&livemonitor=1`
        );
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute(
          "allow",
          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        );
        iframe.setAttribute("allowfullscreen", "true");
        element.appendChild(h3);
        element.appendChild(iframe);
        return resolve("boradcast is created");
      })
      .catch(error => {
        return reject(error);
      });
  });
}

async function create() {
  try {
    // const boradcast = await createBroadcast();
    const stream = await createStream();
    console.log(boradcast);
  } catch (error) {
    throw new Error(error);
  }
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
