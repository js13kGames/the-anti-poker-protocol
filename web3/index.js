/////////////////////////////////////////////////////
// Web3 Test
/////////////////////////////////////////////////////
var web3;

var canvas;
var cx;
// Buttons
var butC;
var butD;
var butCheck;
var butSend;

var wallet = null;
var recipientAddress = '0x22b60C6ff19b6590216d5a45a96De404cD1897D3';
var sendID = 1;
var nft00 = null;
var sendStatus = null;

const boxSize = 60;
const gap = 20;

// Test badge 00
const nftContractAddress = '0x3daF30d975D51550B4B8d582CDA5d463B5554227';
const tokenIdsToCheck = [0, 1, 2, 3, 4, 5, 6];  // token IDs
var ownedNFTs = [];
var balanceNFTs = [0,0,0,0,0,0,0];

const avalancheTestnetParams = {
    chainId: '0xA869', // Avalanche Fuji Testnet Chain ID (hex)
    chainName: 'Avalanche Fuji Testnet',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
};


window.onload = function() {
    canvas = document.getElementById('cvs');
    cx = canvas.getContext('2d');
    
    butC = document.getElementById('connect').addEventListener('click', connectWallet);
    
    butD = document.getElementById('disconnect').addEventListener('click', disconnectWallet);

    butCheck = document.getElementById('check').addEventListener('click', checkForNFTs);
    butSend = document.getElementById('send').addEventListener('click', sendNFT);

    // render loop
    renderTick();
}

function renderTick() {
    cx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("render tick");
    cx.font = '28px monospace';
    cx.fillStyle = 'white';
    cx.textAlign = 'left';
    cx.fillText('Wallet: ' + wallet, 50, 100);
    cx.font = '20px monospace';
    cx.fillText('NFT Check Status: ' + nft00, 50, 150);
    cx.font = '14px monospace';
    cx.fillText('web3: ' + web3, 50, 500);
    cx.fillText('Test Dispatch Status: ' + sendStatus, 50, 480);

    for (let i = 0; i < 6; i++) {
        const x = 50 + i * (boxSize + gap);
        const y = 200;

        // Draw the box
        if(ownedNFTs.includes(i+1)) {
            cx.fillStyle = 'red';
        } else {
            cx.fillStyle = '#00000055';
        }
        
        cx.fillRect(x, y, boxSize, boxSize);
        cx.fillStyle = 'white';
        cx.font = '20px monospace';
        cx.fillText(balanceNFTs[i+1], x+10, y+20);
        cx.fillText('ID:' + (i+1), x+0, y+80);
    }

    requestAnimationFrame(renderTick);
}

function initializeWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);  // Create web3 instance using window.ethereum
        return true;
    } else {
        alert('Please install MetaMask or another Web3 wallet.');
        return false;
    }
}

function connectWallet() {
    // init and check MM
    if (!initializeWeb3()) {
        console.log("error initializing");
        return null;
    }  

    if(wallet == null & web3 != undefined) {
        connect();
        wallet = 'requesting connection...';
    }
}

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request connect
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Avalanche Testnet check
            const chainId = await web3.eth.getChainId();
            if (chainId !== parseInt(avalancheTestnetParams.chainId, 16)) {
                // Switch network if needed
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: avalancheTestnetParams.chainId }]
                    });
                } catch (switchError) {
                    // Add if not already added to wallet #test this
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [avalancheTestnetParams]
                        });
                    }
                }
            }

            // After successful switch - Connect
            const accounts = await web3.eth.getAccounts();
            wallet = accounts[0];
            console.log('Connected account:', accounts[0]);
            alert('Wallet connected: ' + accounts[0]);

        } catch (error) {
            wallet = "did not connect";
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet');
        }
    } else {
        alert('Please install MetaMask or another Web3 wallet.');
    }
}

function disconnectWallet() {
    if (wallet) {
        // Clear the connected account variable
        wallet = null;
        ownedNFTs = [];
        console.log('Wallet disconnected');
    } else {
        alert('No wallet is connected.');
    }
}

