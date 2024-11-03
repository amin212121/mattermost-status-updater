import {getMeetingTitle, isMeetingCodeInMeetingTitle} from "./scripts/helpers.js";

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
      userStatusText: '',
      showMeetingTitle: false
    },
    function ({MMAuthToken, MMUserId, MMAccessToken, userStatus, userStatusText, showMeetingTitle}) {
      if (request.state === 'googleMeetStarted') {
        fetch('https://chat.twntydigital.de/api/v4/users/me/status', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({user_id: MMUserId, status: userStatus}),
          credentials: 'omit',
        })

        fetch('https://chat.twntydigital.de/api/v4/users/me/status/custom', {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + MMAccessToken,
          },
          body: JSON.stringify({emoji: 'calendar', text: userStatusText}),
          credentials: 'omit',
        })

        if (showMeetingTitle) {
          chrome.tabs.onUpdated.addListener(function titleUpdateListener(tabId, changeInfo) {
            if (!changeInfo.title) {
              return
            }

            const meetingTitle = getMeetingTitle(changeInfo.title)

            if (!meetingTitle) {
              return
            }

            if (isMeetingCodeInMeetingTitle(meetingTitle)) {
              return
            }

            fetch('https://chat.twntydigital.de/api/v4/users/me/status/custom', {
              method: 'PUT',
              headers: {
                Authorization: 'Bearer ' + MMAccessToken,
              },
              body: JSON.stringify({emoji: 'calendar', text: `${userStatusText} (${meetingTitle})`}),
              credentials: 'omit',
            })

            chrome.tabs.onUpdated.removeListener(titleUpdateListener)
          })
        }
      }

      if (request.state === 'googleMeetFinished') {
        chrome.tabs.query({url: "https://meet.google.com/*-*-*"}, function (tabs) {
          if (tabs.length > 1) return

          fetch('https://chat.twntydigital.de/api/v4/users/me/status', {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + MMAccessToken,
            },
            body: JSON.stringify({user_id: MMUserId, status: 'online'}),
            credentials: 'omit',
          })
          fetch('https://chat.twntydigital.de/api/v4/users/me/status/custom', {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + MMAccessToken,
            },
            body: JSON.stringify({emoji: 'calendar', text: 'On a meeting'}),
            credentials: 'omit',
          })
        });

      }
    }
  )
})
