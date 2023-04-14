import Web3 from "web3"
import { newKitFromWeb3 } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import StakemiiAbi from "../contract/Stakemii.abi.json"
import erc20Abi from "../contract/erc20.abi.json"

const ERC20_DECIMALS = 18
const StakemiiAddress = "0x00a3C172E6cc85e1681B6148E1a98b77057AFF7A"
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let contract
let products = []

const connectCeloWallet = async function () {
  if (window.celo) {
    notification("⚠️ Please approve this DApp to use it.")
    try {
      await window.celo.enable()
      notificationOff()

      const web3 = new Web3(window.celo)
      kit = newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      contract = new kit.web3.eth.Contract(StakemiiAbi, StakemiiAddress)


    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
  } else {
    notification("⚠️ Please install the CeloExtensionWallet.")
  }
}

async function approve(_tokenAddress, _amount) {
  const cUSDContract = new kit.web3.eth.Contract(erc20Abi, _tokenAddress)
  const result = await cUSDContract.methods
    .approve(StakemiiAddress, _amount)
    .send({ from: kit.defaultAccount })
  return result
}

const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}

const TotalcEURstaked = async function () {
  const cEURAddressTotalstaked = await contract.methods.cEURAddressTotalstaked().call()
  //const totalBalance = cEURAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#TotalcEURstaked").textContent = cEURAddressTotalstaked
}

const TotalcUSDstaked = async function () {
    const cUSDAddressTotalstaked = await contract.methods.cUSDAddressTotalstaked().call()
    //const totalBalance = cUSDAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    document.querySelector("#TotalcUSDstaked").textContent = cUSDAddressTotalstaked
  }

const TotalcRealastaked = async function () {
const cREALAddressTotalstaked = await contract.methods.cREALAddressTotalstaked().call()
//const totalBalance = cREALAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
document.querySelector("#TotalcRealastaked").textContent = cREALAddressTotalstaked
}

const Totalcelostaked = async function () {
const CELOAddressTotalstaked = await contract.methods.CELOAddressTotalstaked().call()
//const totalBalance = CELOAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
document.querySelector("#Totalcelostaked").textContent = CELOAddressTotalstaked
console.log("totalBalance", CELOAddressTotalstaked)
}

const TotalStakers = async function () {
    const numberOfStakers = await contract.methods.numberOfStakers().call()
    //const totalBalance = CELOAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    document.querySelector("#totalstakers").textContent = numberOfStakers
    console.log("totalstakers", numberOfStakers)
    }
const getAllTokenInvested = async function () {
    const getAllTokenInvested = await contract.methods.getAllTokenInvested().call()
    //const totalBalance = CELOAddressTotalstaked.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    document.querySelector("#allTokenInvested").textContent = getAllTokenInvested
    console.log("getAllTokenInvested", getAllTokenInvested)
    }
    


const showineterest = async function () {
  const GatedStakingContract = new kit.web3.eth.Contract(StakemiiAbi, StakemiiAddress)
  const result = await GatedStakingContract.methods
    .showInterest(_tokenAddress)
    .send({ from: kit.defaultAccount })
  return result
}


const amountStaked = async function () {
    let addressOfToken = document.getElementById("currencyTostake").value;
    const GatedStakingContract = new kit.web3.eth.Contract(StakemiiAbi, StakemiiAddress)
    const result = await GatedStakingContract.methods
      .amountStaked(addressOfToken)
      .send({ from: kit.defaultAccount })
    return result
  }


function identiconTemplate(_address) {
  const icon = blockies
    .create({
      seed: _address,
      size: 8,
      scale: 16,
    })
    .toDataURL()

  return `
  <div class="rounded-circle overflow-hidden d-inline-block border border-white border-2 shadow-sm m-0">
    <a href="https://alfajores-blockscout.celo-testnet.org/address/${_address}/transactions"
        target="_blank">
        <img src="${icon}" width="48" alt="${_address}">
    </a>
  </div>
  `
}

function notification(_text) {
  document.querySelector(".alert").style.display = "block"
  document.querySelector("#notification").textContent = _text
}

function notificationOff() {
  document.querySelector(".alert").style.display = "none"
}

window.addEventListener("load", async () => {
  notification("⌛ Loading...")
  await connectCeloWallet()
  await getBalance()
  await TotalStakers()
  await TotalcEURstaked()
  await TotalcRealastaked()
  await TotalcUSDstaked()
  await Totalcelostaked()
  await getAllTokenInvested()
  
  // await getProducts()
  notificationOff()
});

document
  .querySelector("#amountStakeBTN")
  .addEventListener("click", async (e) => {
    let addressOfToken = document.getElementById("currencyTostake").value;

    console.log(addressOfToken)

    notification(`⌛ FETCHING "${addressOfToken}"...`)
    try {
       const  result = await contract.methods
        .amountStaked(addressOfToken)
        .send({ from: kit.defaultAccount })
        notification(`🎉 Total amount staked is "${result}".`)
        console.log("result", result.events)
        return;
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    //getProducts()
  })

  

document
  .querySelector("#stakeBTN")
  .addEventListener("click", async (e) => {
    let addressOfToken = document.getElementById("currencyTostake").value;
    let amountToStake = new BigNumber(document.getElementById("amountToStake").value)
    .shiftedBy(ERC20_DECIMALS)
    .toString()

    console.log(addressOfToken, amountToStake)

    notification("⌛ Waiting for payment approval...")
    try {
      await approve(addressOfToken, amountToStake)
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }

    notification(`⌛ Staking "${amountToStake}"...`)
    try {
      const result = await contract.methods
        .stake(addressOfToken, amountToStake)
        .send({ from: kit.defaultAccount })
        return
    } catch (error) {
      notification(`⚠️ ${error}.`)
    }
    notification(`🎉 You successfully staked "${amountToStake}".`)
    //getProducts()
  })

document.querySelector("#withdrawBTN").addEventListener("click", async (e) => {
  let addressOfToken =  document.getElementById("address").value;
  let amountToWithdraw = new BigNumber(document.getElementById("amountToStake").value)
  .shiftedBy(ERC20_DECIMALS)
  .toString()
  console.log(addressOfToken, amountToWithdraw)

  notification(`⌛ withdrawing "${amountToWithdraw}"...`)
  try {
    const result = await contract.methods
      .withdraw(addressOfToken, amountToWithdraw)
      .send({ from: kit.defaultAccount })
      return
  } catch (error) {
    notification(`⚠️ ${error}.`)
  }
  notification(`🎉 You successfully withdarw"${amountToWithdraw}".`)
  getBalance()
})  