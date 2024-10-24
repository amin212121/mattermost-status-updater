const loadHandler = () => {
  chrome.storage.sync.get(null, async function (items) {
    try {
      const $loader = document.getElementById('loader')
      const $singInView = document.getElementById('sing-in-view')
      const {MMAuthToken, MMAccessToken, MMUsername, userStatus, userStatusText} = items
      const token = MMAccessToken ? MMAccessToken : MMAuthToken

      if (!token) {
        $singInView.style.display = 'block'
        $loader.style.display = 'none'

        return
      }

      const response = await fetch('https://chat.twntydigital.de/api/v4/users/me', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        credentials: 'omit',
      })

      if (!response.ok) {
        $singInView.style.display = 'block'
        $loader.style.display = 'none'

        return
      }

      const responseData = await response.json()
      chrome.storage.sync.set({MMUserId: responseData.id})

      const $homeView = document.getElementById('home-view')
      const $accessToken = document.getElementById('access-token')
      const $userStatus = document.getElementById('user-status')
      const $userStatusText = document.getElementById('user-status-text')
      const $userName = document.getElementById('user-name')

      $loader.style.display = 'none'
      $singInView.style.display = 'none'
      $homeView.style.display = 'block'
      $userName.innerText = MMUsername || responseData.username
      $accessToken.innerText = MMAccessToken
      $userStatus.value = userStatus || "dnd"
      $userStatusText.value = userStatusText || "I'm on a meet"

    } catch (e) {
    }
  })
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
  const $button = document.getElementById('save-options-button')

  chrome.storage.sync.set({userStatus: status, userStatusText: text}, () => {
    $button.innerText = 'Saved'

    setTimeout(() => ($button.textContent = 'Save'), 750)
  })
}

document.addEventListener('DOMContentLoaded', loadHandler)
document.getElementById('login-button').addEventListener('click', logInHandler)
document.getElementById('log-out-button').addEventListener('click', logOutHandler)
document.getElementById('personal-token-button').addEventListener('click', personalTokenSubmitHandler)
document.getElementById('save-options-button').addEventListener('click', saveOptions)
