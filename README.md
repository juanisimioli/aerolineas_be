# Aerolineas Smart Contract

Hello! I'm Juanisimioli, a frontend developer venturing into the blockchain ecosystem. I'm practicing by building decentralized applications (dapps) from scratch using NextJS 14 + Ethers 6.8 + Hardhat 2.19 + Solidity 0.8.18.

## Overview

This dapp facilitates the purchase of flight tickets using cryptocurrency. Each seat from one destination to another on a specific flight is represented as an NFT. This allows users to perform various actions such as canceling reservations, purchasing tickets, making free transfer reservations, or even reselling tickets at a desired price for others to buy.

The smart contract in this project utilizes ERC-720 standards and is organized into four files to prevent exceeding the size limit for deployment while maintaining clear responsibilities.

<br/>

## dApp

The application is developed entirely by Juanisimioli and is available for your use. Feel free to provide feedback or even consider hiring me!

The project is deployed and running on the Sepolia testnet. You can experience it live at [www.aerolineas.net.ar](https://www.aerolineas.net.ar). Please ensure you have MetaMask installed to interact with the dapp.

You can also explore the frontend repository [here](https://github.com/juanisimioli/aerolineas_fe) (built with NextJS 14 + Ethers 6.8).

**Note**: Complete the .env file with addresses and credentials. Refer to the .env.example file for guidance.

## Testing

To run tests, use the following command:

```shell
REPORT_GAS=true npx hardhat test
```

<br/>

# DEPLOYMENT

## Local Deployment

Start a local blockchain node with:

```shell
npx hardhat node
```

Deploy the contract on the localhost network:

```shell
npx hardhat run --network localhost scripts/deploy.js
```

**Note**: In your .env file, copy and paste the contract address to LOCALHOST_AEROLINEAS_CONTRACT_ADDRESS.

Run the script to create mocked flights:

```shell
npx hardhat run --network localhost scripts/createFlights.js
```

<br/>

## Blockchain Deployment

To deploy on the Sepolia testnet, run:

```shell
npx hardhat run --network sepolia scripts/deploy.js
```

**Note**: In your .env file, copy and paste the contract address to SEPOLIA_AEROLINEAS_CONTRACT_ADDRESS.

Run the script to create mocked flights on the testnet:

```shell
npx hardhat run --network sepolia scripts/createFlights.js
```

<br/>

## Contract Verification

You can verify your contract code on Etherscan:

```shell
npx hardhat verify --network sepolia --constructor-args scripts/arguments.js [contractAddress]

```

<br/>

## Contract ABI

Once the smart contract is compiled, find the ABI at this location:

```shell
/artifacts/contracts/Aerolineas.sol/Aerolineas.json.
```

You'll need the ABI to run the frontend repository locally.

<br/>

## Contact me

I would love to hear from you! Whether you have questions, feedback, or just want to connect, please don't hesitate to reach out via email at [juanisimioli@gmail.com](mailto:juanisimioli@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/juanisimioli/). Learning together in this community is a wonderful experience, and I'm always open to feedback and collaboration.
