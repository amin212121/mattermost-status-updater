export const getMeetingTitle = (pageTitle) => {
    const meetingTitleRegExp = /(?<=Meet(\u00A0|\s)– ).*/
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