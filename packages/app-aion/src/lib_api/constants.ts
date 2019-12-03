/**
 * @hidden
 */
export const CONTRACT_ABI = [
    {
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        constant: true,
        payable: false,
        inputs: [],
        name: "name",
        type: "function"
    },
    {
        outputs: [
            {
                name: "",
                type: "uint8"
            }
        ],
        constant: true,
        payable: false,
        inputs: [],
        name: "decimals",
        type: "function"
    },
    {
        outputs: [
            {
                name: "",
                type: "uint128"
            }
        ],
        constant: true,
        payable: false,
        inputs: [],
        name: "totalSupply",
        type: "function"
    },
    {
        outputs: [
            {
                name: "",
                type: "string"
            }
        ],
        constant: true,
        payable: false,
        inputs: [],
        name: "symbol",
        type: "function"
    },
    {
        outputs: [{ name: "", type: "uint128" }],
        constant: true,
        payable: false,
        inputs: [],
        name: "granularity",
        type: "function"
    },
    {
        outputs: [
            {
                name: "",
                type: "uint128"
            }
        ],
        constant: true,
        payable: false,
        inputs: [
            {
                name: "_tokenHolder",
                type: "address"
            }
        ],
        name: "balanceOf",
        type: "function"
    },
    {
        outputs: [],
        constant: false,
        payable: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_amount", type: "uint128" },
            { name: "_userData", type: "bytes" }
        ],
        name: "send",
        type: "function"
    },

    {
        outputs: [],
        constant: false,
        payable: false,
        inputs: [
            { name: "_from", type: "address" },
            { name: "_to", type: "address" },
            { name: "_amount", type: "uint128" },
            { name: "_userData", type: "bytes" },
            { name: "_operatorData", type: "bytes" }
        ],
        name: "operatorSend",
        type: "function"
    },
    {
        outputs: [{ name: "success", type: "bool" }],
        constant: false,
        payable: false,
        inputs: [
            { name: "_to", type: "address" },
            { name: "_amount", type: "uint128" }
        ],
        name: "transfer",
        type: "function"
    }
];
