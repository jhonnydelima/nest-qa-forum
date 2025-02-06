export abstract class Excrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
