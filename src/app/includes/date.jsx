import React from 'react'

function getMonth(date) {
  switch(date.getMonth()) {
    case 0:
      return 'Января'
    case 1:
      return 'Февраля'
    case 2:
      return 'Марта'
    case 3:
      return 'Апреля'
    case 4:
      return 'Мая'
    case 5:
      return 'Июня'
    case 6:
      return 'Июля'
    case 7:
      return 'Августа'
    case 8:
      return 'Сентября'
    case 9:
      return 'Октября'
    case 10:
      return 'Ноября'
    case 11:
      return 'Декабря'
    default: 
      return ''
  }
}

function getMinutes(minutes) {
  if (minutes < 10) {
    return `0${minutes}`
  } else {
    return minutes
  }
}

function getDay(day) {
  switch (day) {
    case 0:
      return 'Воскресенье'
    case 1:
      return 'Понедельник'
    case 2:
      return 'Вторник'
    case 3:
      return 'Среда'
    case 4:
      return 'Четверг'
    case 5:
      return 'Пятница'
    case 6:
      return 'Суббота'
    default:
      return ''
  }
}

function PatternedDate ({ date, format }) {
  const dt = new Date(date)
  switch (format) {
    case 'short':
      return <><b>{getDay(dt.getDay())} {dt.getDate()}</b> {getMonth(dt)} {dt.getFullYear()}</>
    case 'time':
      return <>{dt.getHours()}:{getMinutes(dt.getMinutes())}</>
    default:
      return <><b>{getDay(dt.getDay())} {dt.getDate()}</b> {getMonth(dt)} {dt.getFullYear()} {dt.getHours()}:{ getMinutes(dt.getMinutes()) }</>
  }
}

export default PatternedDate