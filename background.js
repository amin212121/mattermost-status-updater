chrome.runtime.onInstalled.addListener(function (object) {
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html'),
  })
})

chrome.runtime.onMessage.addListener(async function (request) {
  chrome.storage.sync.get(
    {
      MMToken: '',
      MMUserId: '',
      MMAccessToken: '',
      userStatus: '',
      userStatusText: ''
    },
    function ({ MMAuthToken, MMUserId, MMAccessToken, userStatus, userStatusText }) {
      if (request.state === 'webhookOn') {
        fetch('https://chat.twntydigital.de/api/v4/users/me/status', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({ user_id: MMUserId, status: userStatus }),
          credentials: 'omit',
        })
        fetch('https://chat.twntydigital.de/api/v4/users/me/status/custom', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({ emoji: 'calendar', text: userStatusText }),
          credentials: 'omit',
        })
      }
      if (request.state === 'webhookOff') {
        fetch('https://chat.twntydigital.de/api/v4/users/me/status', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({ user_id: MMUserId, status: 'online' }),
          credentials: 'omit',
        })
        fetch('https://chat.twntydigital.de/api/v4/users/me/status/custom', {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({ emoji: 'calendar', text: 'On a meeting' }),
          credentials: 'omit',
        })
      }
    }
  )
})
