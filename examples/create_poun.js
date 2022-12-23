const { Buffer } = require('buffer')
const { getContracts, seedPoun, generatePoun } = require('../src/pouns-sdk')

const createPoun = async () => {
  const contracts = getContracts()
  console.log('chain:      ', contracts.chain)
  console.log('descriptor: ', contracts.pounsDescriptor.address)
  console.log('seeder:     ', contracts.pounsSeeder.address)
  console.log('rpc:        ', contracts.pounsDescriptor.provider.connection.url)
  const seed = await seedPoun(contracts)
  console.log(`seed:        [${seed.toString()}]`)
  const svg = await generatePoun(contracts, seed)
  const img = Buffer.from(svg, 'base64').toString()
  console.log(`image:       ${img.substring(0, 60)}...`)
}

createPoun()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
