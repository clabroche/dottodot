var express = require('express');
var router = express.Router();
// @ts-ignore
const Promise = require("bluebird");
const fse = Promise.promisifyAll(require("fs-extra"));
const config = require('../../config')
const pathfs = require('path')
let cv = require("opencv4nodejs")
const {uniqWith, cloneDeep} = require('lodash')
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
async function parse(id, draw) {
  let inputPath;
  let preprocessedPath;
  let dotsPath;
  let jsonPath;
  if(!draw) {
    draw = await getDraw(id)
    inputPath = config.getAbsolutePath(draw.picture)
    preprocessedPath = config.getAbsolutePath(draw.preprocessed)
    dotsPath = config.getAbsolutePath(draw.dotPicture)
    jsonPath = config.getAbsolutePath(draw.json)
  } else {
    inputPath = draw.picture
    preprocessedPath = draw.preprocessed
    dotsPath = draw.dotPicture
    jsonPath = draw.json
  }
  let im = await readImage(inputPath)

  await cv.imwriteAsync(preprocessedPath, im)
  let contours = await getContours(im)
  im = im.cvtColor(cv.COLOR_GRAY2RGB)
  contours = filterContours(contours)
  await drawPoints(contours, im)
  await cv.imwriteAsync(dotsPath, im)
  return exportResult(contours, im, jsonPath)
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
  return data
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

function distanceTo(point, point2) {
  if(!point || !point2) return 0
  var distance = Math.abs(Math.sqrt((Math.pow(point.x-point2.x,2))+(Math.pow(point.y-point2.y,2))))
  return distance;
};
function filterContours(contours) {
  return contours
}

function colorRand() {
  return +(Math.random() * 255).toFixed()
}
/**
 * @param {cv.Mat} im 
 */
async function getContours(im) {
  const kernel = cv.getStructuringElement(cv.MORPH_DILATE, new cv.Size(2,2))
  im = im.dilate(kernel)
  cv.imwrite('./a.png', im)
  let contours = (await im.findContoursAsync(cv.RETR_LIST, cv.CHAIN_APPROX_TC89_L1))
    .map(contour => {
      const M = contour.moments()
      const point = new cv.Point2(M["m10"] / M["m00"], M["m01"] / M["m00"])
      im.drawRectangle(point, new cv.Point2(point.x + 2,point.y + 2), new cv.Vec3(255,255,255))
      cv.imwrite('./b.png', im)
      return {contour, point}
    })
    .filter(contour => contour.contour.area > 20)
    .filter(contour => !isNaN(contour.point.x))
    .sort((a, b) => distanceTo(a.point, b.point))
  contours = uniqWith(contours, (a, b) => distanceTo(a.point, b.point) < 25)
  return contours.map(contour => {
    return contour.contour.approxPolyDP(2, true)
  })
}

async function readImage(inputPath, outputPath) {
  let img = await cv.imreadAsync(inputPath);
  img = await img.resizeToMaxAsync(1000)

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

module.exports.parse = parse