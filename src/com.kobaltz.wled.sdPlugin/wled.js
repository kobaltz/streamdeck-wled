/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const togglePowerAction = new Action('com.kobaltz.wled.togglepower');

$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {});

togglePowerAction.onKeyUp(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "on": 't',
      "v": true
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
});

togglePowerAction.onDialRotate(({ action, context, device, event, payload }) => {
  const value = 0;
  fetch(`http://${payload.settings.ip_address}/json/state`)
  .then(response => response.json())
  .then(data => {
    let value = Math.min(data.bri + (payload.ticks * 5), 255);
    fetch(`http://${payload.settings.ip_address}/json/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "bri": value
      })

    })
    .then(response => response.json())
    .then(data => {
      $SD.setFeedback(context, {
        'value': Math.round((value / 255) * 100),
      })
    })
  })
});

togglePowerAction.onDialPress(({ action, context, device, event, payload }) => {
  if (payload.pressed === false) {
    fetch(`http://${payload.settings.ip_address}/json/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "on": 't',
        "v": true
      })
    })
    .then(response => response.json())
    .then(data => console.log(data))
  }
});

togglePowerAction.onTouchTap(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "on": 't',
      "v": true
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  console.log(device)
});

togglePowerAction.onWillAppear(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`)
  .then(response => response.json())
  .then(data => {
    $SD.setFeedback(context, {
      'value': Math.round((data.bri / 255) * 100),
    })
  })
});


const setSceneAction = new Action('com.kobaltz.wled.setscene');

setSceneAction.onKeyUp(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "on": true,
      "seg": {
        "fx": payload.settings.effect
      }
    })
  })
});

setSceneAction.onDialRotate(({ action, context, device, event, payload }) => {
});


