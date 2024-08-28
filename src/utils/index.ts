import { Types } from "mongoose";
import NodeRSA from "node-rsa";
import CryptoJS from "crypto-js";

// Retrieve the ConfigService instance for configuration management.
export function toObjectId(id: any): Types.ObjectId {
  return new Types.ObjectId(id);
}

export function encryptObject(publicKey: string, body: object) {
  const key = new NodeRSA();
  key.importKey(publicKey, "pkcs8-public-pem");
  return key.encrypt(JSON.stringify(body), "base64");
}

export function encryptKey(string: any, encrypt_key: any) {
  // Mã hóa một chuỗi
  const ciphertext = CryptoJS.AES.encrypt(string, encrypt_key).toString();
  return ciphertext;
}

export function decryptKey(string: any, encrypt_key: any) {
  const bytes = CryptoJS.AES.decrypt(string, encrypt_key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
