const PounsDescriptorAbi = require('./abis/PounsDescriptor.json')
const PounsSeederAbi = require('./abis/PounsSeeder.json')
const { Contract } = require('ethers')
const { JsonRpcProvider } = require('@ethersproject/providers')

const chains = {
  mumbai: {
    descriptor: '0x17a4F66EfdE48153e0E0FFEAc91545e2E26962AF',
    seeder: '0xA7c87Ee47178e2F6eeBA08F5B34523E31f7fEB53',
    rpc: 'https://polygon-mumbai.g.alchemy.com/v2/vvJoLY_GbpA1fggW5iOdqXIIe22GQdCi'
  },
  polygon: {
    descriptor: '0x8f18E0a4573B681086670236753cd45190d58622',
    seeder: '0x0a2B34f87B6EaF965A69de7090F6420c8E47a08d',
    rpc: 'https://polygon-mainnet.g.alchemy.com/v2/5PnimgKP2xalhM3_isixFnSHdLSxxsEy'
  }
}

const getContracts = (chain = 'polygon', newRPC = null) => {
  try {
    const provider = new JsonRpcProvider(newRPC || chains[chain].rpc)
    return {
      pounsDescriptor: new Contract(
        chains[chain].descriptor,
        PounsDescriptorAbi,
        provider
      ),
      pounsSeeder: new Contract(chains[chain].seeder, PounsSeederAbi, provider),
      addressDescriptor: chains[chain].descriptor,
      chain: chain
    }
  } catch (error) {
    console.log('getContracts() error: ', error)
    return null
  }
}

const seedPoun = async (contracts) => {
  try {
    const pounId = Math.floor(Math.random() * 1000)
    return contracts.pounsSeeder.generateSeed(
      pounId,
      contracts.addressDescriptor
    )
  } catch (error) {
    console.log('seedPoun() error: ', error)
    return null
  }
}

const generatePoun = async (contracts, seed) => {
  try {
    const fixedSeed = Array.isArray(seed)
      ? seed
      : seed.split(',').map((n) => parseInt(n, 10) || 0)
    return contracts.pounsDescriptor.generateSVGImage(fixedSeed)
  } catch (error) {
    console.log('generatePoun() error: ', error)
    return null
  }
}

const getPoun = async (seed = null, chain = 'polygon') => {
  try {
    const contracts = getContracts(chain)
    if (!contracts) throw 'Contracts not available'
    const theSeed = seed || (await seedPoun(contracts))
    if (!theSeed) throw 'Invalid seed'
    poun = await generatePoun(contracts, theSeed)
    if (!poun) throw 'Generation failed'
    return { seed: theSeed, svg: poun }
  } catch (error) {
    console.log('generatePoun() error: ', error)
    return null
  }
}

module.exports = {
  getContracts,
  seedPoun,
  generatePoun,
  getPoun
}
