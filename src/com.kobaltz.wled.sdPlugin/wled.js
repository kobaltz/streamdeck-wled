/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const togglePowerAction = new Action('com.kobaltz.wled.togglepower');

$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
});

togglePowerAction.onKeyUp(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    body: JSON.stringify({
      "on": 't'
    })
  })
});

togglePowerAction.onDialRotate(({ action, context, device, event, payload }) => {
});


const setSceneAction = new Action('com.kobaltz.wled.setscene');

$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
});

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


