import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 16);

export const isValidId = (id: string) => /[0123456789abcdefghijklmnopqrstuvwxyz]{16}/.test(id);

export default () => nanoid();