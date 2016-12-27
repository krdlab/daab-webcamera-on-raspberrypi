const exec = require('child_process').exec

const CAPTURE_ROOT   = '/tmp/webcam'  // TODO
const FILE_EXTENSION = 'jpg'
const CONTENT_TYPE   = 'image/jpeg'

module.exports = (robot) => {
  robot.hear(/snapshot$/i, (res) => snapshot(res))
}

const snapshot = (res) => {
  const fileName = `${Date.now()}.${FILE_EXTENSION}`
  const filePath = `${CAPTURE_ROOT}/${fileName}`
  const convert_ = convert(isAdapterShell(res))
  capture(filePath)
    .then(() =>
          res.send(convert_({name: fileName, path: filePath, type: CONTENT_TYPE})))
    .catch((reason) =>
          res.send(`error occurred: ${reason.error}`))
}

const isAdapterShell = (res) => res.robot.adapterName === 'shell'

const convert   = (shell) => shell ? stringify : id
const stringify = JSON.stringify
const id        = (m) => m

const capture = (path) => {
  const cmd = command(path)
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject({error, stdout, stderr})
      } else {
        resolve()
      }
    })
  })
}

const command = (path) => {
  //return `echo ${path}` // for debugging
  return `fswebcam -S 10 -r 640x360 --no-banner ${path}`
}
