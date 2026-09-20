/**
 * public/ 안의 파일 경로를 배포 위치에 맞게 바꾼다.
 *
 * 사이트를 도메인 루트가 아니라 하위 경로(예: /placeuticals/preview/)에 올리면
 * '/img/logo.png' 같은 절대 경로는 도메인 루트를 가리켜 404가 난다.
 * Vite가 빌드 시 넣어주는 BASE_URL을 앞에 붙여 어디에 올리든 맞게 한다.
 */
export function asset(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
