/*eslint @typescript-eslint/no-unused-vars: 'off'*/

/**
 * @author copy from 'jakearchibald/idb-keyval
 * @github https://github.com/jakearchibald/idb-keyval
 * @desc 修改了默认数据库名和存储名
 */
type UseStore = <T>(
  txMode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>
) => Promise<T>

function promisifyRequest<T = undefined>(request: IDBRequest<T> | IDBTransaction): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // @ts-ignore - file size hacks
    request.oncomplete = request.onsuccess = () => resolve(request.result)
    // @ts-ignore - file size hacks
    request.onabort = request.onerror = () => reject(request.error)
  })
}

function createStore(dbName: string, storeName: string): UseStore {
  const request = indexedDB.open(dbName)
  request.onupgradeneeded = () => request.result.createObjectStore(storeName)
  const dbp = promisifyRequest(request)

  return (txMode, callback) =>
    dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)))
}

const registryStore = createStore('depazer', 'registry')

function get<T = any>(key: IDBValidKey, customStore = registryStore): Promise<T | undefined> {
  return customStore('readonly', (store) => promisifyRequest(store.get(key)))
}

function set(key: IDBValidKey, value: any, customStore = registryStore): Promise<void> {
  return customStore('readwrite', (store) => {
    store.put(value, key)
    return promisifyRequest(store.transaction)
  })
}

function del(key: IDBValidKey, customStore = registryStore): Promise<void> {
  return customStore('readwrite', (store) => {
    store.delete(key)
    return promisifyRequest(store.transaction)
  })
}
/** copy end */

interface Registry {
  name: string
  version: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  [key: string]: any
}

async function getRegistry(dependency: string, version: string = 'latest'): Promise<Registry> {
  const hasCache = await getCache(`${dependency}@${version}`)
  if (hasCache) return hasCache

  const url = `https://registry.npmmirror.com/${dependency}/${version}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache'
  }).catch((err) => err)

  const defaultRegistry = {
    name: dependency,
    version,
    dependencies: {},
    devDependencies: {}
  }

  if (!res.ok) return defaultRegistry

  const registry = await res.json()

  setCache(dependency, version, registry, defaultRegistry)

  return {
    name: dependency,
    version,
    dependencies: {},
    devDependencies: {},
    ...registry
  }
}

async function getCache(key: `${string}@${string}`): Promise<Registry | undefined> {
  const hasCache = await get<Registry>(key)
  if (hasCache) {
    if (hasCache.ttl === undefined) return hasCache
    if (hasCache.ttl > Date.now()) return hasCache.registry
    else del(key)
  }
}

function setCache(
  dependency: string,
  version: string,
  registry: Registry,
  defaultRegistry: Registry,
  ttl: number = 1000 * 60 * 5
) {
  version !== '' &&
    set(`${dependency}@${registry.version}`, {
      ...defaultRegistry,
      ...registry
    })

  if (version !== registry.version) {
    set(`${dependency}@${version}`, {
      ttl: Date.now() + ttl,
      registry: {
        ...defaultRegistry,
        ...registry
      }
    })
  }
}
