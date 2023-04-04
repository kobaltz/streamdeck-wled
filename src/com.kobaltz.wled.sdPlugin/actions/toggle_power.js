const togglePowerAction = new Action('com.kobaltz.wled.togglepower')
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
})

togglePowerAction.onDialRotate(({ action, context, device, event, payload }) => {
  const value = 0
  fetch(`http://${payload.settings.ip_address}/json/state`)
    .then(response => response.json())
    .then(data => {
      let value = Math.min(data.bri + (payload.ticks * 5), 255)
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
})

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
  }
})

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
})

togglePowerAction.onWillAppear(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`)
    .then(response => response.json())
    .then(data => {
      $SD.setFeedback(context, {
        'value': Math.round((data.bri / 255) * 100),
      })
    })
})