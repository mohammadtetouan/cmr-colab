import { Injectable } from '@angular/core';
import { DataBaseTools } from './data-base-tools';
import { Storage } from '@ionic/storage';
import { UserOptions, User } from '../interfaces/user-options';
import { DataBase, Enregistrement } from '../interfaces/layer.model';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  user = 'User';
  constructor(
    private tools: DataBaseTools,
    private storage: Storage,

  ) { }
  getorCreateDataBase() {
    return Promise.resolve(new Promise((resolve, reject) => {
      try {
        this.getDataBaseName()
        .then((dbName: string) => {
          if (dbName) {
            this.storage.get(dbName)
            .then((db) => {
              if (db) {
                resolve(db);
              } else {
                this.storage.set(dbName, new DataBase())
                .then((newDb) => {
                  resolve(newDb);
                });
              }
            });
          } else {
            console.log('can not create db while user not auth');
          }
        });
      } catch (e) {
        console.log('err', e);
      }
    }));
  }
  getDataBaseName() {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.storage.get(this.user)
      .then((user: User) => {
        if (user) {
          const dbName = 'db' + user.uid;
          resolve(dbName);
        } else {
          const dbName = 'anonymous';
          resolve(dbName);

          // resolve(false);
        }
      });
    })
    );
  }
  updateDataBase(editedDb) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.getDataBaseName()
      .then((dbName: string) => {
        this.storage.set(dbName, editedDb)
        .then((db) => {
          resolve(db);
        });
      });
    }));
  }
  addRecordToUploadList(record: Enregistrement) {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          try {
            db.recordsToUpload.push(record);
            this.updateDataBase(db);
            resolve(record);
          } catch (e) {
            const recLis = [];
            db.recordsToUpload = recLis;
            db.recordsToUpload.push(record);
            this.updateDataBase(db)
            .then((upbd) => {
              if (upbd) {
                resolve(record);
              }
            });
          }
        } else {
          resolve(false);
        }
      });
    }));
  }
  getRecordsToUploadList() {
    return Promise.resolve(new Promise((resolve, reject) => {
      this.getorCreateDataBase()
      .then((db: DataBase) => {
        if (db) {
          resolve(db.recordsToUpload);
        } else {
          resolve(false);
        }
      });
    }));
  }
  setUser(user) {
    const userAsObj = ({
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL
    } as User);
    return Promise.resolve(new Promise((resolve, reject) => {
      this.storage.set(this.user, userAsObj)
      .then((savedUser) => {
        resolve(savedUser);
      })
      .catch((error) => {
        reject(false);
        // save to Logs
      });
    }));
  }

}
