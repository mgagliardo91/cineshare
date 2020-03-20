import shortId from 'shortid';

export const isValidId = id => shortId.isValid(id);

export default () => shortId.generate();