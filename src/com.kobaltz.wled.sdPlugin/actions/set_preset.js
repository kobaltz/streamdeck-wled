const setPresetAction = new Action('com.kobaltz.wled.setpreset');

setPresetAction.onKeyUp(({ action, context, device, event, payload }) => {
  let wled_paylod = {
    "on": true,
    "v": true,
    "ps": payload.settings.preset
  }
  fetch(`http://${payload.settings.ip_address}/json/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wled_paylod)
  }).then(response => response.json())
    .then(data => {
      updateImage(data, payload)
    })
})
