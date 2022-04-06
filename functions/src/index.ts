/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable max-len */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Expo } from "expo-server-sdk";
admin.initializeApp({
  credential: admin.credential.cert(require("../account.json")),
  databaseURL: "https://fidoocia-e9f07-default-rtdb.firebaseio.com",
});
const expo = new Expo(); // Create a new Expo SDK client, optionally providing an access token if you have enabled push security
const u = () =>
  String((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
const uuid = () => `${u() + u()}-${u()}-${u()}-${u()}-${u() + u() + u() + u()}`;
export const notifier = functions.firestore
  .document("{user}/userInfo/verification/{prospect}")
  .onUpdate(async (change, context) => {
    const messages = [];
    const pushToken = (
      await admin
        .database()
        .ref(`users/${context.params.user}/pushToken`)
        .once("value")
    ).val();
    const [last, doc] = [change.before.data(), change.after.data()];
    Object.keys(doc).forEach(async (key, i) => {
      const param = String(
        key.includes("valid") || key.includes("checked")
          ? key.split("d")[1]
          : ""
      );
      if (last[key] !== doc[key]) {
        last[key] = doc[key];
        const value = key.includes("checked") ? doc[`valid${param}`] : doc[key];
        if (
          doc[`checked${param}`] === true &&
          typeof doc[`checked${param}`] === "boolean"
        ) {
          const info =
            param.toLowerCase() == "name"
              ? "first name"
              : param.toLowerCase() == "lastname"
              ? "last name"
              : param;
          const text = `${doc.prospect}'s ${info} ${
            value ? "was verified! ✅" : "could not be verified. ❌"
          }`;
          // functions.logger.log(text); // for debugging
          messages.push({ to: pushToken, sound: "default", body: text });
          const notification = {
            _id: uuid(),
            createdAt: new Date(),
            date: "Solana",
            text,
            user: { _id: "admin", name: "admin" },
          };
          admin
            .firestore()
            .collection(`${context.params.user}/userInfo/notifications`)
            .add(notification);
        }
      }
    });
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
    } else {
      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];
      const receiptIds = [];
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
      for (const ticket of tickets) {
        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      }
    }
  });
// let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
// (async () => {
//   for (let chunk of receiptIdChunks) {
//     try {
//       let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
//       console.log(receipts);

//       // The receipts specify whether Apple or Google successfully received the
//       // notification and information about an error, if one occurred.
//       for (let receiptId in receipts) {
//         let { status, message, details } = receipts[receiptId];
//         if (status === 'ok') {
//           continue;
//         } else if (status === 'error') {
//           console.error(
//             `There was an error sending a notification: ${message}`
//           );
//           if (details && details.error) {
//             // The error codes are listed in the Expo documentation:
//             // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
//             // You must handle the errors appropriately.
//             console.error(`The error code is ${details.error}`);
//           }
//         }
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// })();
