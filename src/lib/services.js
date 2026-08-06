// ============================================================
// KHMERRICEHUB — DATA SERVICE LAYER
// Reads live data from Cloud Firestore. If Firestore is empty
// or unreachable (offline / rules not set up / not seeded),
// it falls back to the bundled demo data so the app always works.
// ============================================================

import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import {
  FARMER_IMAGES,
  FARMERS as DEMO_FARMERS,
  MESSAGES as DEMO_MESSAGES,
  NOTIFICATIONS as DEMO_NOTIFICATIONS,
  ORDERS as DEMO_ORDERS,
  REVIEWS as DEMO_REVIEWS,
  RICE_LISTINGS as DEMO_LISTINGS,
  RICE_IMAGES,
  HERO_IMAGE,
} from "./data";

const COLLECTIONS = {
  listings: "riceListings",
  farmers: "farmers",
  reviews: "reviews",
  orders: "orders",
  notifications: "notifications",
  messages: "messages",
  users: "users",
};

// Local demo images are stored in Firestore as "asset:<name>" tokens
// so they survive serialization. This map turns them back into
// the bundled images the components expect.
export const FARMER_IMAGE_TOKENS = [
  "farmer-harvest",
  "farmer-harvesting",
  "farmer-portrait",
  "farmer-raking",
  "farmer-seedlings",
  "farmer-silhouette",
  "farmer-sunset",
  "farmer-woman-rice",
];

const ASSET_IMAGES = Object.fromEntries(
  FARMER_IMAGE_TOKENS.map((token, index) => [token, FARMER_IMAGES[index]]),
);

export function resolveImage(value) {
  if (typeof value === "string" && value.startsWith("asset:")) {
    return ASSET_IMAGES[value.slice("asset:".length)] || value;
  }
  return value;
}

// Convert a Firestore document (object) into the shape the UI expects.
function normalizeListing(id, data) {
  const gallery = Array.isArray(data.gallery)
    ? data.gallery.map(resolveImage)
    : [resolveImage(data.image)];
  return { ...data, id, image: resolveImage(data.image), gallery };
}

function normalize(doc) {
  const data = doc.data ? doc.data() : doc;
  const id = doc.id;
  return { ...data, id };
}

async function readCollection(name, fallback, map, isValid) {
  try {
    const snap = await getDocs(collection(db, name));
    if (!snap.empty) {
      const rows = snap.docs
        .map(map || normalize)
        .filter((row) => !isValid || isValid(row))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      if (rows.length > 0) return rows;
    }
  } catch (err) {
    console.warn(`[services] Firestore read failed for "${name}" — using demo data.`, err);
  }
  return fallback;
}

/* ------------------------------ Reads ------------------------------ */

export async function getListings() {
  return readCollection(
    COLLECTIONS.listings,
    DEMO_LISTINGS,
    (d) => {
      const doc = d.data ? d.data() : d;
      return normalizeListing(d.id, doc);
    },
    (item) => typeof item?.name === "string" && item.name.trim() !== "",
  );
}

export async function getListing(id) {
  const all = await getListings();
  return all.find((item) => item.id === id) || all[0];
}

export async function getFarmers() {
  return readCollection(COLLECTIONS.farmers, DEMO_FARMERS);
}

export async function getFarmer(id) {
  const all = await getFarmers();
  return all.find((f) => f.id === id) || all[0];
}

export async function getReviews() {
  return readCollection(COLLECTIONS.reviews, DEMO_REVIEWS);
}

export async function getOrders() {
  return readCollection(COLLECTIONS.orders, DEMO_ORDERS);
}

export async function getNotifications() {
  return readCollection(COLLECTIONS.notifications, DEMO_NOTIFICATIONS);
}

export async function getMessages() {
  return readCollection(COLLECTIONS.messages, DEMO_MESSAGES);
}

/* ------------------------------ Writes ------------------------------ */

export async function createOrder(order) {
  try {
    const ref = await addDoc(collection(db, COLLECTIONS.orders), {
      ...order,
      createdAt: new Date().toISOString(),
    });
    return { ok: true, id: ref.id };
  } catch (err) {
    console.warn("[services] Could not save order to Firestore (demo mode).", err);
    return { ok: false, id: null };
  }
}

export async function saveListing(listing) {
  try {
    const ref = doc(collection(db, COLLECTIONS.listings), listing.id);
    const data = { ...listing };
    delete data.id;
    await setDoc(ref, data, { merge: true });
    return { ok: true, id: listing.id };
  } catch (err) {
    console.warn("[services] Could not save listing to Firestore (demo mode).", err);
    return { ok: false, id: null };
  }
}

export async function markNotificationRead(id) {
  try {
    await updateDoc(doc(db, COLLECTIONS.notifications, id), { read: true });
    return true;
  } catch {
    return false;
  }
}

/* --------------------------- Demo seeding --------------------------- */
// Uploads the bundled demo data into Firestore so the app reads
// "live" data. Safe to call more than once (existing docs are merged).

function serializeListing(listing) {
  const data = { ...listing };
  delete data.id;
  return { ...data, image: ASSET_IMAGE_TOKEN(listing.image), gallery: listing.gallery.map(ASSET_IMAGE_TOKEN) };
}

function ASSET_IMAGE_TOKEN(value) {
  const index = FARMER_IMAGES.indexOf(value);
  return index >= 0 ? `asset:${FARMER_IMAGE_TOKENS[index]}` : value;
}

export async function seedDemoData() {
  const results = { listings: 0, farmers: 0, reviews: 0, orders: 0, notifications: 0, messages: 0 };
  try {
    const batch = writeBatch(db);
    DEMO_LISTINGS.forEach((listing, index) => {
      batch.set(
        doc(db, COLLECTIONS.listings, listing.id),
        { ...serializeListing(listing), order: index },
        { merge: true },
      );
      results.listings += 1;
    });
    DEMO_FARMERS.forEach((farmer, index) => {
      batch.set(doc(db, COLLECTIONS.farmers, farmer.id), { ...farmer, order: index }, { merge: true });
      results.farmers += 1;
    });
    DEMO_REVIEWS.forEach((review, index) => {
      batch.set(doc(db, COLLECTIONS.reviews, review.id), { ...review, order: index }, { merge: true });
      results.reviews += 1;
    });
    DEMO_ORDERS.forEach((order, index) => {
      batch.set(doc(db, COLLECTIONS.orders, order.id), { ...order, order: index }, { merge: true });
      results.orders += 1;
    });
    DEMO_NOTIFICATIONS.forEach((notification, index) => {
      batch.set(
        doc(db, COLLECTIONS.notifications, notification.id),
        { ...notification, order: index },
        { merge: true },
      );
      results.notifications += 1;
    });
    DEMO_MESSAGES.forEach((message, index) => {
      batch.set(doc(db, COLLECTIONS.messages, message.id), { ...message, order: index }, { merge: true });
      results.messages += 1;
    });
    await batch.commit();
    return { ok: true, results };
  } catch (err) {
    console.error("[services] Demo seeding failed.", err);
    return { ok: false, results, error: err.message };
  }
}

export { RICE_IMAGES, HERO_IMAGE };
