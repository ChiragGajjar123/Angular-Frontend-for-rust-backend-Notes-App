import { writeFileSync, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

let apiUrl = process.env['API_URL'];

// Parse .env manually if API_URL is not in process.env
if (!apiUrl && existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf8');
  const match = envContent.match(/^API_URL=(.+)$/m);
  if (match) {
    apiUrl = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

apiUrl = apiUrl || '/api';

const envConfigFile = `export const environment = {
  apiUrl: '${apiUrl}',
};
`;

const targetPath = resolve(process.cwd(), './src/environments/environment.ts');
writeFileSync(targetPath, envConfigFile, 'utf8');
console.log(`[setenv] Environment file updated -> API_URL = ${apiUrl}`);
