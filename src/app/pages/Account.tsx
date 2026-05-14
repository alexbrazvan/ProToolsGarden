import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, MapPin, CreditCard, Package,
  Settings, LogOut, Edit2, Plus, Trash2, Check, X,
  Eye, EyeOff, ChevronRight, Home, Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Address {
  id: string
  label: string
  full_name: string
  phone?: string
  street: string
  city: string
  county?: string
  postal_code?: string
  country: string
  is_default: boolean
}

interface Order {
  id: string
  order_number: string
  status: string
  total_cents: number
  currency: string
  payment_status: string
  created_at: string
}

type ActiveSection = 'overview' | 'profile' | 'addresses' | 'password' | 'orders' | 'payment'

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    delivered: 'bg-green-100 text-green-700',
    shipped: 'bg-blue-100 text-blue-700',
    processing: 'bg-yellow-100 text-yellow-700',
    pending: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-red-100 text-red-700',
  }
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Account() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ActiveSection>('overview');

  // ── Profile edit ──────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Addresses ─────────────────────────────────────────────────────────────
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Acasă', full_name: '', phone: '', street: '',
    city: '', county: '', postal_code: '', country: 'România', is_default: false,
  });
  const [addressMsg, setAddressMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Password ──────────────────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Orders ────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const displayName = profile?.full_name || profile?.email?.split('@')[0];

  useEffect(() => {
    if (activeSection === 'addresses') loadAddresses();
    if (activeSection === 'orders') loadOrders();
  }, [activeSection]);

  // sync form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({ full_name: profile.full_name || '', phone: profile.phone || '' });
    }
  }, [profile]);

  const loadAddresses = async () => {
    setAddressesLoading(true);
    const { data } = await supabase.from('addresses').select('*').order('is_default', { ascending: false });
    setAddresses(data || []);
    setAddressesLoading(false);
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setOrdersLoading(false);
  };

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    if (!profile) return;
    setProfileLoading(true);
    setProfileMsg(null);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileForm.full_name, phone: profileForm.phone })
      .eq('id', profile.id);
    if (error) {
      setProfileMsg({ type: 'error', text: 'Eroare la salvare. Încearcă din nou.' });
    } else {
      setProfileMsg({ type: 'success', text: 'Profilul a fost actualizat cu succes!' });
    }
    setProfileLoading(false);
  };

  // ── Save address ──────────────────────────────────────────────────────────
  const handleSaveAddress = async () => {
    if (!profile) return;
    setAddressMsg(null);
    if (!addressForm.full_name || !addressForm.street || !addressForm.city) {
      setAddressMsg({ type: 'error', text: 'Te rog completează câmpurile obligatorii (*).' });
      return;
    }
    if (addressForm.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', profile.id);
    }
    const payload = { ...addressForm, user_id: profile.id };
    const { error } = editingAddress
      ? await supabase.from('addresses').update(addressForm).eq('id', editingAddress.id)
      : await supabase.from('addresses').insert(payload);

    if (error) {
      setAddressMsg({ type: 'error', text: 'Eroare la salvare.' });
      return;
    }
    setAddressMsg({ type: 'success', text: editingAddress ? 'Adresa actualizată!' : 'Adresa adăugată!' });
    setShowAddressForm(false);
    setEditingAddress(null);
    resetAddressForm();
    await loadAddresses();
  };

  const resetAddressForm = () => setAddressForm({
    label: 'Acasă', full_name: profile?.full_name || '', phone: profile?.phone || '',
    street: '', city: '', county: '', postal_code: '', country: 'România', is_default: false,
  });

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setAddressForm({ label: addr.label, full_name: addr.full_name, phone: addr.phone || '', street: addr.street, city: addr.city, county: addr.county || '', postal_code: addr.postal_code || '', country: addr.country, is_default: addr.is_default });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (id: string) => {
    await supabase.from('addresses').delete().eq('id', id);
    await loadAddresses();
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (passwordForm.new.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Parola nouă trebuie să aibă minim 6 caractere.' });
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMsg({ type: 'error', text: 'Parolele noi nu coincid.' });
      return;
    }
    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: passwordForm.new });
    if (error) {
      setPasswordMsg({ type: 'error', text: error.message });
    } else {
      setPasswordMsg({ type: 'success', text: 'Parola a fost schimbată cu succes!' });
      setPasswordForm({ new: '', confirm: '' });
    }
    setPasswordLoading(false);
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
  } finally {
    navigate('/', { replace: true });
  }
};

  if (!profile) return null;

  const navItems = [
    { id: 'overview', label: 'Prezentare generală', icon: User },
    { id: 'profile', label: 'Informații profil', icon: Edit2 },
    { id: 'addresses', label: 'Adrese', icon: MapPin },
    { id: 'orders', label: 'Comenzile mele', icon: Package },
    { id: 'password', label: 'Schimbă parola', icon: Settings },
    { id: 'payment', label: 'Metode de plată', icon: CreditCard },
  ];

  const inputClass = "w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <div className="min-h-screen bg-secondary/20">

      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-1">Contul meu</h1>
            <p className="opacity-80">Bună, {displayName}!</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border overflow-hidden sticky top-24">
              <div className="p-6 text-center border-b border-border">
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
                <p className="font-bold text-lg">{displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              </div>
              <nav className="p-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as ActiveSection)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                      activeSection === item.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {activeSection !== item.id && <ChevronRight size={14} className="text-muted-foreground" />}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                  <LogOut size={16} /> Deconectează-te
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >

                {/* ── OVERVIEW ── */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-border p-6">
                      <h2 className="text-xl font-bold mb-5">Detalii cont</h2>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium">{profile.email}</p>
                          </div>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-3">
                            <Phone size={18} className="text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Telefon</p>
                              <p className="text-sm font-medium">{profile.phone}</p>
                            </div>
                          </div>
                        )}
                        {profile.created_at && (
                          <div className="flex items-center gap-3">
                            <User size={18} className="text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground">Membru din</p>
                              <p className="text-sm font-medium">
                                {new Date(profile.created_at).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {navItems.slice(1).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id as ActiveSection)}
                          className="bg-white rounded-xl border border-border p-5 text-left hover:border-accent hover:shadow-sm transition-all group"
                        >
                          <item.icon size={28} className="text-accent mb-3" />
                          <p className="font-bold">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            Gestionează <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── PROFILE EDIT ── */}
                {activeSection === 'profile' && (
                  <div className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-xl font-bold mb-6">Informații profil</h2>
                    {profileMsg && (
                      <div className={`mb-5 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {profileMsg.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        {profileMsg.text}
                      </div>
                    )}
                    <div className="space-y-5 max-w-lg">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Nume complet</label>
                        <input type="text" value={profileForm.full_name} onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })} placeholder="Numele tău complet" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Telefon</label>
                        <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} placeholder="07xx xxx xxx" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input type="email" value={profile.email} disabled className={`${inputClass} bg-secondary/50 text-muted-foreground cursor-not-allowed`} />
                        <p className="text-xs text-muted-foreground mt-1">Emailul nu poate fi modificat din această secțiune.</p>
                      </div>
                      <button onClick={handleSaveProfile} disabled={profileLoading} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {profileLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Check size={16} />}
                        Salvează modificările
                      </button>
                    </div>
                  </div>
                )}

                {/* ── ADDRESSES ── */}
                {activeSection === 'addresses' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">Adresele mele</h2>
                      <button
                        onClick={() => { resetAddressForm(); setEditingAddress(null); setShowAddressForm(true); }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        <Plus size={16} /> Adaugă adresă
                      </button>
                    </div>

                    {addressMsg && (
                      <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${addressMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {addressMsg.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        {addressMsg.text}
                      </div>
                    )}

                    <AnimatePresence>
                      {showAddressForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl border border-accent/30 p-6 overflow-hidden">
                          <h3 className="font-bold mb-5">{editingAddress ? 'Editează adresa' : 'Adresă nouă'}</h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Etichetă</label>
                              <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className={inputClass}>
                                <option>Acasă</option><option>Serviciu</option><option>Alt</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Nume complet *</label>
                              <input type="text" value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Telefon</label>
                              <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className={inputClass} />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium mb-1.5">Stradă *</label>
                              <input type="text" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} placeholder="Str. Exemplu, nr. 1, ap. 2" className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Oraș *</label>
                              <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Județ</label>
                              <input type="text" value={addressForm.county} onChange={(e) => setAddressForm({ ...addressForm, county: e.target.value })} className={inputClass} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1.5">Cod poștal</label>
                              <input type="text" value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} className={inputClass} />
                            </div>
                            <div className="sm:col-span-2 flex items-center gap-2">
                              <input type="checkbox" id="is_default" checked={addressForm.is_default} onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })} className="rounded border-border" />
                              <label htmlFor="is_default" className="text-sm cursor-pointer">Setează ca adresă implicită</label>
                            </div>
                          </div>
                          <div className="flex gap-3 mt-5">
                            <button onClick={handleSaveAddress} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                              <Check size={16} /> Salvează
                            </button>
                            <button onClick={() => { setShowAddressForm(false); setEditingAddress(null); }} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors">
                              Anulează
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {addressesLoading ? (
                      <div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                    ) : addresses.length === 0 ? (
                      <div className="bg-white rounded-xl border border-border p-10 text-center">
                        <MapPin size={40} className="text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">Nu ai adrese salvate încă.</p>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div key={addr.id} className={`bg-white rounded-xl border p-5 relative ${addr.is_default ? 'border-accent' : 'border-border'}`}>
                            {addr.is_default && <span className="absolute top-3 right-3 bg-accent/10 text-accent text-xs font-bold px-2 py-0.5 rounded-full">Implicit</span>}
                            <div className="flex items-center gap-2 mb-3">
                              {addr.label === 'Acasă' ? <Home size={18} className="text-primary" /> : <Building2 size={18} className="text-primary" />}
                              <span className="font-bold">{addr.label}</span>
                            </div>
                            <p className="text-sm font-medium">{addr.full_name}</p>
                            <p className="text-sm text-muted-foreground">{addr.street}</p>
                            <p className="text-sm text-muted-foreground">{addr.city}{addr.county ? `, ${addr.county}` : ''}{addr.postal_code ? ` ${addr.postal_code}` : ''}</p>
                            <p className="text-sm text-muted-foreground">{addr.country}</p>
                            {addr.phone && <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>}
                            <div className="flex gap-3 mt-4">
                              <button onClick={() => handleEditAddress(addr)} className="flex items-center gap-1.5 text-xs text-primary hover:underline"><Edit2 size={13} /> Editează</button>
                              <button onClick={() => handleDeleteAddress(addr.id)} className="flex items-center gap-1.5 text-xs text-red-500 hover:underline"><Trash2 size={13} /> Șterge</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── ORDERS ── */}
                {activeSection === 'orders' && (
                  <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-bold">Istoricul comenzilor</h2>
                    </div>
                    {ordersLoading ? (
                      <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
                    ) : orders.length === 0 ? (
                      <div className="p-12 text-center">
                        <Package size={48} className="text-muted-foreground mx-auto mb-4" />
                        <p className="font-bold text-lg mb-1">Nu ai comenzi încă</p>
                        <p className="text-sm text-muted-foreground mb-6">Comenzile tale vor apărea aici după prima comandă.</p>
                        <button onClick={() => navigate('/')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                          Începe cumpărăturile
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-secondary/50">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-bold">Comandă</th>
                              <th className="px-6 py-4 text-left text-sm font-bold">Data</th>
                              <th className="px-6 py-4 text-left text-sm font-bold">Total</th>
                              <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-bold">Plată</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-6 py-4 font-medium text-sm">{order.order_number}</td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('ro-RO')}</td>
                                <td className="px-6 py-4 font-bold text-sm">{(order.total_cents / 100).toFixed(2)} {order.currency}</td>
                                <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                                <td className="px-6 py-4"><StatusBadge status={order.payment_status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ── PASSWORD ── */}
                {activeSection === 'password' && (
                  <div className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-xl font-bold mb-2">Schimbă parola</h2>
                    <p className="text-sm text-muted-foreground mb-6">Parola nouă trebuie să aibă minim 6 caractere.</p>
                    {passwordMsg && (
                      <div className={`mb-5 px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {passwordMsg.type === 'success' ? <Check size={16} /> : <X size={16} />}
                        {passwordMsg.text}
                      </div>
                    )}
                    <div className="space-y-5 max-w-md">
                      {(['new', 'confirm'] as const).map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium mb-1.5">
                            {field === 'new' ? 'Parolă nouă' : 'Confirmă parola nouă'}
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords[field] ? 'text' : 'password'}
                              value={passwordForm[field]}
                              onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
                              placeholder="••••••••"
                              className={`${inputClass} pr-11`}
                            />
                            <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] })} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPasswords[field] ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={handleChangePassword} disabled={passwordLoading} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2">
                        {passwordLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Check size={16} />}
                        Schimbă parola
                      </button>
                    </div>
                  </div>
                )}

                {/* ── PAYMENT ── */}
                {activeSection === 'payment' && (
                  <div className="bg-white rounded-xl border border-border p-6">
                    <h2 className="text-xl font-bold mb-2">Metode de plată</h2>
                    <p className="text-sm text-muted-foreground mb-6">Plățile sunt procesate securizat. Noi nu stocăm date de card.</p>
                    <div className="space-y-4">
                      <div className="rounded-xl border-2 border-accent/30 bg-accent/5 p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                            <CreditCard size={24} className="text-accent" />
                          </div>
                          <div>
                            <p className="font-bold text-lg">Stripe — Card bancar</p>
                            <p className="text-sm text-muted-foreground mt-1">Plată securizată cu Visa, Mastercard, AMEX, Apple Pay sau Google Pay. Stripe gestionează toate datele cardului.</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {['Visa', 'Mastercard', 'AMEX', 'Apple Pay', 'Google Pay'].map((m) => (
                                <span key={m} className="text-xs bg-white border border-border px-2.5 py-1 rounded-md font-medium">{m}</span>
                              ))}
                            </div>
                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 inline-block">
                              ⏳ În curs de implementare — disponibil în curând
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                            <Package size={24} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold">Ramburs (Cash la livrare)</p>
                            <p className="text-sm text-muted-foreground mt-1">Plătești la primirea coletului. Disponibil pentru toate comenzile.</p>
                            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium mt-2 inline-block">✓ Disponibil</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                            <Building2 size={24} className="text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-bold">Transfer bancar</p>
                            <p className="text-sm text-muted-foreground mt-1">Plată prin ordin de plată. Comanda se procesează după confirmare (1-2 zile lucrătoare).</p>
                            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium mt-2 inline-block">✓ Disponibil</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
