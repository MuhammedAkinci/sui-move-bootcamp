import { SuiObjectChange, SuiObjectChangeCreated } from "@mysten/sui/client";
import { ENV } from "../env";

interface Args {
  objectChanges: SuiObjectChange[];
}

interface Response {
  swordsIds: string[];
  heroesIds: string[];
}

/**
 * Parses the provided SuiObjectChange[].
 * Extracts the IDs of the created Heroes and Swords NFTs, filtering by objectType.
 */
export const parseCreatedObjectsIds = ({ objectChanges }: Args): Response => {
  // TODO: Implement this function

  // const createdObjects = objectChanges.filter((change) => change.type === "created"); -> different way to filter 1
  const createdObjects = objectChanges.filter(({type}) => type === "created") as SuiObjectChangeCreated[]; 

  // const swordsIds = createdObjects.filter((change) => change.objectType === `${ENV.PACKAGE_ID}::blacksmith::Sword`).map((change) => change.objectId); -> different way to filter 2
  const swords = createdObjects.filter(({objectType}) => objectType === `${ENV.PACKAGE_ID}::blacksmith::Sword`);

  // const heroesIds = createdObjects.filter((objectType) => changeobjectType === `${ENV.PACKAGE_ID}::hero::Hero`).map((change) => change.objectId); -> different way to filter 3
  const heroes = createdObjects.filter(({objectType}) => objectType === `${ENV.PACKAGE_ID}::hero::Hero`);

  const swordsIds = swords.map(({objectId}) => objectId);
  const heroesIds = heroes.map(({objectId}) => objectId);

  return {
    swordsIds,
    heroesIds,
  };
};
