/* eslint-disable */
import { BigNumber, utils } from 'ethers';
import BalanceTree from './balance-tree';

const { isAddress, getAddress } = utils;

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
export interface MerkleDistributorInfo {
  merkleRoot: string;
  tokenTotal: string;
  claims: {
    [account: string]: {
      index: number;
      salt: string;
      proof: string[];
    };
  };
}

export const saltFromAddress = (address: string) => BigNumber.from(address);

export function parseAccounts(balances: Array<string>): MerkleDistributorInfo {
  // if balances are in an old format, process them

  const dataByAddress = balances.reduce<{
    [address: string]: {
      salt: BigNumber;
    };
  }>((memo, account) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`);
    }
    const parsed = getAddress(account);
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`);

    memo[parsed] = { salt: saltFromAddress(account) };
    return memo;
  }, {});

  const sortedAddresses = Object.keys(dataByAddress).sort();

  // construct a tree
  const tree = new BalanceTree(
    sortedAddresses.map((address) => ({
      account: address,
      salt: dataByAddress[address].salt,
    })),
  );

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: {
      salt: string;
      index: number;
      proof: string[];
      flags?: { [flag: string]: boolean };
    };
  }>((memo, address, index) => {
    const { salt } = dataByAddress[address];
    memo[address] = {
      index,
      salt: salt.toHexString(),
      proof: tree.getProof(index, address, salt),
    };
    return memo;
  }, {});

  const tokenTotal: BigNumber = sortedAddresses.reduce<BigNumber>(
    (memo, key) => memo.add(dataByAddress[key].salt),
    BigNumber.from(0),
  );

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: tokenTotal.toHexString(),
    claims,
  };
}
