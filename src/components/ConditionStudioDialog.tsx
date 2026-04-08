import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ConditionStudioDialogProps {
  condition: { id: number; name: string; type: string; attribute: string; operator: string; value: string; description: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dictionaries = ['RADIUS', 'DEVICE', 'Network Access', 'EndPoints', 'Session', 'CERTIFICATE'];
const operators = ['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'STARTS_WITH', 'ENDS_WITH', 'MATCHES', 'IN', 'NOT_IN', 'GREATER_THAN', 'LESS_THAN'];

const ConditionStudioDialog = ({ condition, open, onOpenChange }: ConditionStudioDialogProps) => {
  const [blocks, setBlocks] = useState<{ logic: 'AND' | 'OR'; dict: string; attr: string; op: string; val: string }[]>(
    condition ? [{ logic: 'AND', dict: condition.attribute.split(':')[0] || 'RADIUS', attr: condition.attribute.split(':')[1] || condition.attribute, op: condition.operator, val: condition.value }] : []
  );

  if (!condition) return null;

  const addBlock = () => setBlocks([...blocks, { logic: 'AND', dict: 'RADIUS', attr: '', op: 'EQUALS', val: '' }]);
  const removeBlock = (i: number) => setBlocks(blocks.filter((_, idx) => idx !== i));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>Condition Studio:</span> {condition.name}
          </DialogTitle>
        </DialogHeader>

        <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
          <div className="flex items-center">
            <span className="w-28 font-medium" style={{ color: '#555' }}>Name</span>
            <input className="flex-1 border border-border rounded px-2 py-1 text-xs bg-background" defaultValue={condition.name} />
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium" style={{ color: '#555' }}>Type</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: condition.type === 'Compound' ? '#fbab1830' : '#049fd920', color: condition.type === 'Compound' ? '#b47a00' : '#049fd9' }}>{condition.type}</span>
          </div>
          <div className="flex items-center">
            <span className="w-28 font-medium" style={{ color: '#555' }}>Description</span>
            <input className="flex-1 border border-border rounded px-2 py-1 text-xs bg-background" defaultValue={condition.description} />
          </div>
        </div>

        {/* Condition Blocks */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: '#333' }}>Condition Blocks</span>
            <button onClick={addBlock} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded text-white" style={{ background: '#049fd9' }}>
              <Plus size={10} /> Add Block
            </button>
          </div>

          <div className="space-y-2">
            {blocks.map((block, i) => (
              <div key={i} className="border border-border rounded p-2 bg-card">
                {i > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium" style={{ color: '#888' }}>Logic:</span>
                    {(['AND', 'OR'] as const).map(logic => (
                      <button key={logic} className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{ background: block.logic === logic ? '#049fd9' : '#f0f0f0', color: block.logic === logic ? '#fff' : '#666' }}
                        onClick={() => { const nb = [...blocks]; nb[i].logic = logic; setBlocks(nb); }}>
                        {logic}
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs">
                  <select className="border border-border rounded px-1.5 py-1 text-[11px] bg-background" value={block.dict}
                    onChange={e => { const nb = [...blocks]; nb[i].dict = e.target.value; setBlocks(nb); }}>
                    {dictionaries.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <span style={{ color: '#999' }}>:</span>
                  <input className="flex-1 border border-border rounded px-1.5 py-1 text-[11px] bg-background" placeholder="Attribute" value={block.attr}
                    onChange={e => { const nb = [...blocks]; nb[i].attr = e.target.value; setBlocks(nb); }} />
                  <select className="border border-border rounded px-1.5 py-1 text-[11px] bg-background" value={block.op}
                    onChange={e => { const nb = [...blocks]; nb[i].op = e.target.value; setBlocks(nb); }}>
                    {operators.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <input className="flex-1 border border-border rounded px-1.5 py-1 text-[11px] bg-background" placeholder="Value" value={block.val}
                    onChange={e => { const nb = [...blocks]; nb[i].val = e.target.value; setBlocks(nb); }} />
                  <button onClick={() => removeBlock(i)} className="p-1 hover:bg-accent rounded"><Trash2 size={12} style={{ color: '#cc0000' }} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="mt-3 border border-border rounded p-2 bg-card">
            <div className="text-[10px] font-medium mb-1" style={{ color: '#888' }}>Condition Preview</div>
            <div className="font-mono text-[11px]" style={{ color: '#333' }}>
              {blocks.map((b, i) => `${i > 0 ? ` ${b.logic} ` : ''}${b.dict}:${b.attr} ${b.op} ${b.val}`).join('')}
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2 text-xs">
          <input type="checkbox" id="save-lib" />
          <label htmlFor="save-lib" style={{ color: '#555' }}>Save as Library Condition</label>
        </div>

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={() => onOpenChange(false)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConditionStudioDialog;
