import type { AuthSimResult } from '@/lib/authSimulator';

interface PolicyFlowDiagramProps {
  result?: AuthSimResult | null;
}

const PolicyFlowDiagram = ({ result }: PolicyFlowDiagramProps) => {
  const nodes = [
    { id: 'request', label: 'RADIUS\nRequest', x: 20, y: 60 },
    { id: 'policy-set', label: result?.matchedPolicySet || 'Policy Set\nEvaluation', x: 170, y: 60 },
    { id: 'authn', label: result?.matchedAuthnRule || 'Authentication', x: 340, y: 60 },
    { id: 'identity', label: 'Identity\nLookup', x: 340, y: 160 },
    { id: 'authz', label: result?.matchedAuthzRule || 'Authorization', x: 510, y: 60 },
    { id: 'result', label: result ? (result.passed ? 'Access-Accept' : 'Access-Reject') : 'Result', x: 660, y: 60 },
  ];

  const getColor = (idx: number) => {
    if (!result) return '#049fd9';
    if (idx === nodes.length - 1) return result.passed ? '#6cc04a' : '#cc0000';
    // Check if step reached
    const stepReached = result.steps.length > idx * 2;
    if (!stepReached) return '#ccc';
    const hasFail = result.steps.slice(idx * 2, (idx + 1) * 2).some(s => s.status === 'fail');
    return hasFail ? '#cc0000' : '#6cc04a';
  };

  return (
    <div className="border border-border rounded bg-card p-3">
      <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Authentication Flow</div>
      <svg viewBox="0 0 800 220" className="w-full" style={{ maxHeight: 180 }}>
        {/* Arrows */}
        {[0, 1, 3, 4].map(i => (
          <line key={i} x1={nodes[i].x + 60} y1={nodes[i].y + 20} x2={nodes[i + 1].x} y2={nodes[i + 1].y + 20}
            stroke={getColor(i)} strokeWidth={2} markerEnd="url(#arrow)" />
        ))}
        {/* authn -> identity */}
        <line x1={nodes[2].x + 60} y1={nodes[2].y + 40} x2={nodes[3].x + 60} y2={nodes[3].y}
          stroke={getColor(2)} strokeWidth={2} strokeDasharray="4" />
        {/* identity -> authz */}
        <line x1={nodes[3].x + 120} y1={nodes[3].y + 20} x2={nodes[4].x} y2={nodes[4].y + 20}
          stroke={getColor(3)} strokeWidth={2} strokeDasharray="4" />

        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#049fd9" />
          </marker>
        </defs>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={120} height={40} rx={6}
              fill={i === nodes.length - 1 && result ? (result.passed ? '#6cc04a15' : '#cc000015') : '#f8f8f8'}
              stroke={getColor(i)} strokeWidth={2} />
            {n.label.split('\n').map((line, li) => (
              <text key={li} x={n.x + 60} y={n.y + 18 + li * 14} textAnchor="middle" fontSize={10} fill="#333" fontWeight={500}>{line}</text>
            ))}
          </g>
        ))}

        {/* Result indicator */}
        {result && (
          <text x={nodes[5].x + 60} y={nodes[5].y + 58} textAnchor="middle" fontSize={9}
            fill={result.passed ? '#3d7a2a' : '#cc0000'} fontWeight={700}>
            {result.passed ? '✓ PASSED' : '✗ FAILED'}
          </text>
        )}
      </svg>
    </div>
  );
};

export default PolicyFlowDiagram;
