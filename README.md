# Nouns on Polygon (Pouns) NFTs SDK

Generate pixel-art images with data stored on Polygon blockchain.

## Objectives

[Nouns](https://nouns.wtf/) is a generative non-fungible token project on the Ethereum blockchain. Nouns are 32x32 pixel characters based on people, places, and things. There is a [rich eco-system](https://nouns.center/dev) around this project - REST API services, derivative art etc. All of the images are in the public domain.

Making changes to this data however is too expensive (Ethereum blockchain fees) or impossible (contract ownership), so I deployed all the art-related contracts (DAO and sells related contracts excluded) to the Polygon testnet (Mumbai) and mainnet. You can think about this as a Read-Only storage, decentrilized, faster and more secure than IPFS.

The generation of the images is by read-only transactions to the blockchain, so it does not cost any fees and does not require Ethereum wallet as Metamask to be connected. This however require direct RPC connection to the blockchain, so you will need some RPC node provider. By default [Alchemy](https://alchemy.com) is used, but you can change it your project. Good candidate for example is [GetBlock](https://getblock.io/).

Current library capsulates and isolates all the complexity of blockchain access. Simple methods for generating SVG images are provided.

## Used libraries and services

* [Nouns Solidity contracts and assets](https://github.com/nounsDAO/nouns-monorepo)
* [ethers.js](https://github.com/ethers-io/ethers.js/) - A complete Ethereum wallet implementation and utilities in JavaScript (and TypeScript).
* [Alchemy](https://alchemy.com) - The most powerful set of web3 development tools to build and scale your dApp with ease.

## Installation

```sh
npm install pouns-sdk
```

## Development

```sh
git clone https://github.com/zh/pouns-sdk.git
cd pouns-sdk
npm install
```

## Testing

There are some basic tests implemented. The testing does not require connection to Internet.

```sh
npm test
```

## Provided methods

* *`getContracts(chain, rpcURL)`* - create JSON config file to access on-chain contracts. `chain='polygon|mumbai'`, default `rpcURL` pointing to Alchemy node.
* *`seedPoun(contracts)`* - generate valid seed - a 5-numbers tuple, describing the character parts - head, glasses etc.
* *`generatePoun(contracts, seed)`* - generate SVG image from a given seed. returns base64 encoded data.

## Usage

Generating pixel-art images is separated in two steps:

* generate **seed** - a tuple of 5 numbers, representing different image parts.
* generate **SVG image** from the seed

These steps can be executed in sequence, for example, when generating a random number.
If the seed is already saved (for example in NFT), only the second step can be executed, based on the existing seed.

For more imformation see [Nouns project documentation](https://nouns.center/).

### Generate seed

the example is for node.js (CLI usage):

```js
const { getContracts, seedPoun } = require('pouns-sdk')

const createPoun = async () => {
  const contracts = getContracts()
  const seed = await seedPoun(contracts)
  ...
}
createPoun()
```

### Generate SVG image

The example is for using in *React.js* component:

```js
import { getContracts, seedPoun, generatePoun } from 'pouns-sdk'
...
const [currentImg, setCurrentImg] = useState('')

const createPoun = async () => {
  const contracts = getContracts();
  const seed = await seedPoun(contracts);
  const svg = await generatePoun(contracts, seed);
  setCurrentImg(Buffer.from(svg, 'base64').toString());
};
...
```

and later to display the image:

```html
<div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
  <div dangerouslySetInnerHTML={{ __html: currentImg }}></div>
</div>
```

### Using in URLs

Most of NFTs specifing the media as an URL to the image, video etc. file. Pouns images can be represented as an URL with their seed: `pouns://[0,18,89,117,5]`. This URL can be used for image generation as follows:

```js
if (token.url.includes('pouns://')) {
  const seed = token.url.substring(8);
  const imgData = await getPoun(seed);
  ....
}
```

### Change generated SVG image size

The image size is hardcoded in the SVG image data - `320x320 px`. But because the format of the data is always the same, you can change the image size like this:

```js
const imgData = await getPoun(seed); // imgData is a string
const newSize = 160;
const fixedData = imgData.replace(
  '<svg width="320" height="320"',
  `<svg width="${newSize}" height="${newSize}"`
);
```

### Using 'Mumbai' testnet

Most of the images data is also deployed to Mumbai Polygon testnet. In order to generate images, based on that data, specify testnet, when getting contracts.

```js
const contracts = getContracts('mumbai')
```

### Using different RPC node

If the default Alchemy RPC connection is too slow or not working, you can use for example [GetBlock](https://getblock.io) RPC node:

```js
const rpcURL = 'https://matic.getblock.io/.../testnet/'
const contracts = getContracts('mumbai', rpcURL)
```

## Future plans

* REST interface for even easier image generation
* Ready React.js components - NFTs etc. to generate and display the images
