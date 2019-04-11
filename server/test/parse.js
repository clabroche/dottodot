const parse = require('../routes/v1/draws').parse
const pathfs = require('path')
const expect = require('chai').expect
console.log(parse)
describe('Test', function() {
  it('key should have only for contours', async function() {
    const res = await parse(null, {
      picture: pathfs.resolve(__dirname, 'clef.png'),
      preprocessed: pathfs.resolve(__dirname, 'clef_preprocessed.png'),
      dotPicture: pathfs.resolve(__dirname, 'clef_dot.png'),
      json: pathfs.resolve(__dirname, 'clef_json.json')
    })
    expect(res.contours).lengthOf(4)
  })
  it('rain should have only for contours', async function() {
    const res = await parse(null, {
      picture: pathfs.resolve(__dirname, 'rain.png'),
      preprocessed: pathfs.resolve(__dirname, 'rain_preprocessed.png'),
      dotPicture: pathfs.resolve(__dirname, 'rain_dot.png'),
      json: pathfs.resolve(__dirname, 'rain_json.json')
    })
    expect(res.contours).lengthOf(5)
  })
  it('rain should have only for contours', async function() {
    const res = await parse(null, {
      picture: pathfs.resolve(__dirname, 'snake.png'),
      preprocessed: pathfs.resolve(__dirname, 'snake_preprocessed.png'),
      dotPicture: pathfs.resolve(__dirname, 'snake_dot.png'),
      json: pathfs.resolve(__dirname, 'snake_json.json')
    })
    expect(res.contours).lengthOf(15)
  })
  it('wolf should have only for contours', async function() {
    const res = await parse(null, {
      picture: pathfs.resolve(__dirname, 'wolf.png'),
      preprocessed: pathfs.resolve(__dirname, 'wolf_preprocessed.png'),
      dotPicture: pathfs.resolve(__dirname, 'wolf_dot.png'),
      json: pathfs.resolve(__dirname, 'wolf_json.json')
    })
    expect(res.contours).lengthOf(10)
  })

  it('king should have only for contours', async function() {
    const res = await parse(null, {
      picture: pathfs.resolve(__dirname, 'king.png'),
      preprocessed: pathfs.resolve(__dirname, 'king_preprocessed.png'),
      dotPicture: pathfs.resolve(__dirname, 'king_dot.png'),
      json: pathfs.resolve(__dirname, 'king_json.json')
    })
    expect(res.contours).lengthOf(15)
  })
})