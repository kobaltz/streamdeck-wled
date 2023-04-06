const togglePowerAction = new Action('com.kobaltz.wled.togglepower')
const contextsByIpAddress = new Map()
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
    .then(data => {
      const image = data.on ? "images/power-on.png" : "images/power-off.png"
      const title = data.on ? "On" : "Off"
      const ipAddress = payload.settings.ip_address
      if (contextsByIpAddress.has(ipAddress)) {
        const contexts = contextsByIpAddress.get(ipAddress)
        contexts.forEach((buttonContext) => {
          $SD.setImage(buttonContext, image, title)
        })
      }
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
      .then(response => response.json())
      .then(data => {
        const image = data.on ? "images/power-on.png" : "images/power-off.png"
        const title = data.on ? "On" : "Off"
        const ipAddress = payload.settings.ip_address
        if (contextsByIpAddress.has(ipAddress)) {
          const contexts = contextsByIpAddress.get(ipAddress)
          contexts.forEach((buttonContext) => {
            $SD.setImage(buttonContext, image, title)
          })
        }
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
  }).then( () =>{
    const ipAddress = payload.settings.ip_address
    if (contextsByIpAddress.has(ipAddress)) {
      const contexts = contextsByIpAddress.get(ipAddress)
      contexts.forEach((buttonContext) => {
        $SD.setImage(buttonContext, "images/power-on.png", "On")
      })
    }
  })
})

togglePowerAction.onWillAppear(({ action, context, device, event, payload }) => {
  fetch(`http://${payload.settings.ip_address}/json/state`)
    .then(response => response.json())
    .then(data => {
      $SD.setFeedback(context, {
        'value': Math.round((data.bri / 255) * 100),
      })

      const ipAddress = payload.settings.ip_address
      if (!contextsByIpAddress.has(ipAddress)) { contextsByIpAddress.set(ipAddress, new Set())}
      contextsByIpAddress.get(ipAddress).add(context)

      const image = data.on ? "images/power-on.png" : "images/power-off.png"
      const title = data.on ? "On" : "Off"

      if (contextsByIpAddress.has(ipAddress)) {
        const contexts = contextsByIpAddress.get(ipAddress)
        contexts.forEach((buttonContext) => {
          $SD.setImage(buttonContext, image, title)
        })
      }
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