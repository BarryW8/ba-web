import CryptoJS from "crypto-js"

/**
 * MD5加密
 * @param {string} signStr
 */
export const encryptMD5 = (signStr: string) => {
  return CryptoJS.MD5(signStr).toString()
}

/**
 * DES加密
 * @param {string} message
 * @param {string} key
 */
export const encryptDES = (message: string, key: string) => {
  if (!message) return

  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  return encrypted.ciphertext.toString()
}
