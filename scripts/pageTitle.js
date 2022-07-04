export default function (routername) {
  const map = {
    index: 'BATTLESHIPS',
    joinslug: 'BATTLESHIPS',
    playslug: 'BATTLESHIPS',
    new: 'NEW'
  }
  return map[routername.replace('-', '')] ?? ''
}