async function checkForNFTs() {
    if (wallet == null) return;
    // Create a new contract instance with web3
    const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);

    nft00 = 'Checking for NFTs...';
    //clear
    ownedNFTs = [];

    // Loop through each token ID specified
    for (const tokenId of tokenIdsToCheck) {
        try {
            // balanceOf - checks how many of the specific token the account owns
            const balance = await nftContract.methods.balanceOf(wallet, tokenId).call();
            
            //check balance, add to ownedNFTs if there is a balance
            if (balance > 0) {
                ownedNFTs.push(tokenId); 
                balanceNFTs[tokenId] = balance;
            }
        } catch (error) {
            nft00 = 'error';
            console.error(`Error checking token ID ${tokenId}:`, error);
        }
    }

    if (ownedNFTs.length > 0) {
        alert(`Wallet owns NFTs with token IDs: ${ownedNFTs.join(', ')}`);
        nft00 = 'Tokens found!';
        console.log("found NFTs with IDs: " + ownedNFTs);
    } else {
        nft00 = 'No specified NFTs found';
        alert('No specified NFTs found in the wallet.');
    }
}


//For Server Backend
async function sendNFT() {
    if (wallet == null) {
        sendStatus = 'No wallet connected';
        return;
    }
    sendStatus = 'Dispatch requested...';
    // Create a new contract instance with web3
    const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);


    try {
        // Call the safeTransferFrom method to send the NFT with an empty data field
        await nftContract.methods.safeTransferFrom(wallet, recipientAddress, sendID, 1, web3.utils.asciiToHex(''))
            .send({ from: wallet });

        sendStatus = 'Success!';
        alert(`ERC-1155 token with Token ID ${sendID} has been sent to ${recipientAddress}`);
    } catch (error) {
        
        sendStatus = 'Error sending NFT';
        console.error('Error sending NFT:', error);
        alert('Failed to send the NFT.');
    }
}

