import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import s from './SuperAdminPanel.module.css';

export default function SuperAdminPanel({ showToast }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // pending | approved | rejected | all

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (filter !== 'all') query = query.eq('status', filter);
            const { data, error } = await query;
            if (error) throw error;
            setUsers(data || []);
        } catch (e) {
            console.error('fetchUsers error:', e);
            showToast('❌ İstifadəçilər yüklənmədi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [filter]);

    const approve = async (id, name) => {
        await supabase.from('profiles').update({ status: 'approved', approved_at: new Date().toISOString() }).eq('id', id);
        showToast(`✅ ${name} təsdiqləndi`);
        fetchUsers();
    };

    const reject = async (id, name) => {
        await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id);
        showToast(`🚫 ${name} rədd edildi`);
        fetchUsers();
    };

    const statusColor = { pending: '#f59e0b', approved: '#10b981', rejected: '#ef4444' };
    const statusLabel = { pending: '⏳ Gözləyir', approved: '✅ Təsdiqlənib', rejected: '🚫 Rədd edilib' };

    return (
        <div className={s.wrap}>
            <div className={s.header}>
                <div>
                    <h2 className={s.title}>İstifadəçi İdarəetməsi</h2>
                    <p className={s.sub}>Qeydiyyat sorğularını təsdiqləyin və ya rədd edin</p>
                </div>
                <button className={s.refreshBtn} onClick={fetchUsers}>
                    <i className="fa-solid fa-rotate" /> Yenilə
                </button>
            </div>

            {/* Filter Pills */}
            <div className={s.filters}>
                {['pending', 'approved', 'rejected', 'all'].map(f => (
                    <button
                        key={f}
                        className={`${s.pill} ${filter === f ? s.pillActive : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'pending' && '⏳ Gözləyənlər'}
                        {f === 'approved' && '✅ Təsdiqlənmiş'}
                        {f === 'rejected' && '🚫 Rədd edilmiş'}
                        {f === 'all' && '📋 Hamısı'}
                    </button>
                ))}
            </div>

            {/* Users List */}
            {loading ? (
                <div className={s.loading}><i className="fa-solid fa-spinner fa-spin" /> Yüklənir...</div>
            ) : users.length === 0 ? (
                <div className={s.empty}>
                    <i className="fa-solid fa-users" />
                    <p>Bu kateqoriyada istifadəçi yoxdur</p>
                </div>
            ) : (
                <div className={s.list}>
                    {users.map(user => (
                        <div key={user.id} className={s.userCard}>
                            <div className={s.avatar}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className={s.info}>
                                <div className={s.name}>{user.name}</div>
                                <div className={s.email}>{user.email}</div>
                                <div className={s.meta}>
                                    <span
                                        className={s.status}
                                        style={{ background: statusColor[user.status] + '20', color: statusColor[user.status], borderColor: statusColor[user.status] + '40' }}
                                    >
                                        {statusLabel[user.status]}
                                    </span>
                                    <span className={s.date}>
                                        <i className="fa-regular fa-clock" />
                                        {new Date(user.created_at).toLocaleDateString('az-AZ', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                            <div className={s.actions}>
                                {user.status !== 'approved' && (
                                    <button className={s.approveBtn} onClick={() => approve(user.id, user.name)}>
                                        <i className="fa-solid fa-check" /> Təsdiqlə
                                    </button>
                                )}
                                {user.status !== 'rejected' && (
                                    <button className={s.rejectBtn} onClick={() => reject(user.id, user.name)}>
                                        <i className="fa-solid fa-xmark" /> Rədd Et
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
