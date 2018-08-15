const waitForMined = (txHash, response, pendingCB, successCB) => {
    if (response.blockNumber) {
        successCB(response)
    } else {
        pendingCB()
        pollingLoop(txHash, response, pendingCB, successCB)
    }
}
  
// Recursive polling to do continuous checks for when the transaction was mined
const pollingLoop = (txHash, response, pendingCB, successCB) => {
    setTimeout(function () {
        web3.eth.getTransaction(txHash, (error, response) => {
        if (error) { throw error }
            if (response === null) {
                response = { blockNumber: null }
            } // Some ETH nodes do not return pending tx
            waitForMined(txHash, response, pendingCB, successCB)
        })
    }, 1000) // check again in one sec.
}

export default waitForMined