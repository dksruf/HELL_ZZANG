/**
 * IndexedDB를 사용하는 스토리지 서비스
 * 웹 환경에서 사용자 데이터를 영구적으로 저장하기 위한 서비스입니다.
 */

export class StorageService {
  private dbName = 'hellzangDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // 데이터베이스 초기화
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB 초기화 실패:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB 초기화 성공');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 저장소 생성
        if (!db.objectStoreNames.contains('meals')) {
          db.createObjectStore('meals', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('savedFoods')) {
          db.createObjectStore('savedFoods', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };
    });
  }

  // 데이터 저장
  async saveData(storeName: string, data: any): Promise<void> {
    if (!this.db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 데이터 조회
  async getData(storeName: string, key?: any): Promise<any> {
    if (!this.db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = key ? store.get(key) : store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // 데이터 삭제
  async deleteData(storeName: string, key: any): Promise<void> {
    if (!this.db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // 모든 데이터 삭제
  async clearStore(storeName: string): Promise<void> {
    if (!this.db) {
      throw new Error('데이터베이스가 초기화되지 않았습니다.');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// 싱글톤 인스턴스 생성
export const storageService = new StorageService(); 