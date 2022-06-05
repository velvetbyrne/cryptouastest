export const jsonABI = [
    [
        {
            "inputs": [],
            "name": "getMessage",
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
                    "internalType": "string",
                    "name": "_message",
                    "type": "string"
                }
            ],
            "name": "setMessage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
]

export const hrABI = [
    "function setMessage(string _message)",
    "function getMessage() view returns (string _message)"
]

export const contractAddress = '0x36A6236337e8d937C434831f06BdD1f03B3641Af'