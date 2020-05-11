var DATABASE_NAME = "TEST-PWA";
//var TABLE1 = "POSTS";
var TABLE2 = "wpPOSTS";
var dbPromise = idb.open(DATABASE_NAME, 1, function (db) {
  // if (!db.objectStoreNames.contains(TABLE1)) {
  //   db.createObjectStore(TABLE1, {keyPath: 'id'});
  // };
  if (!db.objectStoreNames.contains(TABLE2)) {
    db.createObjectStore(TABLE2, {
      keyPath: 'id'
    });
  }
});

function storeExists(table) {
  return dbPromise
    .then(function (db) {
      if (db.objectStoreNames.contains(table)) {
        return true;
      } else {
        return false;
      }
    });
}

function writeData(table, data) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(table, 'readwrite');
      var dbTable = tx.objectStore(table);
      dbTable.put(data);
      return tx.complete;
    });
}

function readAllData(table) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(table, 'readonly');
      var dbTable = tx.objectStore(table);
      return dbTable.getAll();
    });
}

function getData(table, id) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(table, 'readonly');
      var dbTable = tx.objectStore(table);
      return dbTable.get(id);
    });
}

function clearAllData(table) {
  return dbPromise
    .then(function (db) {
      var tx = db.transaction(table, 'readwrite');
      var dbTable = tx.objectStore(table);
      dbTable.clear();
      return tx.complete;
    });
}

function deleteItemFromData(table, id) {
  dbPromise
    .then(function (db) {
      var tx = db.transaction(table, 'readwrite');
      var dbTable = tx.objectStore(table);
      dbTable.delete(id);
      return tx.complete;
    })
    .then(function () {
      console.log('Item deleted!');
    });
}