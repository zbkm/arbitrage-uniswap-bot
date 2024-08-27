// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol";

contract MevBot is Ownable, FlashLoanSimpleReceiverBase {

    UniswapRouterV2 public immutable swapRouter;
    mapping(address => bool) public approves;


    constructor(address addressProvider, address _swapRouter) Ownable(msg.sender) FlashLoanSimpleReceiverBase(IPoolAddressesProvider(addressProvider)) {
        swapRouter = UniswapRouterV2(_swapRouter);
    }

    function zook(address token, uint256 amount, bytes calldata data) public onlyOwner {
        POOL.flashLoanSimple(
            address(this),
            token,
            amount,
            data,
            0
        );
    }

    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool)  {
        IERC20 token = IERC20(asset);
        if (!approves[asset]) {
            token.approve(address(swapRouter), type(uint256).max);
            approves[asset] = true;
        }

        UniswapRouterV2.ExactInputParams memory decodedParams = abi.decode(params, (UniswapRouterV2.ExactInputParams));
        uint256 balance = swapRouter.exactInput(decodedParams);
        uint256 totalAmount = amount + premium;
        token.approve(address(POOL), totalAmount);
        token.transfer(msg.sender, balance - totalAmount);
        return true;
    }
}

interface UniswapRouterV2 {
    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);
}
