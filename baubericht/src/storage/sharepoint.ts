import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { readFileSync } from "fs";

let graphClient: Client | null = null;

function getClient(): Client {
  if (graphClient) return graphClient;

  const tenantId = process.env.AZURE_TENANT_ID!;
  const clientId = process.env.AZURE_CLIENT_ID!;
  const clientSecret = process.env.AZURE_CLIENT_SECRET!;

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  graphClient = Client.initWithMiddleware({ authProvider });
  return graphClient;
}

const driveId = () => process.env.SHAREPOINT_DRIVE_ID!;
const rootFolder = () => process.env.SHAREPOINT_ROOT_FOLDER ?? "Bautagesberichte";

export async function uploadFile(
  localPath: string,
  remotePath: string,
  mimeType: string
): Promise<string> {
  const client = getClient();
  const fileBuffer = readFileSync(localPath);
  const fullRemotePath = `${rootFolder()}/${remotePath}`;

  await client
    .api(`/drives/${driveId()}/root:/${fullRemotePath}:/content`)
    .header("Content-Type", mimeType)
    .put(fileBuffer);

  return fullRemotePath;
}

export async function uploadBuffer(
  buffer: Buffer,
  remotePath: string,
  mimeType: string
): Promise<string> {
  const client = getClient();
  const fullRemotePath = `${rootFolder()}/${remotePath}`;

  await client
    .api(`/drives/${driveId()}/root:/${fullRemotePath}:/content`)
    .header("Content-Type", mimeType)
    .put(buffer);

  return fullRemotePath;
}

export async function updateIndexJson(indexData: object): Promise<void> {
  const client = getClient();
  const remotePath = `${rootFolder()}/index.json`;
  const content = Buffer.from(JSON.stringify(indexData, null, 2), "utf-8");

  await client
    .api(`/drives/${driveId()}/root:/${remotePath}:/content`)
    .header("Content-Type", "application/json")
    .put(content);
}

export async function readIndexJson(): Promise<Record<string, unknown>> {
  const client = getClient();
  const remotePath = `${rootFolder()}/index.json`;

  try {
    const response = await client
      .api(`/drives/${driveId()}/root:/${remotePath}:/content`)
      .get();

    if (typeof response === "string") return JSON.parse(response);
    if (Buffer.isBuffer(response)) return JSON.parse(response.toString("utf-8"));
    return response as Record<string, unknown>;
  } catch {
    return { projects: {} };
  }
}

export function isSharePointConfigured(): boolean {
  return !!(
    process.env.AZURE_TENANT_ID &&
    process.env.AZURE_CLIENT_ID &&
    process.env.AZURE_CLIENT_SECRET &&
    process.env.SHAREPOINT_DRIVE_ID
  );
}
