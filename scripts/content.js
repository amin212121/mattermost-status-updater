chrome.runtime.sendMessage({
  state: 'googleMeetStarted',
})

window.addEventListener('beforeunload', function (e) {
  chrome.runtime.sendMessage({
    state: 'googleMeetFinished',
  })
})
