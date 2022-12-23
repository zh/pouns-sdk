const chai = require('chai')
const { expect } = require('chai')

const { getContracts, seedPoun, generatePoun } = require('../src/pouns-sdk')

const mocha = require('mocha')

const { pounsTests } = require('./tests.spec')

describe('POUNS', () => {
  describe('Default values', () => {
    const c = getContracts()
    expect(c.chain).to.equal('polygon')
    expect(c.pounsDescriptor.address).to.equal(pounsTests.polygonDescriptor)
    expect(c.pounsSeeder.address).to.equal(pounsTests.polygonSeeder)
    expect(c.pounsDescriptor.provider.connection.url).to.equal(
      pounsTests.polygonRPC
    )
  })
  describe('Testnet', () => {
    const c = getContracts('mumbai')
    expect(c.chain).to.equal('mumbai')
    expect(c.pounsDescriptor.address).to.equal(pounsTests.mumbaiDescriptor)
    expect(c.pounsSeeder.address).to.equal(pounsTests.mumbaiSeeder)
  })
})
