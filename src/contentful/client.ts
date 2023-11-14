import * as vscode from "vscode";
import * as contentful from "contentful-management";

export class ContentfulClient {
    private static ins: ContentfulClient;
    private token: string;
    private spaceId: string;
    private entryId: string;
    private apiClient: contentful.ClientAPI;
    private contentTypeId: string = "blogPost";

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

    public static getInstance(): ContentfulClient {
        if (!ContentfulClient.ins) {
            ContentfulClient.ins = new ContentfulClient();
        }

        return ContentfulClient.ins;
    }

    public getApiClient(): contentful.ClientAPI {
        return this.apiClient;
    }

    public getSpaceId(): string {
        return this.spaceId;
    }

    public getEntryId(): string {
        return this.entryId;
    }

    /**
     * EntryIDを指定してContentfulからEntryを取得する.
     * @param entryId Entry ID
     * @returns Contentful Entry
     */
    public async getEntry(entryId: string): Promise<contentful.Entry> {
        let space = await this.apiClient.getSpace(this.spaceId);
        let env = await space.getEnvironment('master');
        return env.getEntry(entryId);
    }

    /**
     * 新しいEntry(draft)を作成する.
     * @param entryId Entry ID
     * @returns Contentful Entity
     */
    public async createNewEntry(): Promise<contentful.Entry> {
        let space = await this.apiClient.getSpace(this.spaceId);
        let env = await space.getEnvironment('master');
        return env.createEntry(this.contentTypeId, {
            fields: {
                title: { 'en-US': 'untitled' },
                slug: { 'en-US': 'unknown-slug' },
                content: { 'en-US': 'new article' },
                language: { 'en-US': 'ja' },
                author: { 'en-US': {
                    sys: { type: 'Link', linkType: 'Entry', id: `${this.entryId}` }
                } }
            }
        });
    }

}
