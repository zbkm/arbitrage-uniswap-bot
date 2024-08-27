export const EXACT_INPUT_PARAMS_STRUCT =
    [
        {
            components: [
                {
                    name: 'path',
                    type: 'bytes',
                },
                {
                    name: 'recipient',
                    type: 'address',
                },
                {
                    name: 'amountIn',
                    type: 'uint256',
                },
                {
                    name: 'amountOutMinimum',
                    type: 'uint256',
                },
            ],
            name: 'ExactInputParams',
            type: 'tuple',
        },
    ] as const