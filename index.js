const ethers = require('ethers');
const IPFS = require('ipfs-http-client');
const WalletConnectProvider = require("@walletconnect/web3-provider").default;

const PROVIDERS = {
    INFURA: 'infura',
    ALCHEMY: 'alchemy',
    QUICKNODE: 'quicknode'
};

// Función que devuelve la URL del proveedor correspondiente
function getProviderUrl(provider, apiKey, network) {
    const networks = {
        1: 'mainnet',      // Ethereum Mainnet
        3: 'ropsten',      // Ropsten Testnet
        4: 'rinkeby',      // Rinkeby Testnet
        5: 'goerli',       // Görli Testnet
        42: 'kovan',       // Kovan Testnet
        56: 'bsc',         // Binance Smart Chain Mainnet
        97: 'bsc-testnet', // Binance Smart Chain Testnet
        100: 'xdai',       // xDai Mainnet
        137: 'matic',      // Polygon (Matic) Mainnet
        80001: 'mumbai'    // Polygon (Matic) Mumbai Testnet
    };

    const networkName = networks[network];

    if (!networkName) {
        throw new Error('Network ID not supported');
    }

    switch (provider) {
        case PROVIDERS.INFURA:
            return `https://${networkName}.infura.io/v3/${apiKey}`;
        case PROVIDERS.ALCHEMY:
            return `https://${networkName}.alchemyapi.io/v2/${apiKey}`;
        case PROVIDERS.QUICKNODE:
            return `https://${networkName}.quiknode.pro/${apiKey}/`;
        default:
            throw new Error('Provider not supported');
    }
}


// Función para crear un proveedor WalletConnect
async function createWalletConnectProvider(rpcUrl, chainId) {
    const provider = new WalletConnectProvider({
        rpc: {
            [chainId]: rpcUrl
        }
    });

    // Conéctate al proveedor WalletConnect
    await provider.enable();

    return provider;
}

// Función para obtener la dirección conectada
async function getConnectedAddress(provider) {
    const accounts = await provider.request({ method: "eth_accounts" });
    return accounts[0];
}

// Función para enviar una transacción con WalletConnect
async function sendTransactionWithWalletConnect(provider, toAddress, amount, gasPrice, gasLimit) {
    const transaction = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice: ethers.utils.parseUnits(gasPrice, "gwei"),
        gasLimit: ethers.BigNumber.from(gasLimit)
    };

    const result = await provider.request({
        method: "eth_sendTransaction",
        params: [transaction]
    });

    return result;
}

// Función para firmar un mensaje con WalletConnect
async function signMessageWithWalletConnect(provider, message) {
    const connectedAddress = await getConnectedAddress(provider);
    const signature = await provider.request({
        method: "personal_sign",
        params: [ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message)), connectedAddress]
    });

    return signature;
}

// Función para desconectar de WalletConnect
async function disconnectWalletConnect(provider) {
    await provider.disconnect();
}


const ipfs = IPFS.create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });

// Función para generar una wallet aleatoria
function generateRandomWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

