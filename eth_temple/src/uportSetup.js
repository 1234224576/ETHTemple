import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('ETHTemple', {
  clientId: '2oyjyTgxK2aFcz7LJM82EdJGpFk23aCoe8L',
  network: 'ropsten',
  signer: SimpleSigner('108d642761d357b2d96a485f9d345771c13f6b7848c863ddf12693ae4b88a882')
})

const web3 = uport.getWeb3()
export { web3, uport }