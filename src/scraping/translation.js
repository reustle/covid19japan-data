
export const translateAge = (age) => {
  if (age == '10歳未満') {
    return '0'
  } else if (age == '10未満') {
    return '0'
  } else if (age == '未就学児') {
    return '0'
  } else if (age == '不明') {
    return ''
  } else {
    return age.replace('代', '').replace('歳', '')
  }
}

export const translateGender = (gender) => {
  if (gender == '男性') {
    return 'M'
  } else if (gender == '女性') {
    return 'F'
  } else {
    return ''
  }
}

