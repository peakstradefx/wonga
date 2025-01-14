export function shortenId(id: string, lengthToKeep = 10): string {
  if (id.length <= lengthToKeep) {
    return id;
  }
  return `${id.slice(-lengthToKeep)}`;
}
