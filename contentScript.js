chrome.runtime.sendMessage({
  state: 'webhookOn',
})

window.addEventListener('beforeunload', function (e) {
  chrome.runtime.sendMessage({
    state: 'webhookOff',
  })
})
