import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"
import * as ethers from "ethers"
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import {
  Web3Provider,
  JsonRpcSigner,
  JsonRpcProvider,
} from "@ethersproject/providers";
// import { LitConnectModal } from "lit-connect-modal";

const LitJsSdk = require("lit-js-sdk");
const connectModal = require("lit-connect-modal");
const LitConnectModal: any = connectModal;
console.log("Lit Connect Modal", LitConnectModal);


interface State {
  walletAddress: string
  transaction: string
  isFocused: boolean
  encryptedString: string
  encryptedSymmetricKey: string
  decryptedString: string
}

declare global {
  interface Window {
    ethereum: any,
    authSig: any,
    resourceId: any,
    accessControlConditions: any,
    litNodeClient: any,
    jwt: any,
    location: Location,
  }
}
interface Document {
  authStatus: any,
}


async function getAccount() {
  var provider
  var signer
  provider = new ethers.providers.Web3Provider(window.ethereum, "any")
  // Prompt user for account connections
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });
  await provider.send("eth_requestAccounts", [])
  window.ethereum.on('accountsChanged', function (accounts: any) {
    // Time to reload your interface with accounts[0]!
  });  
  signer = provider.getSigner()
  signer = "0"
  signer = provider.getSigner()
  const address = await signer.getAddress()
  return address
}

async function sendToken(to_address: string,
                        send_token_amount: string,
                        contract_address: string = "0x8967BCF84170c91B0d24D4302C2376283b0B3a07") {
  console.log("Sending OCEAN initiated");

  const contractAddress = contract_address;
  const contractAbiFragment = [
    {
      name: "transfer",
      type: "function",
      inputs: [
        {
          name: "_to",
          type: "address",
        },
        {
          type: "uint256",
          name: "_tokens",
        },
      ],
      constant: false,
      outputs: [
        {
          name: "",
          type: "bool",
        },
      ],
      payable: false,
    },
  ];
  console.log("Parameters defined");
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  // Prompt user for account connections
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  let contract = new ethers.Contract(contractAddress, contractAbiFragment, signer);
  console.log("Contract defined");
  // How many tokens?
  let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
  console.log(`numberOfTokens: ${numberOfTokens}`);
  console.log("Ready to transfer");
  // Send tokens
  contract.transfer(to_address, numberOfTokens).then((transferResult: any) => {
    console.dir(transferResult);
    console.log("sent token");
  });
  console.log("Done: see address below on etherscan");
  console.log(to_address);
}