const nftContractABI = 
    [
        {
          "inputs": [],
          "name": "AccountBalanceOverflow",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "AllowedSeaportCannotBeZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ArrayLengthsMismatch",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            }
          ],
          "name": "CannotExceedMaxSupplyOfUint64",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CreatorPayoutAddressCannotBeZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CreatorPayoutBasisPointsCannotBeZero",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "CreatorPayoutsNotSet",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "DuplicateFeeRecipient",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "DuplicatePayer",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "DuplicateSigner",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "FeeRecipientCannotBeZeroAddress",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "got",
              "type": "address"
            }
          ],
          "name": "FeeRecipientNotAllowed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "FeeRecipientNotPresent",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InsufficientBalance",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "caller",
              "type": "address"
            }
          ],
          "name": "InvalidCallerOnlyAllowedSeaport",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "totalReceivedBasisPoints",
              "type": "uint256"
            }
          ],
          "name": "InvalidCreatorPayoutBasisPoints",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "totalReceivedBasisPoints",
              "type": "uint256"
            }
          ],
          "name": "InvalidCreatorPayoutTotalBasisPoints",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "version",
              "type": "uint8"
            }
          ],
          "name": "InvalidExtraDataEncoding",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "feeBps",
              "type": "uint256"
            }
          ],
          "name": "InvalidFeeBps",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "fromTokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "toTokenId",
              "type": "uint256"
            }
          ],
          "name": "InvalidFromAndToTokenId",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "InvalidProof",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedEndTime",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimumOrMaximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedFeeBps",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedFromTokenId",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedMaxTokenSupplyForStage",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedMaxTotalMintableByWallet",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedMaxTotalMintableByWalletPerToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "paymentToken",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedMintPrice",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "got",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "want",
              "type": "address"
            }
          ],
          "name": "InvalidSignedPaymentToken",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minimum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedStartTime",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "got",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maximum",
              "type": "uint256"
            }
          ],
          "name": "InvalidSignedToTokenId",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            }
          ],
          "name": "InvalidStartAndEndTime",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "substandard",
              "type": "uint8"
            }
          ],
          "name": "InvalidSubstandard",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "MaxSupplyMismatch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "MintAmountsMismatch",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "total",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxSupply",
              "type": "uint256"
            }
          ],
          "name": "MintExceedsMaxSupply",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "total",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "allowed",
              "type": "uint256"
            }
          ],
          "name": "MintQuantityExceedsMaxMintedPerWallet",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "total",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "allowed",
              "type": "uint256"
            }
          ],
          "name": "MintQuantityExceedsMaxMintedPerWalletForTokenId",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "total",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxSupply",
              "type": "uint256"
            }
          ],
          "name": "MintQuantityExceedsMaxSupply",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "total",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxTokenSupplyForStage",
              "type": "uint256"
            }
          ],
          "name": "MintQuantityExceedsMaxTokenSupplyForStage",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "MustSpecifyERC1155ConsiderationItemForSeaDropMint",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NewOwnerIsZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoBalanceToWithdraw",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NoHandoverRequest",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "currentTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTimestamp",
              "type": "uint256"
            }
          ],
          "name": "NotActive",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "NotOwnerNorApproved",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "OfferContainsDuplicateTokenId",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "OnlyDelegateCalled",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PayerCannotBeZeroAddress",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "got",
              "type": "address"
            }
          ],
          "name": "PayerNotAllowed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PayerNotPresent",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ProvenanceHashCannotBeSetAfterAlreadyBeingSet",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "ProvenanceHashCannotBeSetAfterMintStarted",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PublicDropStageNotPresent",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "PublicDropsMismatch",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "RoyaltyOverflow",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "RoyaltyReceiverIsZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "SameTransferValidator",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "SignatureAlreadyUsed",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "SignedMintsMustRestrictFeeRecipients",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "SignerCannotBeZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "SignerNotPresent",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTokenId",
              "type": "uint256"
            }
          ],
          "name": "TokenIdNotWithinDropStageRange",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TransferToNonERC1155ReceiverImplementer",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "TransferToZeroAddress",
          "type": "error"
        },
        {
          "inputs": [],
          "name": "Unauthorized",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "uint8",
              "name": "version",
              "type": "uint8"
            }
          ],
          "name": "UnsupportedExtraDataVersion",
          "type": "error"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "selector",
              "type": "bytes4"
            }
          ],
          "name": "UnsupportedFunctionSelector",
          "type": "error"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "previousMerkleRoot",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "internalType": "bytes32",
              "name": "newMerkleRoot",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "string[]",
              "name": "publicKeyURI",
              "type": "string[]"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "allowListURI",
              "type": "string"
            }
          ],
          "name": "AllowListUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "feeRecipient",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bool",
              "name": "allowed",
              "type": "bool"
            }
          ],
          "name": "AllowedFeeRecipientUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address[]",
              "name": "allowedSeaport",
              "type": "address[]"
            }
          ],
          "name": "AllowedSeaportUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "bool",
              "name": "isApproved",
              "type": "bool"
            }
          ],
          "name": "ApprovalForAll",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_fromTokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "_toTokenId",
              "type": "uint256"
            }
          ],
          "name": "BatchMetadataUpdate",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "newContractURI",
              "type": "string"
            }
          ],
          "name": "ContractURIUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "payoutAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint16",
                  "name": "basisPoints",
                  "type": "uint16"
                }
              ],
              "indexed": false,
              "internalType": "struct CreatorPayout[]",
              "name": "creatorPayouts",
              "type": "tuple[]"
            }
          ],
          "name": "CreatorPayoutsUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "newDropURI",
              "type": "string"
            }
          ],
          "name": "DropURIUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint8",
              "name": "version",
              "type": "uint8"
            }
          ],
          "name": "Initialized",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "newMaxSupply",
              "type": "uint256"
            }
          ],
          "name": "MaxSupplyUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "pendingOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipHandoverCanceled",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "pendingOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipHandoverRequested",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "oldOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "payer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bool",
              "name": "allowed",
              "type": "bool"
            }
          ],
          "name": "PayerUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "previousHash",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "internalType": "bytes32",
              "name": "newHash",
              "type": "bytes32"
            }
          ],
          "name": "ProvenanceHashUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "components": [
                {
                  "internalType": "uint80",
                  "name": "startPrice",
                  "type": "uint80"
                },
                {
                  "internalType": "uint80",
                  "name": "endPrice",
                  "type": "uint80"
                },
                {
                  "internalType": "uint40",
                  "name": "startTime",
                  "type": "uint40"
                },
                {
                  "internalType": "uint40",
                  "name": "endTime",
                  "type": "uint40"
                },
                {
                  "internalType": "bool",
                  "name": "restrictFeeRecipients",
                  "type": "bool"
                },
                {
                  "internalType": "address",
                  "name": "paymentToken",
                  "type": "address"
                },
                {
                  "internalType": "uint24",
                  "name": "fromTokenId",
                  "type": "uint24"
                },
                {
                  "internalType": "uint24",
                  "name": "toTokenId",
                  "type": "uint24"
                },
                {
                  "internalType": "uint16",
                  "name": "maxTotalMintableByWallet",
                  "type": "uint16"
                },
                {
                  "internalType": "uint16",
                  "name": "maxTotalMintableByWalletPerToken",
                  "type": "uint16"
                },
                {
                  "internalType": "uint16",
                  "name": "feeBps",
                  "type": "uint16"
                }
              ],
              "indexed": false,
              "internalType": "struct PublicDrop",
              "name": "publicDrop",
              "type": "tuple"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "index",
              "type": "uint256"
            }
          ],
          "name": "PublicDropUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "basisPoints",
              "type": "uint256"
            }
          ],
          "name": "RoyaltyInfoUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "payer",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "dropStageIndex",
              "type": "uint256"
            }
          ],
          "name": "SeaDropMint",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "enum SeaDropErrorsAndEvents.SEADROP_TOKEN_TYPE",
              "name": "tokenType",
              "type": "uint8"
            }
          ],
          "name": "SeaDropTokenDeployed",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "signer",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "bool",
              "name": "allowed",
              "type": "bool"
            }
          ],
          "name": "SignerUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256[]",
              "name": "ids",
              "type": "uint256[]"
            },
            {
              "indexed": false,
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
            }
          ],
          "name": "TransferBatch",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "TransferSingle",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "address",
              "name": "oldValidator",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "newValidator",
              "type": "address"
            }
          ],
          "name": "TransferValidatorUpdated",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "value",
              "type": "string"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "URI",
          "type": "event"
        },
        {
          "stateMutability": "nonpayable",
          "type": "fallback"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "result",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address[]",
              "name": "owners",
              "type": "address[]"
            },
            {
              "internalType": "uint256[]",
              "name": "ids",
              "type": "uint256[]"
            }
          ],
          "name": "balanceOfBatch",
          "outputs": [
            {
              "internalType": "uint256[]",
              "name": "balances",
              "type": "uint256[]"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "baseURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "uint256[]",
              "name": "ids",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
            }
          ],
          "name": "batchBurn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "cancelOwnershipHandover",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "pendingOwner",
              "type": "address"
            }
          ],
          "name": "completeOwnershipHandover",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "contractURI",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "fromTokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "toTokenId",
              "type": "uint256"
            }
          ],
          "name": "emitBatchMetadataUpdate",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTransferValidationFunction",
          "outputs": [
            {
              "internalType": "bytes4",
              "name": "functionSignature",
              "type": "bytes4"
            },
            {
              "internalType": "bool",
              "name": "isViewFunction",
              "type": "bool"
            }
          ],
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getTransferValidator",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "allowedConfigurer",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "allowedSeaport",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "name_",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "symbol_",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "initialOwner",
              "type": "address"
            }
          ],
          "name": "initialize",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            }
          ],
          "name": "isApprovedForAll",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "maxSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "name",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "owner",
          "outputs": [
            {
              "internalType": "address",
              "name": "result",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "pendingOwner",
              "type": "address"
            }
          ],
          "name": "ownershipHandoverExpiresAt",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "result",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "ownershipHandoverValidFor",
          "outputs": [
            {
              "internalType": "uint64",
              "name": "",
              "type": "uint64"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "provenanceHash",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "renounceOwnership",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "requestOwnershipHandover",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "salePrice",
              "type": "uint256"
            }
          ],
          "name": "royaltyInfo",
          "outputs": [
            {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "royaltyAmount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256[]",
              "name": "ids",
              "type": "uint256[]"
            },
            {
              "internalType": "uint256[]",
              "name": "amounts",
              "type": "uint256[]"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "safeBatchTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "safeTransferFrom",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "operator",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "isApproved",
              "type": "bool"
            }
          ],
          "name": "setApprovalForAll",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "newBaseURI",
              "type": "string"
            }
          ],
          "name": "setBaseURI",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "newContractURI",
              "type": "string"
            }
          ],
          "name": "setContractURI",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            },
            {
              "internalType": "uint96",
              "name": "feeNumerator",
              "type": "uint96"
            }
          ],
          "name": "setDefaultRoyalty",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "newMaxSupply",
              "type": "uint256"
            }
          ],
          "name": "setMaxSupply",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "newProvenanceHash",
              "type": "bytes32"
            }
          ],
          "name": "setProvenanceHash",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newValidator",
              "type": "address"
            }
          ],
          "name": "setTransferValidator",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "bytes4",
              "name": "interfaceId",
              "type": "bytes4"
            }
          ],
          "name": "supportsInterface",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "symbol",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "totalMinted",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            }
          ],
          "name": "totalSupply",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "uri",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
    ]
