import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { usePltPortalContainer } from '@/components/layout/plt-portal-context'

/**
 * 아임웹 임베드 PoC 페이지 — §14(마이그레이션 플랜) 검증용.
 * 목적: (1) 호스트 전역 CSS로부터 격리되는지, (2) Radix 포털이 .plt-root 안에 붙는지 눈으로 확인.
 */
export function PocPage() {
  const portalContainer = usePltPortalContainer()

  return (
    <section className="mx-auto max-w-xl space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-bold">Placeuticals React PoC</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          이 블록이 호스트 페이지 스타일의 영향을 받지 않아야 합니다.
        </p>
      </div>

      <ul className="flex gap-3 text-sm">
        <li>
          <a href="#" onClick={(e) => e.preventDefault()} data-testid="poc-link">
            일반 링크 (밑줄/색 없어야 함)
          </a>
        </li>
        <li>list-style 없어야 함</li>
      </ul>

      <Card>
        <CardHeader>
          <CardTitle>shadcn Card</CardTitle>
          <CardDescription>브랜드 accent 컬러가 적용된 버튼 예시</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button data-testid="poc-btn-primary">Primary</Button>
          <Button variant="outline" data-testid="poc-btn-outline">
            Outline
          </Button>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" data-testid="poc-dialog-trigger">
            포털 다이얼로그 열기
          </Button>
        </DialogTrigger>
        <DialogContent container={portalContainer} data-testid="poc-dialog-content">
          <DialogHeader>
            <DialogTitle>Radix Portal 스코프 테스트</DialogTitle>
            <DialogDescription>
              이 다이얼로그가 body가 아니라 .plt-root 컨테이너 안에서 렌더링되면 성공입니다.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  )
}
