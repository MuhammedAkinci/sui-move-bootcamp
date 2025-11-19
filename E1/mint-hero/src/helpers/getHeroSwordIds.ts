import { suiClient } from "../suiClient";
import { ENV } from "../env";

/**
 * Gets the dynamic object fields attached to a hero object by the object's id.
 * For the scope of this exercise, we ignore pagination, and just fetch the first page.
 * Filters the objects and returns the object ids of the swords.
 */
export const getHeroSwordIds = async (id: string): Promise<string[]> => {
  // TODO: Implement this function
  const resp = await suiClient.getDynamicFields({
    parentId: id,
  });
  const swords = resp.data.filter(({objectType}) => objectType === `${ENV.PACKAGE_ID}::blacksmith::Sword`);
  const swordsIds = swords.map(({objectId}) => objectId);
  return swordsIds;

  // different way like below
  // const swords = data.filter(({objectType}) => objectType === `${ENV.PACKAGE_ID}::blacksmith::Sword`);
  // return swords.map(({objectId}) => objectId);
};