// Lit Protocol Integration
const LIT_CHAINS: any = {
  ethereum: {
    contractAddress: "0xA54F7579fFb3F98bd8649fF02813F575f9b3d353",
    chainId: 1,
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    type: "ERC1155",
    rpcUrls: [
      "https://eth-mainnet.alchemyapi.io/v2/EuGnkVlzVoEkzdg0lpCarhm8YHOxWVxE",
    ],
    blockExplorerUrls: ["https://etherscan.io"],
    vmType: "EVM",
  },
  polygon: {
    contractAddress: "0x7C7757a9675f06F3BE4618bB68732c4aB25D2e88",
    chainId: 137,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://explorer.matic.network"],
    type: "ERC1155",
    vmType: "EVM",
  },
  fantom: {
    contractAddress: "0x5bD3Fe8Ab542f0AaBF7552FAAf376Fd8Aa9b3869",
    chainId: 250,
    name: "Fantom",
    symbol: "FTM",
    decimals: 18,
    rpcUrls: ["https://rpcapi.fantom.network"],
    blockExplorerUrls: ["https://ftmscan.com"],
    type: "ERC1155",
    vmType: "EVM",
  },
  xdai: {
    contractAddress: "0xDFc2Fd83dFfD0Dafb216F412aB3B18f2777406aF",
    chainId: 100,
    name: "xDai",
    symbol: "xDai",
    decimals: 18,
    rpcUrls: ["https://rpc.gnosischain.com"],
    blockExplorerUrls: [" https://blockscout.com/xdai/mainnet"],
    type: "ERC1155",
    vmType: "EVM",
  },
  bsc: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 56,
    name: "Binance Smart Chain",
    symbol: "BNB",
    decimals: 18,
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: [" https://bscscan.com/"],
    type: "ERC1155",
    vmType: "EVM",
  },
  arbitrum: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 42161,
    name: "Arbitrum",
    symbol: "AETH",
    decimals: 18,
    type: "ERC1155",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io/"],
    vmType: "EVM",
  },
  avalanche: {
    contractAddress: "0xBB118507E802D17ECDD4343797066dDc13Cde7C6",
    chainId: 43114,
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
    type: "ERC1155",
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
    vmType: "EVM",
  },
  fuji: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 43113,
    name: "Avalanche FUJI Testnet",
    symbol: "AVAX",
    decimals: 18,
    type: "ERC1155",
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
    vmType: "EVM",
  },
  harmony: {
    contractAddress: "0xBB118507E802D17ECDD4343797066dDc13Cde7C6",
    chainId: 1666600000,
    name: "Harmony",
    symbol: "ONE",
    decimals: 18,
    type: "ERC1155",
    rpcUrls: ["https://api.harmony.one"],
    blockExplorerUrls: ["https://explorer.harmony.one/"],
    vmType: "EVM",
  },
  kovan: {
    contractAddress: "0x9dB60Db3Dd9311861D87D33B0463AaD9fB4bb0E6",
    chainId: 42,
    name: "Kovan",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://kovan.infura.io/v3/ddf1ca3700f34497bca2bf03607fde38"],
    blockExplorerUrls: ["https://kovan.etherscan.io"],
    type: "ERC1155",
    vmType: "EVM",
  },
  mumbai: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 80001,
    name: "Mumbai",
    symbol: "MATIC",
    decimals: 18,
    rpcUrls: [
      "https://rpc-mumbai.maticvigil.com/v1/96bf5fa6e03d272fbd09de48d03927b95633726c",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
    type: "ERC1155",
    vmType: "EVM",
  },
  goerli: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 5,
    name: "Goerli",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://goerli.infura.io/v3/96dffb3d8c084dec952c61bd6230af34"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
    type: "ERC1155",
    vmType: "EVM",
  },
  ropsten: {
    contractAddress: "0x61544f0AE85f8fed6Eb315c406644eb58e15A1E7",
    chainId: 3,
    name: "Ropsten",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://ropsten.infura.io/v3/96dffb3d8c084dec952c61bd6230af34"],
    blockExplorerUrls: ["https://ropsten.etherscan.io"],
    type: "ERC1155",
    vmType: "EVM",
  },
  rinkeby: {
    contractAddress: "0xc716950e5deae248160109f562e1c9bf8e0ca25b",
    chainId: 4,
    name: "Rinkeby",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://rinkeby.infura.io/v3/96dffb3d8c084dec952c61bd6230af34"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io"],
    type: "ERC1155",
    vmType: "EVM",
  },
  cronos: {
    contractAddress: "0xc716950e5DEae248160109F562e1C9bF8E0CA25B",
    chainId: 25,
    name: "Cronos",
    symbol: "CRO",
    decimals: 18,
    rpcUrls: ["https://evm-cronos.org"],
    blockExplorerUrls: ["https://cronos.org/explorer/"],
    type: "ERC1155",
    vmType: "EVM",
  },
  optimism: {
    contractAddress: "0xbF68B4c9aCbed79278465007f20a08Fa045281E0",
    chainId: 10,
    name: "Optimism",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://mainnet.optimism.io"],
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
    type: "ERC1155",
    vmType: "EVM",
  },
  celo: {
    contractAddress: "0xBB118507E802D17ECDD4343797066dDc13Cde7C6",
    chainId: 42220,
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
    type: "ERC1155",
    vmType: "EVM",
  },
  aurora: {
    contractAddress: null,
    chainId: 1313161554,
    name: "Aurora",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: ["https://mainnet.aurora.dev"],
    blockExplorerUrls: ["https://aurorascan.dev"],
    type: null,
    vmType: "EVM",
  },
  eluvio: {
    contractAddress: null,
    chainId: 955305,
    name: "Eluvio",
    symbol: "ELV",
    decimals: 18,
    rpcUrls: ["https://host-76-74-28-226.contentfabric.io/eth"],
    blockExplorerUrls: ["https://explorer.eluv.io"],
    type: null,
    vmType: "EVM",
  },
  alfajores: {
    contractAddress: null,
    chainId: 44787,
    name: "Alfajores",
    symbol: "CELO",
    decimals: 18,
    rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
    blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
    type: null,
    vmType: "EVM",
  },
  xdc: {
    contractAddress: null,
    chainId: 50,
    name: "XDC Blockchain",
    symbol: "XDC",
    decimals: 18,
    rpcUrls: ["https://rpc.xinfin.network"],
    blockExplorerUrls: ["https://explorer.xinfin.network"],
    type: null,
    vmType: "EVM",
  },
  evmos: {
    contractAddress: null,
    chainId: 9001,
    name: "EVMOS",
    symbol: "EVMOS",
    decimals: 18,
    rpcUrls: ["https://eth.bd.evmos.org:8545"],
    blockExplorerUrls: ["https://evm.evmos.org"],
    type: null,
    vmType: "EVM",
  },
  evmosTestnet: {
    contractAddress: null,
    chainId: 9000,
    name: "EVMOS Testnet",
    symbol: "EVMOS",
    decimals: 18,
    rpcUrls: ["https://eth.bd.evmos.dev:8545"],
    blockExplorerUrls: ["https://evm.evmos.dev"],
    type: null,
    vmType: "EVM",
  },
};

