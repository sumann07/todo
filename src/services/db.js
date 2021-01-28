import firebase from '@firebase/app';
import '@firebase/firestore';

firebase.initializeApp({
  apiKey: 'AIzaSyDQYvOCniSSN-CeyIbeWZ72nxT52zMNBp0',
  authDomain: 'zrr31085l3.codesandbox.io',
  projectId: 'lovejs-emocipher'
});

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export function addTodo(collection, id, data) {
  return db
    .collection(collection)
    .doc(id)
    .set(data);
}

export function getTodos(collection) {
  return db.collection(collection).get();
}

export function updateTodo(collection, id, data) {
  return db
    .collection(collection)
    .doc(id)
    .update(data);
}

export function deleteTodo(collection, id) {
  return db
    .collection(collection)
    .doc(id)
    .delete();
}
