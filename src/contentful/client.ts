import * as vscode from "vscode";
import * as contentful from "contentful-management";

export class ContentfulClient {
    private static ins: ContentfulClient;
    private token:string;
    private spaceId:string;
    private apiClient:contentful.ClientAPI;

    private constructor() {
        const confGeneral = vscode.workspace.getConfiguration('contentful.general');

        const token:string = confGeneral.get('accessToken') ?? '';
        const spaceId:string = confGeneral.get('spaceId') ?? '';

        if(token === '' || spaceId === '') {
            throw new Error(`token : ${token}, spaceId : ${spaceId}`);
        } else {
            this.token = token;
            this.spaceId = spaceId;
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

    public getApiClient():contentful.ClientAPI{
        return this.apiClient;
    }

    public getSpaceId():string{
        return this.spaceId;
    }

}