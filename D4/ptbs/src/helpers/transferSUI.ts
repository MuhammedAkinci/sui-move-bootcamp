import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";

interface Args {
  amount: number;
  senderSecretKey: string;
  recipientAddress: string;
}

/**
 * Transfers the specified amount of SUI from the sender secret key to the recipient address.
 * Returns the transaction response, as it is returned by the SDK.
 */
export const transferSUI = async ({
  amount,
  senderSecretKey,
  recipientAddress,
}: Args): Promise<SuiTransactionBlockResponse> => {
  const tx = new Transaction();
  
  // TODO: Add the commands to the transaction
  // const [coin] = tx.splitCoins(tx.object("0x92b46e80778a7e464bd26badad302117ea3b5b7a163df4fd89781816f0fbf492"), [amount]); -> different way 

  const [coin] = tx.splitCoins(tx.gas, [amount]);
  tx.transferObjects([coin], recipientAddress);

  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: senderSecretKey }),
    options: {
      showEffects: true,
      showBalanceChanges: true,
    },
  });
};