// Función para generar una wallet a partir de una frase secreta
function generateWalletFromSeed(seed) {
    const wallet = ethers.Wallet.fromMnemonic(seed);
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

// Función para importar billeteras desde una clave privada:
function importWalletFromPrivateKey(privateKey) {
    const wallet = new ethers.Wallet(privateKey);
    return {
        address: wallet.address,
        privateKey: wallet.privateKey
    };
}

// Función para obtener el balance de una dirección
async function getBalance(address, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
}

// Función para enviar una transacción
async function sendTransaction(fromPrivateKey, toAddress, amount, gasPrice, gasLimit, providerUrl) {
    const wallet = new ethers.Wallet(fromPrivateKey);
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const connectedWallet = wallet.connect(provider);

    const transaction = {
        to: toAddress,
        value: ethers.utils.parseEther(amount),
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
        gasLimit: ethers.BigNumber.from(gasLimit)
    };

    const result = await connectedWallet.sendTransaction(transaction);
    return result.hash;
}

// Función para validar una dirección
function isValidAddress(address) {
    return ethers.utils.isAddress(address);
}

// Función para generar una frase secreta
function generateMnemonic() {
    return ethers.utils.entropyToMnemonic(ethers.utils.randomBytes(16));
}

// Función para firmar un mensaje
function signMessage(privateKey, message) {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessage(message);
}

// Función para verificar un mensaje firmado
function verifySignedMessage(message, signature) {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress;
}

// Funcion para estimar el costo de gas para una transacción
async function estimateGas(fromAddress, toAddress, value, data, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const transaction = {
        from: fromAddress,
        to: toAddress,
        value: ethers.utils.parseEther(value),
        data: data
    };
    const gasEstimate = await provider.estimateGas(transaction);
    return gasEstimate;
}

// Funcion obtener el historial de transacciones de una dirección
async function getTransactionHistory(address, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const transactionCount = await provider.getTransactionCount(address);
    const transactions = [];

    for (let i = transactionCount - 1; i >= 0; i--) {
        const transaction = await provider.getTransactionByNonce(address, i);
        transactions.push(transaction);
    }

    return transactions;
}

// Funcion para leer información de contratos inteligentes
async function readContract(contractAddress, abi, functionName, args, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const result = await contract[functionName](...args);
    return result;
}

// Funcion para interactuar con contratos inteligentes (enviar transacciones)
async function interactWithContract(contractAddress, abi, functionName, args, privateKey, gasPrice, gasLimit, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey);
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(contractAddress, abi, connectedWallet);

    const transaction = {
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
        gasLimit: ethers.BigNumber.from(gasLimit)
    };

    const result = await contract[functionName](...args, transaction);
    return result.hash;
}

// Funcion para obtener los NFTs de una dirección
async function getNFTsFromAddress(address, contractAddress, abi, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const balance = await contract.balanceOf(address);
    const nfts = [];

    for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const tokenURI = await contract.tokenURI(tokenId);

        // Suponiendo que el tokenURI apunta a un archivo JSON con los campos requeridos
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        nfts.push({
            tokenId: tokenId.toString(),
            name: metadata.name || 'NFT sin nombre',
            description: metadata.description || 'NFT sin descripción',
            image: metadata.image || 'NFT sin imagen',
            attributes: metadata.attributes || 'NFT sin atributos'
        });
    }

    return nfts;
}
// Funcion para obtener todos los NFTs de una colección
async function getAllNFTsInCollection(contractAddress, abi, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    const totalSupply = await contract.totalSupply();
    const nfts = [];

    for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const tokenURI = await contract.tokenURI(tokenId);

        // Suponiendo que el tokenURI apunta a un archivo JSON con los campos requeridos
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        nfts.push({
            tokenId: tokenId.toString(),
            name: metadata.name || 'NFT sin nombre',
            description: metadata.description || 'NFT sin descripción',
            image: metadata.image || 'NFT sin imagen',
            attributes: metadata.attributes || 'NFT sin atributos'
        });
    }

    return nfts;
}

// Función que ejecuta la función safeMint de un contrato inteligente ERC-721
async function safeMintNFT(contractAddress, abi, toAddress, tokenId, privateKey, providerUrl, gasPrice, gasLimit) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey);
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(contractAddress, abi, connectedWallet);

    const transaction = {
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
        gasLimit: ethers.BigNumber.from(gasLimit)
    };

    const mintTransaction = await contract.safeMint(toAddress, tokenId, transaction);
    const receipt = await mintTransaction.wait();

    return receipt;
}

// Funcion para obtener el ID de la red actual
async function getNetworkId(providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const network = await provider.getNetwork();
    return network.chainId;
}

// Funcion para obtener el número del bloque actual
async function getBlockNumber(providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
}

// Funcion para obtener información sobre una transacción específica por su hash
async function getTransaction(transactionHash, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const transaction = await provider.getTransaction(transactionHash);
    return transaction;
}
// Funcion para esperar a que se confirme una transacción y devolver el recibo
async function waitForTransaction(transactionHash, providerUrl, confirmations = 1) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const receipt = await provider.waitForTransaction(transactionHash, confirmations);
    return receipt;
}

