import {authenticateUser, getUserOptions, setDefaultUserOptions} from "./helpers.js";

const loadHandler = () => {
  authenticateUser()
  setDefaultUserOptions()
  getUserOptions()
}

const logInHandler = async () => {
  const login = document.getElementById('login-id-input').value
  const password = document.getElementById('password-input').value

  const res = await fetch('https://chat.twntydigital.de/api/v4/users/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      login_id: login,
      password: password,
    }),
  })
  const token = res.headers.get('token')
  const respData = await res.json()

  chrome.storage.sync.set({MMAuthToken: token, MMUserId: respData.id, MMUsername: respData.username}, loadHandler)
}

const logOutHandler = () => {
  chrome.storage.sync.clear(() => {
    const $singInView = document.getElementById('sing-in-view')
    const $homeView = document.getElementById('home-view')

    $singInView.style.display = 'block'
    $homeView.style.display = 'none'
  })
}

const personalTokenSubmitHandler = async () => {
  const token = document.getElementById('personal-token-input').value

  chrome.storage.sync.set({MMAccessToken: token}, loadHandler)
}

const saveOptions = async () => {
  const status = document.getElementById('user-status').value
  const text = document.getElementById('user-status-text').value
  const showMeetingTitle = document.getElementById('show-meeting-title').checked
  const $button = document.getElementById('save-options-button')

  chrome.storage.sync.set({
    userStatus: status,
    userStatusText: text,
    showMeetingTitle: showMeetingTitle
  }, () => {
    $button.innerText = 'Saved'

    setTimeout(() => ($button.textContent = 'Save'), 750)
  })
}

document.addEventListener('DOMContentLoaded', loadHandler)
document.getElementById('login-button').addEventListener('click', logInHandler)
document.getElementById('log-out-button').addEventListener('click', logOutHandler)
document.getElementById('personal-token-button').addEventListener('click', personalTokenSubmitHandler)
document.getElementById('save-options-button').addEventListener('click', saveOptions)
