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
    }).then(response => response.json())
      .then(data => console.log(data))
  })
});

togglePowerAction.onDialRotate(({ action, context, device, event, payload }) => {
});

togglePowerAction.onWillAppear(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`)
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


