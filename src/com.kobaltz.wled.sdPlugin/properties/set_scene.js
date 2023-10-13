/// <reference path="../libs/js/property-inspector.js" />
/// <reference path="../libs/js/utils.js" />

$PI.onConnected((jsn) => {
  const form = document.querySelector('#property-inspector')
  const { actionInfo, appInfo, connection, messageType, port, uuid } = jsn
  const { payload, context } = actionInfo
  const { settings } = payload

  Utils.setFormValue(settings, form)

  function fetchEffects(ipAddress) {
    fetch(`http://${ipAddress}/json/effects`)
      .then(response => response.json())
      .then(data => {
        const select = document.querySelector('select[name="effect"]')
        select.innerHTML = ''
        data.forEach((effect, index) => {
          const option = document.createElement('option')
          option.value = index
          option.innerHTML = effect
          select.appendChild(option)
        })
      })
      .then(() => {
        document.querySelector('select[name="effect"]').value = settings.effect
      })
  }

  function fetchPalettes(ipAddress) {
    fetch(`http://${ipAddress}/json/palettes`)
      .then(response => response.json())
      .then(data => {
        const select = document.querySelector('select[name="palette"]')
        select.innerHTML = ''
        data.forEach((palette, index) => {
          const option = document.createElement('option')
          option.value = index // Use the index as the value
          option.innerHTML = palette
          select.appendChild(option)
        })
      })
      .then(() => {
        document.querySelector('select[name="palette"]').value = settings.effect
      })
  }

  if (settings.ip_address) {
    fetchEffects(settings.ip_address)
    fetchPalettes(settings.ip_address)
  }

  document.querySelector('input[name="ip_address"]').addEventListener('change', function (event) {
    fetchEffects(event.target.value)
    fetchPalettes(event.target.value)
  })
  // Update the step_value setting when the dropdown selection changes
  document.querySelector('select[name="step_value"]').addEventListener('change', function (event) {
    const stepValue = event.target.value;
    const payload = { "event": "setSettings", "context": context, "payload": { "step_value": stepValue } };
    $SD.connection.sendJSON(payload);
  });
})
