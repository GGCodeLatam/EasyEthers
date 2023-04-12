# EasyEthers

EasyEthers is a lightweight and user-friendly JavaScript library designed to simplify interactions with Ethereum blockchain. Built on top of ethers.js, EasyEthers streamlines wallet management, transaction processing, and message signing to provide a seamless experience for developers working with Ethereum-based applications.

## getProviderUrl

The `getProviderUrl` function returns the appropriate provider URL based on the given provider, API key, and network.

### Parameters

- `provider` (String): The provider to be used. Supported values are `infura`, `alchemy`, and `quicknode`.
- `apiKey` (String): The API key for the chosen provider.
- `network` (Number): The network ID for the target blockchain network.

### Returns

- (String): The provider URL.

### Supported Networks

| Network ID | Network Name                |
| ---------- | --------------------------- |
| 1          | Ethereum Mainnet            |
| 3          | Ropsten Testnet             |
| 4          | Rinkeby Testnet             |
| 5          | Görli Testnet               |
| 42         | Kovan Testnet               |
| 56         | Binance Smart Chain Mainnet |
| 97         | Binance Smart Chain Testnet |
| 100        | xDai Mainnet                |
| 137        | Polygon (Matic) Mainnet     |
| 80001      | Polygon (Matic) Mumbai Testnet |

### Example Usage

```javascript
const providerUrl = getProviderUrl("infura", "your_infura_api_key", 1);
console.log(providerUrl); // https://mainnet.infura.io/v3/your_infura_api_key
```

## createWalletConnectProvider

The `createWalletConnectProvider` function creates and returns a WalletConnect provider instance for the specified blockchain network.

### Parameters

- `rpcUrl` (String): The RPC URL for the target blockchain network.
- `chainId` (Number): The network ID for the target blockchain network.

### Returns

- (Promise): Resolves to the WalletConnect provider instance.

### Example Usage

```javascript
(async () => {
  const rpcUrl = getProviderUrl("infura", "your_infura_api_key", 1);
  const walletConnectProvider = await createWalletConnectProvider(rpcUrl, 1);
  console.log(walletConnectProvider);
})();
```

## getConnectedAddress

The `getConnectedAddress` function retrieves the connected Ethereum address from the given provider instance.

### Parameters

- `provider` (Object): A provider instance (e.g., WalletConnect provider or Ethers.js provider).

### Returns

- (Promise): Resolves to the connected Ethereum address as a string.

### Example Usage

```javascript
(async () => {
  const rpcUrl = getProviderUrl("infura", "your_infura_api_key", 1);
  const walletConnectProvider = await createWalletConnectProvider(rpcUrl, 1);
  const connectedAddress = await getConnectedAddress(walletConnectProvider);
  console.log(connectedAddress);
})();
```

## sendTransactionWithWalletConnect

The `sendTransactionWithWalletConnect` function sends a transaction using a WalletConnect provider.

### Parameters

- `provider` (Object): The WalletConnect provider instance created using `createWalletConnectProvider`.
- `toAddress` (String): The Ethereum address of the recipient.
- `amount` (String): The amount to be sent in Ether.
- `gasPrice` (String): The gas price for the transaction in Gwei.
- `gasLimit` (Number): The gas limit for the transaction.

### Returns

- (Promise): Resolves to the transaction hash.

### Example Usage

```javascript
(async () => {
  const rpcUrl = getProviderUrl("infura", "your_infura_api_key", 1);
  const walletConnectProvider = await createWalletConnectProvider(rpcUrl, 1);

  const toAddress = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
  const amount = "0.01";
  const gasPrice = "20";
  const gasLimit = 21000;

  const txHash = await sendTransactionWithWalletConnect(
    walletConnectProvider,
    toAddress,
    amount,
    gasPrice,
    gasLimit
  );
  console.log(txHash);
})();
```

## disconnectWalletConnect

The `disconnectWalletConnect` function disconnects from the WalletConnect provider.

### Parameters

- `provider` (Object): The WalletConnect provider instance to disconnect.

### Returns

- (Promise): Resolves when the provider has been disconnected.

### Example Usage

```javascript
(async () => {
  const rpcUrl = getProviderUrl("infura", "your_infura_api_key", 1);
  const walletConnectProvider = await createWalletConnectProvider(rpcUrl, 1);

  // Disconnect from the WalletConnect provider
  await disconnectWalletConnect(walletConnectProvider);
})();
```

## generateRandomWallet

The `generateRandomWallet` function generates a random Ethereum wallet using the ethers.js library.

### Parameters

None.

### Returns

- (Object): An object containing the generated wallet's address and private key.

  - `address` (String): The wallet's Ethereum address.
  - `privateKey` (String): The wallet's private key.

### Example Usage

```javascript
const randomWallet = generateRandomWallet();
console.log(randomWallet);
// {
//   address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
//   privateKey: '0xf1c9449a5b3e2f8c3b8e3b91b9f9b87db5c1d5dfb88e0a25d869e8a068202d0b'
// }
```

## generateWalletFromSeed

The `generateWalletFromSeed` function generates a wallet from a given secret seed (mnemonic phrase).

### Parameters

- `seed` (String): The secret seed (mnemonic phrase) to generate the wallet from.

### Returns

- (Object): An object containing the wallet's address and private key.

  - `address` (String): The wallet's public address.
  - `privateKey` (String): The wallet's private key.

### Example Usage

```javascript
const seed = "your secret seed words here";
const wallet = generateWalletFromSeed(seed);
console.log(wallet.address); // 0x...
console.log(wallet.privateKey); // 0x...
```

## importWalletFromPrivateKey

The `importWalletFromPrivateKey` function imports a wallet using a given private key.

### Parameters

- `privateKey` (String): The private key for the wallet to be imported.

### Returns

- (Object): An object containing the `address` and `privateKey` of the imported wallet.

### Example Usage

```javascript
const wallet = importWalletFromPrivateKey("0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
console.log(wallet);
// {
//     address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
//     privateKey: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
// }
```

## getBalance

The `getBalance` function retrieves the balance of a specified address.

### Parameters

- `address` (String): The Ethereum address to retrieve the balance for.
- `providerUrl` (String): The provider URL obtained from the `getProviderUrl` function.

### Returns

- (Promise<String>): A promise that resolves to the balance of the specified address in Ether as a string.

### Example Usage

```javascript
(async () => {
    const address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    const providerUrl = getProviderUrl("infura", "your_infura_api_key", 1);
    const balance = await getBalance(address, providerUrl);
    console.log(`Balance: ${balance} ETH`);
})();
```

## sendTransaction

The `sendTransaction` function sends a transaction from one address to another, specifying the amount, gas price, and gas limit.

### Parameters

- `fromPrivateKey` (String): The private key of the sender's wallet.
- `toAddress` (String): The recipient's wallet address.
- `amount` (String): The amount of Ether to be sent (in ETH).
- `gasPrice` (String): The gas price for the transaction (in Gwei).
- `gasLimit` (Number): The gas limit for the transaction.
- `providerUrl` (String): The provider URL to be used for sending the transaction.

### Returns

- (Promise<String>): A promise that resolves to the transaction hash.

### Example Usage

```javascript
(async () => {
    const txHash = await sendTransaction(
        "your_private_key",
        "recipient_address",
        "1", // Amount in ETH
        "50", // Gas price in Gwei
        21000, // Gas limit
        "https://mainnet.infura.io/v3/your_infura_api_key"
    );
    console.log(txHash); // Transaction hash
})();
```

