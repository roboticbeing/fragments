// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const validTypes = [
  `text/plain`,
  `text/plain; charset=utf-8`,
  `text/markdown`,
  `text/html`,
  `application/json`,
  `image/png`,
  `image/jpeg`,
  `image/webp`,
  `image/gif`,
];

class Fragment {
  constructor({ id = randomUUID(), ownerId, created = new Date(), updated = new Date(), type, size = 0 }) {
    // ownerId and type are required
    if(ownerId && type) {
      // type must be supported
      if(this.constructor.isSupportedType(type)) {
        // size must be a positive number
        if(Number.isFinite(size) && size >= 0) {
          this.id = id;
          this.ownerId = ownerId;
          this.created = created;
          this.updated = updated;
          this.type = type;
          this.size = size;
        }
        else {
          logger.warn('size must be a positive number');
          throw new Error('size must be a positive number');
        } 
      }
      else {
          logger.warn('type is not supported');
          throw new Error('type is not supported');
        }
    }
    else {
      logger.warn('ownerId: ' + ownerId + ' and type: ' + type +' are required');
      throw new Error('ownerId and type are required');
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    return listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);
    if (fragment !== undefined) {
      return fragment;
    }
    else {
      logger.warn('id does not exist');
      throw new Error('id does not exist');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    if(Buffer.isBuffer(data)) {
      this.updated = new Date();
      this.size = Buffer.from(data).length;
      return writeFragmentData(this.ownerId, this.id, data);
    }
    else {
      logger.warn('data isn\'t a buffer');
      throw new Error('data isn\'t a buffer');
    }
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.type.match(/text\/.*/)) {
      return true;
    }
    return false;
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return [this.mimeType];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if(validTypes.includes(value)) {
      return true;
    }
    return false;
  }
}

module.exports.Fragment = Fragment;