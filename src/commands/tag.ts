import * as tag from "../models/tag";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";


// Tag一覧のEntryID
const TAG_ENTRY_ID = "5LNylR3zpQQOnuddI4zoWx";

/**
 * Function to Get&Store Tag Entry
 * @return {function} - a function that get&store tags
 */
export const storeTagCommand = (context: AppContext) => {
  return async () => {
    // Get entry for tag from Contentful 
    let contentfulClient = ContentfulClient.getInstance();
    let tag_entry = await contentfulClient.getEntry(TAG_ENTRY_ID);
    tag.initializeData(tag_entry.fields.tags?.["en-US"]);
  };
};