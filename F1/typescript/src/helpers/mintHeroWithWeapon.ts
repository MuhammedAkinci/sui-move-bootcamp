import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { ENV } from "../env";
import { getAddress } from "./getAddress";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";

/**
 * Builds, signs, and executes a transaction for:
 * * minting a Hero NFT
 * * minting a Weapon NFT
 * * attaching the Weapon to the Hero
 * * transferring the Hero to the signer's address
 */
export const mintHeroWithWeapon =
  async (): Promise<SuiTransactionBlockResponse> => {
    // TODO: Implement the function
    // start an transaction
    // Hint: const tx = new Transaction();
    const tx = new Transaction();

    // 1.1 with tx.moveCall, call the `${ENV.PACKAGE_ID}::hero::new_hero`
    // Arguemnts: tx.pure.string("Name"), tx.pure.u64(100), tx.object(ENV.HEROES_REGISTRY_ID)
    // Hint: do not forget! this func return an object, before to say tx.moveCall
    // you can catch with "const hero ? tx.moveCall"
    const hero = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_hero`,
      arguments: [
        tx.pure.string("its makinci"),
        tx.pure.u64(100),
        tx.object(ENV.HEROES_REGISTRY_ID),
      ],
    });

    // 1.2 with tx.moveCall, call the `${ENV.PACKAGE_ID}::hero::new_weapon`
    // Arguemnts: tx.pure.string("Weapon"), tx.pure.u64(100)
    // Hint: do not forget! this func return an object, before to say tx.moveCall
    // you can catch with "const weapon = tx.moveCall"

    const weapon = tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::new_weapon`,
      arguments: [tx.pure.string("El-Dante"), tx.pure.u64(100)],
    });
    
    // 1.3 with tx.moveCall, call the `${ENV.PACKAGE_ID}::hero::equip_weapon`
    // Arguemnts: hero, weapon
    
    tx.moveCall({
      target: `${ENV.PACKAGE_ID}::hero::equip_weapon`,
      arguments: [hero, weapon],
    });

    // 1.4 with tx.transferObjects(<put ur obj here>, <put ur address here>), transfer the hero to the signer's address
    // Hint: give the 'hero' as "[hero]"
    // Hint 2: get the signer's address with "getAddress({ secretKey: ENV.USER_SECRET_KEY })"
    const signerAddress = getAddress({ secretKey: ENV.USER_SECRET_KEY });
    tx.transferObjects([hero], signerAddress);

    return suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
      options: {
        showObjectChanges: true,
        showEffects: true,
      },
    });
    // return {} as SuiTransactionBlockResponse;
  };
