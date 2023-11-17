import * as contentful from 'contentful-management';
import { Status } from '../models/article';

/**
 * Get the current status of the given entry.
 * 
 * @param {contentful.Entry} entity - The entry to check.
 * @returns {Status} It will return Status.DRAFT if the entry is a draft, Status.PUBLISHED if the entry is published, and Status.ARCHIVED if the entry is archived.
 * @throws {Error} Will throw an error if the entry does not correspond to any of the status.
 */
export function getStatus(entity: contentful.Entry): Status {
    if (isDraft(entity)) {
        return Status.DRAFT;
    }

    if (isPublished(entity)) {
        return Status.PUBLISHED;
    }

    if (isChanged(entity)) {
        return Status.CHANGED;
    }

    if (isArchived(entity)) {
        return Status.ARCHIVED;
    }

    throw new Error("Invalid status");
}

/**
 * Check if the given entry is a draft.
 * @param {contentful.Entry} entity - The entry to check.
 * @returns {boolean} True if the entry is a draft, false otherwise.
 */
function isDraft(entity: contentful.Entry) {
    return !entity.sys.publishedVersion;
}

/**
 * Check if the given entry has been changed.
 * @param {contentful.Entry} entity - The entry to check.
 * @returns {boolean} True if the entry has been changed, false otherwise.
 */
function isChanged(entity: contentful.Entry) {
    return !!entity.sys.publishedVersion &&
        entity.sys.version >= entity.sys.publishedVersion + 2;
}

/**
 * Check if the given entry is published.
 * @param {contentful.Entry} entity - The entry to check.
 * @returns {boolean} True if the entry is published, false otherwise.
 */
function isPublished(entity: contentful.Entry) {
    return !!entity.sys.publishedVersion &&
        entity.sys.version === entity.sys.publishedVersion + 1;
}

/**
 * Check if the given entry is archived.
 * @param {contentful.Entry} entity - The entry to check.
 * @returns {boolean} True if the entry is archived, false otherwise.
 */
function isArchived(entity: contentful.Entry) {
    return !!entity.sys.archivedVersion;
}