import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const CreateHeroForm = () => {
    const queryClient = useQueryClient();
    const suiClient = useSuiClient();
    const account = useCurrentAccount();
    const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();
    const [heroName, setHeroName] = useState("");
    const [heroPower, setHeroPower] = useState("");
    const [weaponName, setWeaponName] = useState("");
    const [weaponPower, setWeaponPower] = useState("");

    const handleCreateHero = async () => {
        if (!account?.address) {
            alert("Please connect your wallet first!");
            return;
        }
        const tx = new Transaction();
        const hero = tx.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::hero::new_hero`,
            arguments: [
                tx.pure.string(heroName),
                tx.pure.u64(heroName),
                tx.object(import.meta.env.VITE_HEROES_REGISTRY_ID),
            ],
        });

        const weapon = tx.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::hero::new_weapon`,
            arguments: [
                tx.pure.string(weaponName), 
                tx.pure.u64(weaponPower)
            ],
        });

        tx.moveCall({
            target: `${import.meta.env.VITE_PACKAGE_ID}::hero::equip_weapon`,
            arguments: [hero, weapon],
        });
        tx.transferObjects([hero], account.address);
        
        await signAndExecute ({
            transaction: tx
        }).then(async (resp) =>{
            await suiClient.waitForTransaction({ digest: resp.digest });
            await queryClient.invalidateQueries({
                queryKey: ["testnet", "getOwnedObjects"]
            });
            await queryClient.invalidateQueries({
                queryKey: ["testnet", "getObject"]
            });
            alert("Hero created! Vamoos");
        });
    }

    //return <Button onClick={handleCreateHero}>Mint Hero!</Button>

    return(
        <form onSubmit={handleCreateHero} style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
            <TextField.Root
                placeholder="Hero Name"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                
            />
            <TextField.Root
                placeholder="Hero Power"
                type="number"
                value={heroPower}
                onChange={(e) => setHeroPower(e.target.value)}
            />
            <TextField.Root
                placeholder="Weapon Name"
                value={weaponName}
                onChange={(e) => setWeaponName(e.target.value)}
            />
            <TextField.Root
                placeholder="Weapon Power"
                value={weaponPower}
                onChange={(e) => setWeaponPower(e.target.value)}
            />
            <Button type="submit">Mint Hero!</Button>
        </form>
    );
}