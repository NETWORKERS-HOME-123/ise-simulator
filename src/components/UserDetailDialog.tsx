import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { internalUserDetails, adminUserDetails } from "@/lib/mockDataExtended";
import { identityGroupsList } from "@/lib/mockData";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface UserDetailDialogProps {
  user: { id: number; name: string; firstName?: string; lastName?: string; email: string; identityGroup?: string; status: string } | null;
  type: 'internal' | 'admin';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailDialog = ({ user, type, open, onOpenChange }: UserDetailDialogProps) => {
  const [tab, setTab] = useState<'general' | 'attributes' | 'access'>('general');
  if (!user) return null;

  const internalDetails = type === 'internal' ? internalUserDetails[user.name] : null;
  const adminDetails = type === 'admin' ? adminUserDetails[user.name] : null;

  const handleSave = () => {
    toast.success(`${type === 'internal' ? 'Internal' : 'Admin'} user "${user.name}" saved successfully`);
    onOpenChange(false);
  };

  const handleDelete = () => {
    toast.error(`${type === 'internal' ? 'Internal' : 'Admin'} user "${user.name}" deleted`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm">
            <span style={{ color: '#049fd9' }}>{type === 'internal' ? 'Internal User' : 'Admin User'}:</span> {user.name}
          </DialogTitle>
        </DialogHeader>

        {type === 'internal' && (
          <>
            <div className="flex border-b border-border">
              {(['general', 'attributes'] as const).map(t => (
                <button key={t} className="px-4 py-1.5 text-xs font-medium border-b-2 transition-colors capitalize"
                  style={{ color: tab === t ? '#049fd9' : '#666', borderBottomColor: tab === t ? '#049fd9' : 'transparent' }}
                  onClick={() => setTab(t)}>{t === 'general' ? 'General' : 'Custom Attributes'}</button>
              ))}
            </div>

            {tab === 'general' && (
              <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                <FieldRow label="Username" defaultValue={user.name} />
                <FieldRow label="First Name" defaultValue={(user as any).firstName || ''} />
                <FieldRow label="Last Name" defaultValue={(user as any).lastName || ''} />
                <FieldRow label="Email" defaultValue={user.email} type="email" />
                <FieldRow label="Password" defaultValue="●●●●●●●●" type="password" />
                <div className="flex items-center text-xs">
                  <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Identity Group</span>
                  <select className="border border-border rounded px-2 py-1 text-xs bg-background" defaultValue={user.identityGroup}>
                    {identityGroupsList.map(g => <option key={g.id}>{g.name}</option>)}
                  </select>
                </div>
                {internalDetails && (
                  <>
                    <SwitchRow label="Account Disabled" checked={internalDetails.accountDisabled} />
                    <SwitchRow label="Password Never Expires" checked={internalDetails.passwordNeverExpires} />
                    <SwitchRow label="Change Password at Next Login" checked={internalDetails.changePasswordNextLogin} />
                    <div className="flex items-center text-xs">
                      <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Description</span>
                      <span style={{ color: '#333' }}>{internalDetails.description}</span>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === 'attributes' && internalDetails && (
              <div className="border border-border rounded p-3 bg-card text-xs">
                <div className="text-xs font-semibold mb-2" style={{ color: '#333' }}>Custom Attributes</div>
                {internalDetails.customAttributes.length === 0 ? (
                  <div style={{ color: '#888' }}>No custom attributes defined</div>
                ) : (
                  <div className="border border-border rounded overflow-auto">
                    <table className="w-full text-[11px]">
                      <thead><tr style={{ background: '#f0f0f0' }}>
                        <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Attribute Name</th>
                        <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Value</th>
                      </tr></thead>
                      <tbody>
                        {internalDetails.customAttributes.map((a, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                            <td className="p-2 font-mono" style={{ color: '#049fd9' }}>{a.name}</td>
                            <td className="p-2 font-mono">{a.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <button className="mt-2 text-[10px] px-2 py-1 rounded text-white" style={{ background: '#049fd9' }} onClick={() => toast.info("Add attribute dialog would open here")}>+ Add Attribute</button>
              </div>
            )}
          </>
        )}

        {type === 'admin' && adminDetails && (
          <>
            <div className="flex border-b border-border">
              {(['general', 'access'] as const).map(t => (
                <button key={t} className="px-4 py-1.5 text-xs font-medium border-b-2 transition-colors capitalize"
                  style={{ color: tab === t ? '#049fd9' : '#666', borderBottomColor: tab === t ? '#049fd9' : 'transparent' }}
                  onClick={() => setTab(t)}>{t === 'general' ? 'General' : 'Menu Access'}</button>
              ))}
            </div>

            {tab === 'general' && (
              <div className="border border-border rounded p-3 bg-card text-xs space-y-2">
                <FieldRow label="Username" defaultValue={user.name} />
                <FieldRow label="Email" defaultValue={user.email} type="email" />
                <FieldRow label="Password" defaultValue="●●●●●●●●" type="password" />
                <div className="flex items-center text-xs">
                  <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Admin Groups</span>
                  <div className="flex flex-wrap gap-1">
                    {adminDetails.adminGroups.map(g => (
                      <span key={g} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: '#049fd920', color: '#049fd9' }}>{g}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Status</span>
                  <span>{user.status}</span>
                </div>
                <div className="flex items-center text-xs">
                  <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>Description</span>
                  <span style={{ color: '#333' }}>{adminDetails.description}</span>
                </div>
              </div>
            )}

            {tab === 'access' && (
              <div className="border border-border rounded overflow-auto bg-card">
                <table className="w-full text-[11px]">
                  <thead><tr style={{ background: '#f0f0f0' }}>
                    <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Menu Item</th>
                    <th className="text-left p-2 font-semibold" style={{ color: '#555' }}>Access</th>
                  </tr></thead>
                  <tbody>
                    {adminDetails.menuAccess.map((m, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                        <td className="p-2">{m.menu}</td>
                        <td className="p-2">{m.access ? <CheckCircle size={12} style={{ color: '#6cc04a' }} /> : <XCircle size={12} style={{ color: '#cc0000' }} />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        <DialogFooter className="gap-2 mt-3">
          <Button variant="outline" size="sm" style={{ color: '#cc0000', borderColor: '#cc0000' }} onClick={handleDelete}>Delete</Button>
          <Button variant="outline" size="sm" onClick={() => { toast("Changes discarded"); onOpenChange(false); }}>Cancel</Button>
          <Button size="sm" style={{ background: '#049fd9' }} onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FieldRow = ({ label, defaultValue, type = 'text' }: { label: string; defaultValue: string; type?: string }) => (
  <div className="flex items-center text-xs">
    <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <input className="flex-1 border border-border rounded px-2 py-1 text-xs bg-background" type={type} defaultValue={defaultValue} />
  </div>
);

const SwitchRow = ({ label, checked }: { label: string; checked: boolean }) => (
  <div className="flex items-center text-xs gap-2">
    <span className="w-40 font-medium shrink-0" style={{ color: '#555' }}>{label}</span>
    <Switch defaultChecked={checked} className="scale-75" />
  </div>
);

export default UserDetailDialog;
