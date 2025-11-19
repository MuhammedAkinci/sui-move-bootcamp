import { BalanceChange } from "@mysten/sui/client";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

interface Args {
  balanceChanges: BalanceChange[];
  senderAddress: string;
  recipientAddress: string;
}

interface Response {
  recipientSUIBalanceChange: number;
  senderSUIBalanceChange: number;
}

/**
 * Parses the balance changes as they are returned by the SDK.
 * Filters out and formats the ones that correspond to SUI tokens and to the defined sender and recipient addresses.
 */
export const parseBalanceChanges = ({
  balanceChanges,
  senderAddress,
  recipientAddress,
}: Args): Response => {
  // TODO: Implement the function
  console.log("balanceChanges: ",balanceChanges);
  const rec = balanceChanges.find((balance) => {
    const owner = balance.owner as{
      AddressOwner: string;
    }
    return (
      owner.AddressOwner === recipientAddress &&
      balance.coinType === SUI_TYPE_ARG
      // balance.coinType === "0x2::sui::SUI" -> different way
    )
  })?.amount;
  // console.log("rec: ",rec);

  const sender = balanceChanges.find((balance) => {
    const owner = balance.owner as{
      AddressOwner: string;
    }
    return (
      owner.AddressOwner === senderAddress &&
      balance.coinType === SUI_TYPE_ARG
      // balance.coinType === "0x2::sui::SUI" -> different way
    )
  })?.amount;
  // console.log("rec: ",rec);
  // console.log("sender: ",sender);

  return {
    recipientSUIBalanceChange: rec ? Number(rec) : 0,
    // recipientSUIBalanceChange: rec ? parseInt(rec) : 0, -> different way    
    senderSUIBalanceChange: sender ? Number(sender) : 0,
    // recipientSUIBalanceChange: rec ? parseInt(sender) : 0, -> different way    
  }
};
