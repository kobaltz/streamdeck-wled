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
  const stepValue = payload.settings.step_value || 1;  // default to 1 if step_value is not provided
  fetch(`http://${payload.settings.ip_address}/json/state`)
    .then(response => response.json())
    .then(data => {
      // Convert the brightness value from 0-255 scale to 0-100 scale
      let currentBrightnessPercentage = Math.round((data.bri / 255) * 100);
      
      // Determine the minimum brightness percentage based on the stepValue
      const minBrightnessPercentage = stepValue;
      
      // Calculate the new brightness value based on the stepValue
      let newBrightnessPercentage = Math.min(Math.max(currentBrightnessPercentage + (payload.ticks * stepValue), minBrightnessPercentage), 100);
      
      // Convert the new brightness value back to 0-255 scale
      let value = Math.round((newBrightnessPercentage / 100) * 255);
      
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
          $SD.setFeedback(context, {
            'value': newBrightnessPercentage,
            "indicator": { "value": newBrightnessPercentage, "enabled": true }
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
