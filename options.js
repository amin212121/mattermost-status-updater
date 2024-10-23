async function save_options() {
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

  chrome.storage.sync.set({MMAuthToken: token, MMUserId: respData.id, MMUsername: respData.username}, function () {
    const status = document.getElementById('status')
    status.textContent = 'Processing...'

    setTimeout(() => (status.textContent = ''), 750)

    const $singInView = document.getElementById('sing-in-view')
    const $homeView = document.getElementById('home-view')

    $singInView.style.display = 'none'
    $homeView.style.display = 'block'
  })
}

async function save_personal_token() {
  const token = document.getElementById('personal-token-input').value

  chrome.storage.sync.set({MMAccessToken: token}, function () {
    const status = document.getElementById('status')
    status.textContent = 'Processing...'

    setTimeout(() => (status.textContent = ''), 750)

    const $singInView = document.getElementById('sing-in-view')
    const $homeView = document.getElementById('home-view')

    $singInView.style.display = 'none'
    $homeView.style.display = 'block'
  })
}

function onLoad() {
  chrome.storage.sync.get({MMAuthToken: '', MMAccessToken: ''}, async function (items) {
    try {
      const {MMAuthToken, MMAccessToken} = items
      const token = MMAccessToken ? MMAccessToken : MMAuthToken

      const response = await fetch('https://chat.twntydigital.de/api/v4/users/me', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        credentials: 'omit',
      })

      if (!response.ok) {
        return
      }

      const responseData = await response.json()
      chrome.storage.sync.set({MMUserId: responseData.id})

      const $singInView = document.getElementById('sing-in-view')
      const $homeView = document.getElementById('home-view')
      const $accessToken = document.getElementById('access-token')

      $singInView.style.display = 'none'
      $homeView.style.display = 'block'
      $accessToken.innerText = MMAccessToken

    } catch (e) {
    }
  })
}

function logOutHandler() {
  chrome.storage.sync.set({MMAuthToken: '', MMAccessToken: ''})

  const $singInView = document.getElementById('sing-in-view')
  const $homeView = document.getElementById('home-view')

  $singInView.style.display = 'block'
  $homeView.style.display = 'none'
}

document.addEventListener('DOMContentLoaded', onLoad)
document.getElementById('login-button').addEventListener('click', save_options)
document.getElementById('log-out-button').addEventListener('click', logOutHandler)
document.getElementById('personal-token-button').addEventListener('click', save_personal_token)
