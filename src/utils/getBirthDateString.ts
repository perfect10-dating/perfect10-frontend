export const getBirthDateString = (birthDate: number) => {
    let birthDateAsDate = new Date(birthDate)
    let month = (birthDateAsDate.getMonth()+1)     // plus 1 because this is 0-indexed
    let day = birthDateAsDate.getUTCDate()         // prevents off-by-one errors
    let year = birthDateAsDate.getFullYear()

    let monthString = (month >= 10) ? `${month}/` : `0${month}/`
    let dayString = (day >= 10) ? `${day}/` : `0${day}/`

    return `${monthString}${dayString}${year}`
}

