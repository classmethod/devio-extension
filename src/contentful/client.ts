import * as vscode from "vscode";
import * as contentful from "contentful-management";
import * as util from "../util";

/**
 * ContentfulClient is a singleton class that manages the Contentful API client.
 */
export class ContentfulClient {
    private static ins: ContentfulClient;
    private token: string;
    private spaceId: string;
    private entryId: string;
    private apiClient: contentful.ClientAPI;
    private contentTypeId: string = "blogPost";

    /**
     * Initialize the Contentful client, which is then used for all future Contentful API requests.
     * Configuration parameters are retrieved from the workspace configuration.
     */
    private constructor() {
        const confGeneral = vscode.workspace.getConfiguration('contentful.general');

        const token: string = confGeneral.get('accessToken') ?? '';
        const spaceId: string = confGeneral.get('spaceId') ?? '';
        const entryId: string = confGeneral.get('entryId') ?? '';

        if (token === '' || spaceId === '') {
            throw new Error(`token : ${token}, spaceId : ${spaceId}`);
        } else {
            this.token = token;
            this.spaceId = spaceId;
            this.entryId = entryId;
        }

        this.apiClient = contentful.createClient({
            accessToken: this.token,
        });
    }

    /**
     * Get the instance of the ContentfulClient class.
     * @returns An instance of ContentfulClient.
     */
    public static getInstance(): ContentfulClient {
        if (!ContentfulClient.ins) {
            ContentfulClient.ins = new ContentfulClient();
        }

        return ContentfulClient.ins;
    }

    /**
     * Get the API client.
     * @returns The API client.
     */
    public getApiClient(): contentful.ClientAPI {
        return this.apiClient;
    }

    /**
     * Get the Space ID.
     * @returns The Space ID.
     */
    public getSpaceId(): string {
        return this.spaceId;
    }

    /**
     * Get the Entry ID.
     * @returns The Entry ID.
     */
    public getEntryId(): string {
        return this.entryId;
    }

    /**
     * Fetch an Entry from Contentful based on a provided Entry ID.
     * @param entryId The ID of the Entry to get.
     * @returns The corresponding Contentful Entry.
     */
    public async getEntry(entryId: string): Promise<contentful.Entry> {
        let space = await this.apiClient.getSpace(this.spaceId);
        let env = await space.getEnvironment('master');
        return env.getEntry(entryId);
    }

    /**
     * Create a new Entry (as a draft) in Contentful.
     * @returns The new Contentful Entry.
     */
    public async createNewEntry(): Promise<contentful.Entry> {
        let space = await this.apiClient.getSpace(this.spaceId);
        let env = await space.getEnvironment('master');
        const defaultTitle = util.generateRandomString(12);
        return env.createEntry(this.contentTypeId, {
            fields: {
                title: { 'en-US': `untitled-${defaultTitle}` },
                slug: { 'en-US': `slug-${defaultTitle}` },
                content: { 'en-US': `new article - ${defaultTitle}` },
                language: { 'en-US': 'ja' },
                author: {
                    'en-US': {
                        sys: { type: 'Link', linkType: 'Entry', id: `${this.entryId}` }
                    }
                }
            }
        });
    }
}