// Función para escuchar eventos de un contrato inteligente
async function listenToContractEvents(contractAddress, abi, eventName, callback, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    contract.on(eventName, (...args) => {
        callback(args);
    });

    return contract;
}

// Ejemplo de uso:
// listenToContractEvents(contractAddress, abi, 'Transfer', (args) => {
//     console.log('Transfer event:', args);
// }, providerUrl);


// Función para obtener el saldo de tokens ERC-20 de una dirección
async function getTokenBalance(address, contractAddress, abi, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const balance = await contract.balanceOf(address);
    return balance;
}

// Función para transferir tokens ERC-20
async function transferTokens(fromPrivateKey, toAddress, amount, contractAddress, abi, gasPrice, gasLimit, providerUrl) {
    const wallet = new ethers.Wallet(fromPrivateKey);
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const connectedWallet = wallet.connect(provider);
    const contract = new ethers.Contract(contractAddress, abi, connectedWallet);

    const transaction = {
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
        gasLimit: ethers.BigNumber.from(gasLimit)
    };

    const result = await contract.transfer(toAddress, amount, transaction);
    return result.hash;
}

// Función para obtener detalles de un bloque específico
async function getBlockDetails(blockNumber, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const block = await provider.getBlock(blockNumber, true);
    return block;
}

// Función para obtener las transacciones en un bloque específico
async function getTransactionsInBlock(blockNumber, providerUrl) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const block = await provider.getBlock(blockNumber, true);
    return block.transactions;
}

// Ejemplo de uso:
// getBlockDetails(13000000, providerUrl).then((block) => {
//     console.log('Block details:', block);
// });

// Función para agregar un archivo a IPFS
async function addFileToIPFS(file) {
    const { path } = await ipfs.add(file);
    return path;
}

// Función para obtener un archivo de IPFS
async function getFileFromIPFS(cid) {
    const stream = ipfs.cat(cid);
    let data = '';

    for await (const chunk of stream) {
        data += chunk.toString();
    }

    return data;
}

// Función para añadir un objeto JSON a IPFS
async function addJSONToIPFS(jsonObj) {
    const cid = await ipfs.add(JSON.stringify(jsonObj));
    return cid.path;
}

// Función para recuperar un objeto JSON de IPFS
async function getJSONFromIPFS(cid) {
    const data = await getFileFromIPFS(cid);
    const jsonObj = JSON.parse(data);
    return jsonObj;
}



module.exports = {
    generateRandomWallet: generateRandomWallet,
    generateWalletFromSeed: generateWalletFromSeed,
    importWalletFromPrivateKey: importWalletFromPrivateKey,
    getBalance: getBalance,
    sendTransaction: sendTransaction,
    isValidAddress: isValidAddress,
    generateMnemonic: generateMnemonic,
    signMessage: signMessage,
    verifySignedMessage: verifySignedMessage,
    estimateGas: estimateGas,
    getTransactionHistory: getTransactionHistory,
    readContract: readContract,
    interactWithContract: interactWithContract,
    getNFTsFromAddress: getNFTsFromAddress,
    getAllNFTsInCollection: getAllNFTsInCollection,
    safeMintNFT: safeMintNFT,
    getNetworkId: getNetworkId,
    getBlockNumber: getBlockNumber,
    getTransaction: getTransaction,
    waitForTransaction: waitForTransaction,
    listenToContractEvents: listenToContractEvents,
    getTokenBalance: getTokenBalance,
    transferTokens: transferTokens,
    getBlockDetails: getBlockDetails,
    getTransactionsInBlock: getTransactionsInBlock,
    addFileToIPFS: addFileToIPFS,
    getFileFromIPFS: getFileFromIPFS,
    addJSONToIPFS: addJSONToIPFS,
    getJSONFromIPFS: getJSONFromIPFS,
    createWalletConnectProvider: createWalletConnectProvider,
    getConnectedAddress: getConnectedAddress,
    sendTransactionWithWalletConnect: sendTransactionWithWalletConnect,
    signMessageWithWalletConnect: signMessageWithWalletConnect,
    disconnectWalletConnect: disconnectWalletConnect,
    getProviderUrl: getProviderUrl
};
