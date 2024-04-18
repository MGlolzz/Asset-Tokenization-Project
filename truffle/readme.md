# Contracts Overview

## TokenSale Contract
- **Functionality**: Allows users to send money to purchase tokens. The token, named "Starbuck" (symbol "STAR"), is priced at 1 wei per token, establishing a rate of 1.
- **Initialization**: Requires addresses of the KYC (Know Your Customer) and Token contracts upon initialization for compliance and token management.
- **Inheritance**: Derives from the `MintedCrowdsale` contract and includes both `Crowdsale` and `MintedCrowdsale` in its constructor to manage the token selling and minting processes.

## Token Contract
- **Query Balance**: Users can check their token balance using the `balanceOf` function.
- **Functionality**: Extends `ERC20Mintable` contract, enabling it to utilize the `mint()` function to issue new tokens as authorized.

## ERC20Mintable Contract
- **Minting Function**: Implements the `_mint()` function from `ERC20`, restricted to authorized minters through the `onlyMinter` modifier.
- **Inheritance**: Inherits from `MinterRole` and `ERC20`, combining role-based permissions with standard token functionalities.

## Role Contract
- **Purpose**: Manages roles within contracts through a Solidity library.
- **Structure**: Contains a `Role` struct with a mapping to track which addresses hold specific roles.
- **Role Management Functions**:
  - **Add**: Ensures an account does not already possess a role before adding it.
  - **Remove**: Ensures an account holds a role before it is removed.
  - **Has**: Checks if an account has a role, ensuring the account is not a zero address.

### Expanded Explanation on Contracts
- **TokenSale Contract**: Serves as a marketplace for exchanging Ether for STAR tokens at a fixed rate, integrating with a KYC compliance contract to verify all participants.
- **Token Contract**: Functions as a ledger for STAR tokens, facilitating ownership tracking and transactions like transfers and minting. Extending `ERC20Mintable` supports on-demand token creation, subject to minter authorization.
- **ERC20Mintable Contract**: Enables controlled token supply increase, vital for managing token economics during initial offerings or incentivizing participation.
- **Role Contract**: Essential for secure and flexible permission management across various contract functionalities and participant interactions within the blockchain ecosystem.

## Minting Flow Explanation

### Original Minting Flow
1. **Token Contract Constructor**: Initially, the token contract is set up with a specific amount of tokens.
2. **ERC20 Mint Function**: Tokens are minted using the ERC20 standard mint function.
3. **Transfer to TokenSale**: These tokens are then sent to the TokenSale contract.
4. **Crowdsale BuyToken Function**: When a buyer calls this function, it triggers a callback.
5. **SafeTransfer in ERC20Safe**: This function ensures safe token transfer, calling a low-level data transfer function.
6. **Update `balanceOf`**: The `balanceOf` mapping in the ERC20 contract is updated to reflect the new balances.

### New Minting Flow
1. **TokenSale Contract Constructor**: Sets up without an initial token supply.
2. **Callback Function with .sendTransaction in Crowdsale**: Triggers the minting process via a transaction.
3. **Override `_deliverToken` in MintedCrowdsale**: This overridden function handles token delivery by minting.
4. **ERC20Mintable Mint() Function**: Directly calls the `_mint()` function.
5. **Update `balanceOf` Mapping**: The balance is updated in the ERC20 contract, reflecting minted tokens.

These flows highlight the transition from pre-minting tokens for a sale to minting tokens on-demand, aligning token supply more closely with actual demand, enhancing economic efficiency and reducing the risk of over-supply.