// Helper functions

async function getLitClient() {
  console.log("Lit!")
  const client = new LitJsSdk.LitNodeClient();
  await client.connect();
  window.litNodeClient = client;
  console.log("Lit client connected", client);
  console.log("Window.litNodeClient", window.litNodeClient);

  const chain = "ethereum";
  console.log("Chain", chain);

  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: chain,
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "1000000000000", // 0.000001 ETH
      },
    },
  ];

  const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: chain });
  console.log("AuthSig", authSig)
}



async function connectWeb3({ chainId = 1 } = {}) {
  const rpcUrls: any = {};
  // need to make it look like this:
  // rpc: {
  //   1: "https://mainnet.mycustomnode.com",
  //   3: "https://ropsten.mycustomnode.com",
  //   100: "https://dai.poa.network",
  //   // ...
  // },

  for (let i = 0; i < Object.keys(LIT_CHAINS).length; i++) {
    const chainName = Object.keys(LIT_CHAINS)[i];
    const chainId = LIT_CHAINS[chainName].chainId;
    const rpcUrl = LIT_CHAINS[chainName].rpcUrls[0];
    rpcUrls[chainId] = rpcUrl;
  }

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "cd614bfa5c2f4703b7ab0ec0547d9f81",
        rpc: rpcUrls,
        chainId,
      },
    },
  };

  console.log("getting provider via lit connect modal");
  // const dialog = new LitConnectModal({
  //   providerOptions,
  // });
  // console.log("got provider via lit connect modal");
  // const provider = await dialog.getWalletProvider();

  const provider: any = new ethers.providers.Web3Provider(window.ethereum, "any")

  console.log("got provider", provider);
  // const web3 = new Web3Provider(provider);
  const web3 = provider;

  // const provider = await detectEthereumProvider();
  // const web3 = new Web3Provider(provider);

  // trigger metamask popup
  // await provider.enable();
  await provider.send("eth_requestAccounts", []);

  console.log("listing accounts");
  const accounts = await web3.listAccounts();
  // const accounts = await provider.request({
  //   method: "eth_requestAccounts",
  //   params: [],
  // });
  console.log("accounts", accounts);
  const account = accounts[0].toLowerCase();

  return { web3, account };
}

