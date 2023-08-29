/*eslint @typescript-eslint/no-unused-vars: "off"*/

export async function apiGetRegistry(
  name: string,
  version: string,
  baseURL = 'https://registry.npmmirror.com/'
) {
  const url = `${baseURL}${name}/${version}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!res.ok) {
    return {
      name,
      version,
      dependencies: []
    }
  }

  return res.json()
}
