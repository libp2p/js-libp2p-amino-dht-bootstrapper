export function fatal (msg?: any): never {
  // eslint-disable-next-line no-console
  console.error(msg)
  process.exit(1)
}
