export const authenticateUser = () => {
    chrome.storage.sync.get(['MMAuthToken', 'MMAccessToken', 'MMUsername'], async function (items) {
        try {
            const $loader = document.getElementById('loader')
            const $singInView = document.getElementById('sing-in-view')
            const {MMAuthToken, MMAccessToken, MMUsername} = items
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
            const $userName = document.getElementById('user-name')

            $loader.style.display = 'none'
            $singInView.style.display = 'none'
            $homeView.style.display = 'block'
            $userName.innerText = MMUsername || responseData.username
            $accessToken.innerText = MMAccessToken
        } catch (e) {
        }
    })
}

export const setDefaultUserOptions = () => {
    chrome.storage.sync.set({
        userStatus: "dnd",
        userStatusText: "I'm on a meet",
        showMeetingTitle: false
    })
}

export const getUserOptions = () => {
    chrome.storage.sync.get(['userStatus', 'userStatusText', 'showMeetingTitle'], async function (items) {
        const {userStatus, userStatusText, showMeetingTitle} = items

        const $userStatus = document.getElementById('user-status')
        const $userStatusText = document.getElementById('user-status-text')
        const $showMeetingTitle = document.getElementById('show-meeting-title')

        $userStatus.value = userStatus
        $userStatusText.value = userStatusText
        $showMeetingTitle.checked = showMeetingTitle
    })
}

export const getMeetingTitle = (pageTitle) => {
    const meetingTitleRegExp = /(?<=Meet(\u00A0|\s)([–\-]) ).*/
    const meetingTitleMatch = pageTitle.match(meetingTitleRegExp)

    if (!meetingTitleMatch) {
        return null
    }

    return meetingTitleMatch[0]
}

export const isMeetingCodeInMeetingTitle = (meetingTitle) => {
    const googleMeetingCodeRegExp = /[a-zA-Z]{3}-[a-zA-Z]{4}-[a-zA-Z]{3}/

    const result = meetingTitle.match(googleMeetingCodeRegExp)

    return !!result;
}