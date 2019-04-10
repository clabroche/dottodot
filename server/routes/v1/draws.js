var express = require('express');
var router = express.Router();
// @ts-ignore
const Promise = require("bluebird");
const fse = Promise.promisifyAll(require("fs-extra"));
const config = require('../../config')
const pathfs = require('path')
let cv = require("opencv4nodejs")
const {uniqBy} = require('lodash')
const gm = require('gm').subClass({
  imageMagick: true
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  const draws = await getAllDraws()
  res.json(draws);
});
router.get('/:id', async function (req, res, next) {
  const draw = await getDraw(req.params.id)
  res.json(draw);
});
router.delete('/:id', async function (req, res, next) {
  await fse.remove(pathfs.resolve(config.drawsPath, req.params.id))
  res.send('ok');
});
router.post('/:id/parse', async function (req, res, next) {
  await parse(req.params.id)
  const draw = await getDraw(req.params.id)
  res.json(draw);
});
router.post('/:id', async function (req, res, next) {
  const json = req.body
  await fse.mkdir(pathfs.resolve(config.drawsPath, req.params.id))
  const draw = await getDraw(req.params.id)
  // @ts-ignore
  await fse.writeFile(config.getAbsolutePath(draw.picture), req.files.file.data)
  await parse(req.params.id)
  res.json(draw);
});
router.put('/:id', async function (req, res, next) {
  const draw = await getDraw(req.params.id)
  await fse.writeJSON(config.getAbsolutePath(draw.json), req.body)
  res.send(draw)
})
async function getAllDraws() {
  const dirs = await getDraws()
  return dirs.map(dir => ({ // TODO: send only if exist
    id: dir.split('/').pop(),
    picture: pathfs.resolve(dir, 'original.png'),
    dots: pathfs.resolve(dir, 'dots.png'),
    preprocessed: pathfs.resolve(dir, 'preprocessed.png'),
    dotPicture: pathfs.resolve(dir, 'dots.png'),
    json: pathfs.resolve(dir, 'json.json'),
  }))
}
async function getDraw(id) {
  const draws = await getAllDraws()
  return draws.filter(draw => draw.id === id).pop()
}
async function parse(id) {
  const draw = await getDraw(id)
  const inputPath = config.getAbsolutePath(draw.picture)
  const preprocessedPath = config.getAbsolutePath(draw.preprocessed)
  const dotsPath = config.getAbsolutePath(draw.dotPicture)
  const jsonPath = config.getAbsolutePath(draw.json)
  let im = await readImage(inputPath)
  await cv.imwriteAsync(preprocessedPath, im)
  let contours = await getContours(im)
  im = im.cvtColor(cv.COLOR_GRAY2RGB)
  contours = filterContours(contours)
  await drawPoints(contours, im)
  await cv.imwriteAsync(dotsPath, im)
  await exportResult(contours, im, jsonPath)
}
async function exportResult(contours, im, jsonPath) {
  const data = {
    width: im.cols,
    height: im.rows,
    contours: contours.map(contour => {
      return {
        color: `rgb(${colorRand()},${colorRand()},${colorRand()})`,
        path: contour        
      }
    })
  }
  await fse.writeJSON(jsonPath, data)
}
function drawPoints(contours, im) {
  contours.map(contour => {
    const color = new cv.Vec3(colorRand(),colorRand(),colorRand())
    contour.map((point, index) => {
      im.drawCircle(point, 1, color, 2)
      im.putText(index.toString(), new cv.Point2(point.x + 5, point.y), 1, 1, color)
    })
  })
}

function filterContours(contours) {
  return contours.map(contour => {
    return contour.reduce((acc, point) => {
      return acc += (point.x + point.y)
    },0)
  }).sort().map((delta, index, array) => {
    const thresh = 10
    if(isNaN((+array[index +1] - thresh) )) return contours[index]
    if(+delta > (+array[index +1] - thresh) && +delta < (+array[index +1] + thresh)) {
      return null
    } else {
      return contours[index]
    }
  }).filter(a => a)
}

function colorRand() {
  return +(Math.random() * 255).toFixed()
}
async function getContours(im) {
  return (await im.findContoursAsync(1,1))
    .filter(contour => contour.area > 100)
    .map(contour => contour.approxPolyDP(4, true))
}

async function readImage(inputPath, outputPath) {
  const img = await cv.imreadAsync(inputPath);
  const grayImg = await img.bgrToGrayAsync();
  const canny = await grayImg.cannyAsync(200,100)
  await cv.imwriteAsync('./a.png', canny)
  return canny
}


(async _ => {
  const parsed = await parse('123') 
})().catch(console.error)

async function getDraws() {
  return fse
    .readdirAsync(config.drawsPath)
    .map(dir => {
      const absolutePath = pathfs.resolve(config.drawsPath, dir)
      return config.getPublicPath(absolutePath)
    })
}
module.exports = router;
