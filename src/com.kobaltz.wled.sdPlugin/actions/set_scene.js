const setSceneAction = new Action('com.kobaltz.wled.setscene');

setSceneAction.onKeyUp(({ action, context, device, event, payload }) => {
  let wled_paylod = {
    "on": true,
    "seg": {
      "fx": payload.settings.effect,
      "pal": payload.settings.palette
    }
  }
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wled_paylod)
  }).then(response => response.json())
    .then(data => {
      updateImage(data, payload)
    }
  )
})

setSceneAction.onDialRotate(({ action, context, device, event, payload }) => {
})