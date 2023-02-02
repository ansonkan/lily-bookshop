/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('node:fs')
const path = require('node:path')

const awsExports = fs.readFileSync(
  path.join(__dirname, 'src', 'aws-exports.js')
)

const matches = awsExports
  .toString()
  .replace(/(\r\n|\n|\r)/gm, '')
  .match(/(?<=awsmobile =)(.*)(?=;export)/gm)

module.exports = {
  awsExports: JSON.parse(matches[0]),
}
