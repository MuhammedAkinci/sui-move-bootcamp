import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT: use the `package_id::hero::mint_hero` function
 * * minting a Sword NFT: use the `package_id::blacksmith::new_sword` function
 * * attaching the Sword to the Hero: use the `package_id::hero::equip_sword` function
 * * transferring the Hero to the signer
 */
export const mintHeroWithSword =
  async (): Promise<SuiTransactionBlockResponse> => {
     const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });
     const signerAddress = getAddress({ secretKey: ENV.USER_SECRET_KEY });
    // TODO: Implement this function
    // 1. initialize the transaction
    // 2. call `${ENV.PACKAGE_ID}::hero::mint_hero` target and mint the hero 
    // 3. same for the sword with blacksmith::new_swrod (this function needs the hero as an argument)
    // 4. equip the sword to the hero with hero::equip_sword
    // 5. transfer the hero to the signer with hero::transfer_hero -> "${getAddress({ secretKey: ENV.USERSECRET_KEY })}"
    // 6. sign and execute the transaction with suiClient.signAndExecuteTransaction
    // 7. wait for the transaction to be executed with suiClient.waitForTransaction
    // 8. return the transaction response
    // Bonus: In the above process, add "showEffects, showObjectChanges" to true in the options section

    const tx = new Transaction();
    const hero = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::mint_hero`,
    });
    const sword = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::blacksmith::new_sword`,
      arguments: [ tx.pure.u64(10)]
    });
    tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::equip_sword`,
      arguments: [hero, sword],
    });

    // tx.moveCall({
    //   target: `${ENV.PACKAGE_ID}::hero::transfer_hero`,
    //   arguments: [
    //     hero,
    //     tx.pure.address(getAddress({ secretKey: ENV.USER_SECRET_KEY })),
    //   ],
    // });  -> If we want to use moveCall, there should be a function related to this here.move file

    tx.transferObjects([hero], signerAddress);
    return suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer,
      options: {
        showObjectChanges: true,
        showEffects: true,
      },

    });
    // const signer = getSigner({ secretKey: ENV.USER_SECRET_KEY });
    // const result = await suiClient.signAndExecuteTransaction({
    //   transaction: tx,
    //   options: {
    //     showObjectChanges: true,
    //     showEffects: true,
    //   },
    //   signer: signer,
    // });
    // await suiClient.waitForTransaction({
    //   digest: result.digest,
    // });
    // return {} as SuiTransactionBlockResponse;
  };