/**
 * Sign the auth message with the user's wallet, and store it in localStorage.  Called by checkAndSignAuthMessage if the user does not have a signature stored.
 * @param {Object} params
 * @param {Web3Provider} params.web3 An ethers.js Web3Provider instance
 * @param {string} params.account The account to sign the message with
 * @returns {AuthSig} The AuthSig created or retrieved
 */
 export async function signAndSaveAuthMessage({
  web3,
  account,
  chainId,
  resources,
}: any) {
  // const { chainId } = await web3.getNetwork();

  const preparedMessage = {
    domain: globalThis.location.host,
    address: getAddress(account), // convert to EIP-55 format or else SIWE complains
    uri: globalThis.location.origin,
    version: "1",
    chainId,
  };

  if (resources && resources.length > 0) {
    preparedMessage.resources = resources;
  }

  const message = new SiweMessage(preparedMessage);

  const body = message.prepareMessage();

  const signedResult = await signMessage({
    body,
    web3,
    account,
  });

  const authSig = {
    sig: signedResult.signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: body,
    address: signedResult.address,
  };

  localStorage.setItem("lit-auth-signature", JSON.stringify(authSig));
  // store a keypair in localstorage for communication with sgx
  const commsKeyPair = nacl.box.keyPair();
  localStorage.setItem(
    "lit-comms-keypair",
    JSON.stringify({
      publicKey: naclUtil.encodeBase64(commsKeyPair.publicKey),
      secretKey: naclUtil.encodeBase64(commsKeyPair.secretKey),
    })
  );
  log("generated and saved lit-comms-keypair");
  return authSig;
}


async function checkAndSignEVMAuthMessage({
  chain,
  resources,
  switchChain,
}: any) {
  const selectedChain = LIT_CHAINS[chain];
  const { web3, account } = await connectWeb3({
    chainId: selectedChain.chainId,
  });
  console.log(`got web3 and account: ${account}`);

  let chainId;
  try {
    const resp = await web3.getNetwork();
    chainId = resp.chainId;
  } catch (e) {
    // couldn't get chainId.  throw the incorrect network error
    console.log("getNetwork threw an exception", e);
    throwError({
      message: `Incorrect network selected.  Please switch to the ${chain} network in your wallet and try again.`,
      name: "WrongNetworkException",
      errorCode: "wrong_network",
    });
  }
  let selectedChainId = "0x" + selectedChain.chainId.toString("16");
  console.log("chainId from web3", chainId);
  console.log(
    `checkAndSignAuthMessage with chainId ${chainId} and chain set to ${chain} and selectedChain is `,
    selectedChain
  );
  if (chainId !== selectedChain.chainId && switchChain) {
    if (web3.provider instanceof WalletConnectProvider) {
      // this chain switching won't work.  alert the user that they need to switch chains manually
      throwError({
        message: `Incorrect network selected.  Please switch to the ${chain} network in your wallet and try again.`,
        name: "WrongNetworkException",
        errorCode: "wrong_network",
      });
      return;
    }
    try {
      console.log("trying to switch to chainId", selectedChainId);
      await web3.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: selectedChainId }],
      });
    } catch (switchError) {
      console.log("error switching to chainId", switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          const data = [
            {
              chainId: selectedChainId,
              chainName: selectedChain.name,
              nativeCurrency: {
                name: selectedChain.name,
                symbol: selectedChain.symbol,
                decimals: selectedChain.decimals,
              },
              rpcUrls: selectedChain.rpcUrls,
              blockExplorerUrls: selectedChain.blockExplorerUrls,
            },
          ];
          await web3.provider.request({
            method: "wallet_addEthereumChain",
            params: data,
          });
        } catch (addError) {
          // handle "add" error
          if (addError.code === -32601) {
            // metamask code indicating "no such method"
            throwError({
              message: `Incorrect network selected.  Please switch to the ${chain} network in your wallet and try again.`,
              name: "WrongNetworkException",
              errorCode: "wrong_network",
            });
          } else {
            throw addError;
          }
        }
      } else {
        if (switchError.code === -32601) {
          // metamask code indicating "no such method"
          throwError({
            message: `Incorrect network selected.  Please switch to the ${chain} network in your wallet and try again.`,
            name: "WrongNetworkException",
            errorCode: "wrong_network",
          });
        } else {
          throw switchError;
        }
      }
    }
    // we may have switched the chain to the selected chain.  set the chainId accordingly
    chainId = selectedChain.chainId;
  }
  console.log("checking if sig is in local storage");
  let authSig: any = localStorage.getItem("lit-auth-signature");
  if (!authSig) {
    console.log("signing auth message because sig is not in local storage");
    await signAndSaveAuthMessage({
      web3,
      account,
      chainId,
      resources,
    });
    authSig = localStorage.getItem("lit-auth-signature");
  }
  authSig = JSON.parse(authSig);
  // make sure we are on the right account
  if (account !== authSig.address) {
    console.log(
      "signing auth message because account is not the same as the address in the auth sig"
    );
    await signAndSaveAuthMessage({
      web3,
      account,
      chainId: selectedChain.chainId,
      resources,
    });
    authSig = localStorage.getItem("lit-auth-signature");
    authSig = JSON.parse(authSig);
  } else {
    // check the resources of the sig and re-sign if they don't match
    let mustResign = false;
    try {
      const parsedSiwe = new SiweMessage(authSig.signedMessage);
      console.log("parsedSiwe.resources", parsedSiwe.resources);

      if (JSON.stringify(parsedSiwe.resources) !== JSON.stringify(resources)) {
        console.log(
          "signing auth message because resources differ from the resources in the auth sig"
        );
        mustResign = true;
      } else if (parsedSiwe.address !== getAddress(parsedSiwe.address)) {
        console.log(
          "signing auth message because parsedSig.address is not equal to the same address but checksummed.  This usually means the user had a non-checksummed address saved and so they need to re-sign."
        );
        mustResign = true;
      }
    } catch (e) {
      console.log("error parsing siwe sig.  making the user sign again: ", e);
      mustResign = true;
    }
    if (mustResign) {
      await signAndSaveAuthMessage({
        web3,
        account,
        chainId: selectedChain.chainId,
        resources,
      });
      authSig = localStorage.getItem("lit-auth-signature");
      authSig = JSON.parse(authSig);
    }
  }
  console.log("got auth sig", authSig);
  return authSig;
}

