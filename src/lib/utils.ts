export function getBasePath(): string {
  return process.env.NODE_ENV === 'production' 
    ? '/Incident-Managment-tool-kb-assistance' 
    : '';
}

export function getAssetPath(path: string): string {
  const basePath = getBasePath();
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`;
}
