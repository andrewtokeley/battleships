export default function (routername) {
  const map = {
    index: 'BATTLESHIPS',
    joinslug: 'BATTLESHIPS',
    playslug: '',
    new: 'NEW'
  }
  return map[routername.replace('-', '')] ?? ''
}