async function checkAndSignAuthMessage({
  chain,
  resources,
  switchChain = true,
}: any) {
  return checkAndSignEVMAuthMessage({ chain, resources, switchChain });
}



// End Helper function






// Set up the middleware stack
async function getAuthSig() {
  const authSig = await checkAndSignAuthMessage({chain: 'polygon'});
  window.authSig = authSig;
  return authSig
}

async function getClient() {
  const litNodeClient = new LitJsSdk.LitNodeClient();
  await litNodeClient.connect();
  window.litNodeClient = litNodeClient;

  return litNodeClient
}


async function encrypt() {
  const litNodeClient = await getClient();
  window.accessControlConditions = [
    {
      contractAddress: '0x68085453B798adf9C09AD8861e0F0da96B908d81',
      standardContractType: "ERC1155",
      chain: "polygon",
      method: "balanceOf",
      parameters: [":userAddress", '0', '1', '2', '3', '4', '5' ],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
  console.log("getting authSig");
  const authSig = await getAuthSig();
  console.log("got authSig ", authSig);
  const accessControlConditions = window.accessControlConditions;
  const chain = "polygon";

  // encrypting content -> this we can change to our own content
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    "this is a secret message"
  );
  // saving encrypted content to Lit Node
  const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });

  return {
    encryptedString,
    encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
  }
}


async function decrypt(encryptedString: string, encryptedSymmetricKey: string) {
  const litNodeClient = await getClient();

  const authSig = await getAuthSig();

  const chain = "polygon";
  window.accessControlConditions = [
    {
      contractAddress: '0x68085453B798adf9C09AD8861e0F0da96B908d81',
      standardContractType: "ERC1155",
      chain: "polygon",
      method: "balanceOf",
      parameters: [":userAddress", '0', '1', '2', '3', '4', '5' ],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    },
  ];
  const accessControlConditions = window.accessControlConditions;

  const symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt: encryptedSymmetricKey,
    chain,
    authSig
  })

  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    symmetricKey
  );

  return { decryptedString }
}
// End Lit Protocol Integration



