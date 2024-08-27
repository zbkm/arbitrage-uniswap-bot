# Arbitrage Bot Between Different Uniswap Pools

The bot tracks prices in the specified pools and tries to find an arbitrage opportunity. That is, it finds a chain of exchanges, as a result of which, the money will be more than it was initially. Then it takes a loan in AAVE, makes the necessary exchanges and returns the profit to the user.
Try running some of the following tasks:

**Please note**: This is just a concept, in practice the bot is **not profitable**. Could not find enough profitable exchanges on the default pools.

### Instructions
1. Install all dependencies
2. Deploy contract and enter deployed contract address to `.env`
```shell
bun deploy
```
3. And start bot
```shell
bun start
```
