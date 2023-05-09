/**

 Copyright 2023 Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/



// popup.js

const mouseEntropy = {
  x: BigInt(0),
  y: BigInt(0),
  timeStamp: BigInt(0),
};

document.addEventListener("mousemove", (event) => {
  const { clientX, clientY, timeStamp } = event;
  mouseEntropy.x = BigInt(clientX);
  mouseEntropy.y = BigInt(clientY);
 // mouseEntropy.timeStamp = BigInt(timeStamp);
  mouseEntropy.timeStamp = BigInt(Math.round(timeStamp));

});

async function createEntropyBuffer() {
  const timestamp = BigInt(new Date().getTime()) * BigInt(1000000);
  const processEntropy = crypto.getRandomValues(new BigInt64Array(1))[0];
  const mixedEntropy =
    timestamp ^ processEntropy ^ mouseEntropy.x ^ mouseEntropy.y ^ mouseEntropy.timeStamp;

  const processBuffer = new ArrayBuffer(8);
  const dataView = new DataView(processBuffer);
  dataView.setBigInt64(0, mixedEntropy, true);
  return new Uint8Array(processBuffer);
}

/**
async function generate(length, callback) {
  const randomly = Math.random();
  const randomMultiplier = randomly + Math.random();
  const byteLength = Math.ceil(length / randomMultiplier);
  const cryptoBuffer = new Uint8Array(byteLength);
  crypto.getRandomValues(cryptoBuffer);

  const processBuffer = await createEntropyBuffer();

  const encoder = new TextEncoder();
  const data = new Uint8Array([...cryptoBuffer, ...processBuffer]);
  const digestBuffer = await crypto.subtle.digest("SHA-512", data);

  const randomHexString = Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
  callback(randomHexString);
}
**/
/**
async function generate(length, callback) {
  const randomly = Math.random();
  const randomMultiplier = randomly + Math.random();
  const byteLength = Math.ceil(length / randomMultiplier);
  const cryptoBuffer = new Uint8Array(byteLength);
  crypto.getRandomValues(cryptoBuffer);

  const processBuffer = await createEntropyBuffer();

  const encoder = new TextEncoder();
  const data = new Uint8Array([...cryptoBuffer, ...processBuffer]);
  const digestBuffer = await crypto.subtle.digest("SHA-512", data);

  let randomHexString = Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);

  // Ensure the password has a mix of uppercase and lowercase letters
  randomHexString = randomHexString
    .split("")
    .map((char, index) =>
      index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");

  callback(randomHexString);
}
**/

function getRandomSpecialChar() {
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?/";
  return specialChars[Math.floor(Math.random() * specialChars.length)];
}

async function generate(length, callback) {
  const randomly = Math.random();
  const randomMultiplier = randomly + Math.random();
  const byteLength = Math.ceil(length / randomMultiplier);
  const cryptoBuffer = new Uint8Array(byteLength);
  crypto.getRandomValues(cryptoBuffer);

  const processBuffer = await createEntropyBuffer();

  const encoder = new TextEncoder();
  const data = new Uint8Array([...cryptoBuffer, ...processBuffer]);
  const digestBuffer = await crypto.subtle.digest("SHA-512", data);

  let randomHexString = Array.from(new Uint8Array(digestBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);

  // Ensure the password has a mix of uppercase and lowercase letters
  randomHexString = randomHexString
    .split("")
    .map((char, index) =>
      index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
    )
    .join("");

  // Insert special characters randomly in the final password
  const numberOfSpecialChars = Math.floor(Math.random() * (length / 4)) + 1;
  for (let i = 0; i < numberOfSpecialChars; i++) {
    const position = Math.floor(Math.random() * randomHexString.length);
    const specialChar = getRandomSpecialChar();
    randomHexString =
      randomHexString.slice(0, position) +
      specialChar +
      randomHexString.slice(position + 1);
  }

  callback(randomHexString);
}


document.getElementById("generate-btn").addEventListener("click", async () => {
  const minPasswordLength = 8;
  const maxPasswordLength = 25;
  const randomLength = Math.floor(
    Math.random() * (maxPasswordLength - minPasswordLength + 1)
  ) + minPasswordLength;

  await generate(randomLength, (randomPassword) => {
    const el = document.createElement("textarea");
    el.value = randomPassword;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    alert("Your new password is copied to clipboard: " + randomPassword);
    window.close();
  });
});