/**
 * This is a React-based component template. The `render()` function is called
 * automatically when your component should be re-rendered.
 */
class WalletConnect extends StreamlitComponentBase<State> {
  public state = { walletAddress: "not", transaction: "", isFocused: false, encryptedString: "", encryptedSymmetricKey: "", decryptedString: "" };

  public render = (): ReactNode => {
    // Arguments that are passed to the plugin in Python are accessible
    // via `this.props.args`. Here, we access the "name" arg.

    // Streamlit sends us a theme object via props that we can use to ensure
    // that our component has visuals that match the active theme in a
    // streamlit app.
    const { theme } = this.props
    const style: React.CSSProperties = {}

    // Maintain compatibility with older versions of Streamlit that don't send
    // a theme object.
    if (theme) {
      // Use the theme object to style our button border. Alternatively, the
      // theme style is defined in CSS vars.
      const borderStyling = `0px solid ${
        this.state.isFocused ? theme.primaryColor : "gray"
      }`
      style.border = borderStyling
      style.outline = borderStyling
      style.backgroundColor = "#FF4B4B"
      style.color = "white"
      style.borderRadius = "0.2rem"
    }

    const message = this.props.args["message"]
    // Show a button and some text.
    // When the button is clicked, we'll increment our "numClicks" state
    // variable, and send its new value back to Streamlit, where it'll
    // be available to the Python program.
    return (
      <span>
        <button
          style={style}
          onClick={this.onClicked}
          disabled={this.props.disabled}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
        >
          {message}
        </button>
      </span>
    )
  }

  /** Click handler for our "Click Me!" button. */
  private onClicked = async (): Promise<void> => {
    if (this.props.args["key"] === "wallet") {
    const address = await getAccount()
    this.setState(
      () => ({ walletAddress: address }),
      () => Streamlit.setComponentValue(this.state.walletAddress)
    )
    } else if (this.props.args["key"] === "send") {
      const tx: any = await sendToken(this.props.args["to_address"], this.props.args["amount"], this.props.args["contract_address"])
      // const tx: any = await send_token(this.props.args["contract_address"], this.props.args["amount"], this.props.args["to_address"])
      // const tx = await sendFixedPayment(String(this.props.args["amount"]), this.props.args["to"])
      this.setState(
        () => ({ transaction: tx }),
        () => Streamlit.setComponentValue(this.state.transaction)
      )
    } else if (this.props.args["key"] === "encrypt") {
      // const { encryptedString, encryptedSymmetricKey } = await encrypt()
      const sth = await connectWeb3()
      console.log("Connected Web3", sth)
      // this.setState(
      //   () => ({ encryptedString: encryptedString, encryptedSymmetricKey: encryptedSymmetricKey }),
      //   () => Streamlit.setComponentValue({ encryptedString, encryptedSymmetricKey })
      // )
    } else if (this.props.args["key"] === "decrypt") {
      const { decryptedString } = await decrypt(this.state.encryptedString, this.state.encryptedSymmetricKey)
      this.setState(
        () => ({ decryptedString: decryptedString }),
        () => Streamlit.setComponentValue(decryptedString)
      )
    }
    // Increment state.numClicks, and pass the new value back to
    // Streamlit via `Streamlit.setComponentValue`.
  }

  /** Focus handler for our "Click Me!" button. */
  private _onFocus = (): void => {
    this.setState({ isFocused: true })
  }

  /** Blur handler for our "Click Me!" button. */
  private _onBlur = (): void => {
    this.setState({ isFocused: false })
  }
}

// "withStreamlitConnection" is a wrapper function. It bootstraps the
// connection between your component and the Streamlit app, and handles
// passing arguments from Python -> Component.
//
// You don't need to edit withStreamlitConnection (but you're welcome to!).
export default withStreamlitConnection(WalletConnect)
