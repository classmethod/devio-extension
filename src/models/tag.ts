/**
 * A tag object
 * @interface
 * @property {number} id - The ID of the tag
 * @property {string} name - The name of the tag
 * @property {string} slug - The slug of the tag
 */
export class Tag {
    id: number;
    name: string;
    slug: string;

    constructor(id: number, name: string, slug: string) {
        this.id = id;
        this.name = name;
        this.slug = slug;
    }
}

/**
 * A Map with the tag's id as key and the tag as its value.
 * This allows for easy lookup by id.
 * Will be initialized on application start
 * @type {Map<number, Tag> | undefined}
 */
let tagsMapById: Map<number, Tag> | undefined;

/**
 * A Map with the tag's name as key and the tag as its value.
 * This allows for easy lookup by name.
 * Will be initialized on application start
 * @type {Map<string, Tag> | undefined}
 */
let tagsMapByName: Map<string, Tag> | undefined;

/**
 * Initializes the data arrays and maps on application start
 */
export function initializeData(tags: any) {
    tagsMapById = new Map(tags.map((tag: any) => [tag.id, tag]));
    tagsMapByName = new Map(tags.map((tag: any) => [tag.name, tag]));
}

/**
 * Get the name of a tag by its id
 * @param {number} id - The id of the tag you want to look up
 * @returns {string | undefined} - The name of the tag, or undefined if not found
 */
export function getNameById(id: number): string | undefined {
    const tag = tagsMapById?.get(id);
    return tag ? tag.name : undefined;
}

/**
 * Get the id of a tag by its name
 * @param {string} name - The name of the tag you want to look up
 * @returns {number | undefined} - The id of the tag, or undefined if not found
 */
export function getIdByName(name: string): number | undefined {
    const tag = tagsMapByName?.get(name);
    return tag ? tag.id : undefined;
}

/**
 * Get Tag by id
 * @param {number} id - The id of the tag you want to look up
 * @returns {Tag | undefined} - The tag, or undefined if not found
 */
export function getTagById(id: number): Tag | undefined {
    return tagsMapById?.get(id);
}

/**
 * Translate tags retrieved from Contentful to Tag[].
 * @param tags tag array
 * @returns Tag[]
 */
export function getTagsByIdArray(tags: Array<string>): Tag[] {
    if (!tags || tags.length === 0) {
        return [];
    } else {
        return tags.map((id: string) => {
            let tag = tagsMapById?.get(Number(id));
            if (tag === undefined) {
                tag = new Tag(0, "unknown", "unknown");
            }
            return tag;
        });
    }
}

