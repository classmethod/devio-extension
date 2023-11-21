import * as tag from "../models/tag";
import * as cUtil from "../contentful/contentfulUtil";
import { AppContext } from "../extension";
import { ContentfulClient } from "../contentful/client";


/**
 * Function to Get&Store Tag Entry
 * @return {function} - a function that get&store tags
 */
export const storeTagCommand = (context: AppContext) => {
  return async () => {
    // Get entry for tag from Contentful 
    let contentfulClient = ContentfulClient.getInstance();
    let tag_entry = await contentfulClient.getEntry(cUtil.TAG_ENTRY_ID);
    tag.initializeData(tag_entry.fields.tags?.["en-US"]);
  };
};