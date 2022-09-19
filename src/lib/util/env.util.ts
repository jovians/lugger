/* Jovian (c) 2020, License: MIT */
export function envVarsBytype() {
  const env2 = {};
  const envNode = {};
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('npm_')) {
      envNode[key] = process.env[key];
      continue;
    }
    env2[key] = process.env[key];
  }
  return {
    other: env2,
    npm: envNode,
  };
}
