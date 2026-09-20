import { Tree, TreeNode } from 'react-organizational-chart'
import { ORG_CHART } from '@/content/about'

function OrgBox({ title, en, highlight }: { title: string; en: string; highlight?: boolean }) {
  return (
    <div
      className={
        /* 고정 폭 — 자식 노드 폭이 서로 다르면 가운데 자식의 세로선이 부모 세로선과 어긋난다 */
        'plt-card-hover inline-block w-52 rounded-2xl border bg-white px-6 py-3.5 text-center shadow-sm ' +
        (highlight ? 'border-primary/40 ring-2 ring-primary/15' : 'border-border')
      }
    >
      <div className="text-sm leading-6 font-bold text-foreground">{title}</div>
      <div className="text-xs leading-4 text-muted-foreground">{en}</div>
    </div>
  )
}

export function OrgChart() {
  return (
    /* [&_li::after]:-ml-px — 라이브러리가 자식 세로선을 left:50%에서 border-left로 그려 선 두께만큼
       오른쪽으로 1px 밀린다. 부모 세로선은 정확히 중앙이라 절반(1px)을 되돌려 맞춘다.

       p-8 — overflow-x-auto를 쓰면 CSS 규칙상 세로축도 auto가 되어 상자 밖으로 나가는 것이 잘린다.
       노드 호버 그림자(아래로 약 20px 퍼짐)가 맨 아랫줄에서 잘려 보여서 안쪽 여백을 확보한다. */
    <div className="overflow-x-auto p-8 [&_li::after]:-ml-px">
      <Tree
        label={<OrgBox {...ORG_CHART.root} highlight />}
        lineWidth="2px"
        lineColor="var(--color-brand-line)"
        lineBorderRadius="12px"
        nodePadding="8px"
      >
        <TreeNode label={<OrgBox {...ORG_CHART.chain[0]} />}>
          <TreeNode label={<OrgBox {...ORG_CHART.chain[1]} />}>
            {ORG_CHART.children.map((child) => (
              <TreeNode key={child.title} label={<OrgBox {...child} />} />
            ))}
          </TreeNode>
        </TreeNode>
      </Tree>
    </div>
  )
}
