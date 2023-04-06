const togglePowerAction = new Action('com.kobaltz.wled.togglepower')
const contextsByIpAddress = new Map()

updateImage = (data,payload) => {
  const image = data.on ? "images/power-on.png" : "images/power-off.png"
  const imageDial = data.on ? "images/power-on-transparent.png" : "images/power-off-transparent.png"
  const title = data.on ? "On" : "Off"
  const ipAddress = payload.settings.ip_address
  if (contextsByIpAddress.has(ipAddress)) {
    const contexts = contextsByIpAddress.get(ipAddress)
    const progress = Math.round((data.bri / 255) * 100)
    contexts.forEach((buttonContext) => {
      $SD.setImage(buttonContext, image, title)
      $SD.setFeedback(buttonContext, {
        "icon": imageDial,
        'value': progress,
        "indicator": { "value": progress, "enabled": data.on }
      })
    })
  }
}

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
    .then(data => { updateImage(data,payload) })
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
          "v": true,
          "bri": value
        })

      })
        .then(response => response.json())
        .then(data => {
          const progress = Math.round((value / 255) * 100)
          $SD.setFeedback(context, {
            'value': progress,
            "indicator": { "value": progress, "enabled": true }
          })
          updateImage(data, payload)
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
      .then(response => response.json())
      .then(data => { updateImage(data, payload) })
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
  .then(response => response.json())
  .then(data => { updateImage(data, payload) })
})

togglePowerAction.onWillAppear(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`)
    .then(response => response.json())
    .then(data => {
      const ipAddress = payload.settings.ip_address
      if (!contextsByIpAddress.has(ipAddress)) { contextsByIpAddress.set(ipAddress, new Set())}
      contextsByIpAddress.get(ipAddress).add(context)

      updateImage(data, payload)
    })
})

togglePowerAction.onWillDisappear(({ action, context, device, event, payload }) => {
  const ipAddress = payload.settings.ip_address
  if (contextsByIpAddress.has(ipAddress)) {
    const contexts = contextsByIpAddress.get(ipAddress)
    contexts.delete(context)
    if (contexts.size === 0) {
      contextsByIpAddress.delete(ipAddress)
    }
  }
})