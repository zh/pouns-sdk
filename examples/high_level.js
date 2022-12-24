const { Buffer } = require('buffer')
const { getPoun } = require('../src/pouns-sdk')

const createPoun = async () => {
  // for testnet try getPoun('mumbai')
  const {seed, svg } = await getPoun()
  console.log(`seed:  [${seed.toString()}]`)
  const img = Buffer.from(svg, 'base64').toString()
  console.log(`image: ${img.substring(0, 60)}...`)
}

createPoun()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
