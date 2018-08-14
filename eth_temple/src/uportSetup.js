import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('ETHTemple', {
  clientId: '2oyjyTgxK2aFcz7LJM82EdJGpFk23aCoe8L',
  network: 'ropsten',
  signer: SimpleSigner('****')
})

const web3 = uport.getWeb3()
export { web3, uport }