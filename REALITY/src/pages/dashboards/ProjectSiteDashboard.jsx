import React, { useState, useEffect } from 'react';
import {
    HardHat, Users, CheckCircle, Clock,
    ArrowRight, MapPin, ChartBar, Plus,
    UsersThree, TrendUp, ClipboardText, Notebook,
    ListChecks, Calendar, WarningCircle, Monitor,
    ShieldWarning, Package, FileArrowUp, VideoCamera,
    Camera, PaperPlaneRight
} from '@phosphor-icons/react';
import { attendanceService, expenseService } from '../../services/api';
import socketService from '../../services/socket';

const ProjectSiteDashboard = () => {
    // Static data for demo / UI structure
    const [stats] = useState([
        { label: 'Active Labor', value: '156', icon: <Users size={24} />, color: '#4CAF50' },
        { label: 'Site Productivity', value: '92%', icon: <TrendUp size={24} />, color: 'var(--pivot-blue)' },
        { label: 'Open Issues', value: '4', icon: <WarningCircle size={24} />, color: '#f44336' }
    ]);

    const dailyTasks = [
        { id: 1, task: 'Excavation - Sector 3', team: 'Earthmovers A', progress: 100, status: 'Completed' },
        { id: 2, task: 'Pillar Casting - B1', team: 'Masonry Group 1', progress: 65, status: 'In Progress' },
        { id: 3, task: 'Waterproofing - Basement', team: 'Sub-Vendor X', progress: 20, status: 'Delayed' }
    ];

    const materialUsage = [
        { item: 'Cement (Grade 53)', used: '45 Bags', remaining: '210 Bags', status: 'Optimal' },
        { item: 'Steel Rails (12mm)', used: '1.2 Tons', remaining: '4 Tons', status: 'Optimal' },
        { item: 'Coarse Sand', used: '2 Trucks', remaining: '0.5 Trucks', status: 'Low' }
    ];

    // Dynamic data from API
    const [attendance, setAttendance] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attendanceData, expensesData] = await Promise.all([
                    attendanceService.getAll(),
                    expenseService.getAll()
                ]);
                setAttendance(attendanceData);
                setExpenses(expensesData);
            } catch (error) {
                console.error("Failed to fetch site data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        const handleNewAttendance = (a) => setAttendance(prev => [a, ...prev]);
        const handleNewExpense = (e) => setExpenses(prev => [e, ...prev]);

        socketService.on('attendance-added', handleNewAttendance);
        socketService.on('expense-added', handleNewExpense);

        return () => {
            socketService.off('attendance-added');
            socketService.off('expense-added');
        };
    }, []);

    const handleAddAttendance = async () => {
        const shift = prompt("Enter shift name:");
        if (!shift) return;
        try {
            await attendanceService.create({ shift, present: 0, absent: 0 });
        } catch (err) {
            console.error(err);
        }
    };

    // Derived or Combined Attendance List (Prefer API, fall back to demo if empty)
    const displayAttendance = attendance.length > 0
        ? attendance.map((a, i) => ({
            trade: a.shift || `Shift ${i + 1}`,
            present: a.present || 0,
            total: (a.present || 0) + (a.absent || 0),
            productivity: 'Average' // Placeholder
        }))
        : [
            { trade: 'Skilled Masons', present: 24, total: 25, productivity: 'High' },
            { trade: 'Electricians', present: 12, total: 15, productivity: 'Average' },
            { trade: 'General Labor', present: 85, total: 90, productivity: 'High' }
        ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Site Operations Dashboard</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2c3e50', fontWeight: 600 }}>
                        <MapPin size={18} weight="bold" /> <span>Downtown Heights - Site A</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px',
                        background: 'white', color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        <ShieldWarning size={20} weight="bold" color="#e53e3e" /> Report Incident
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'var(--pivot-blue)', color: 'white', border: 'none',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 71, 171, 0.2)'
                    }}>
                        <Plus size={20} weight="bold" /> New Site Log
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((s, i) => (
                    <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '50px', height: '50px', borderRadius: '12px',
                            background: `${s.color}15`, color: s.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {s.icon}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#2c3e50', fontWeight: 700 }}>{s.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1a1a1a' }}>{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                {/* Column 1: Daily Tasks & Progress */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Daily Tasks Execution */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <ListChecks size={24} color="var(--pivot-blue)" weight="bold" /> Daily Execution Tracker
                            </h3>
                            <button style={{ fontSize: '0.8rem', color: 'var(--pivot-blue)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Manage Schedule</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {dailyTasks.map(t => (
                                <div key={t.id} style={{ padding: '1.2rem', background: '#f8f9fa', borderRadius: '14px', border: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div>
                                            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1a1a1a' }}>{t.task}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#2c3e50', fontWeight: 600 }}>Team: {t.team}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                                background: t.status === 'Completed' ? '#e6f4ea' : t.status === 'Delayed' ? '#fff5f5' : '#ebf4ff',
                                                color: t.status === 'Completed' ? '#1e7e34' : t.status === 'Delayed' ? '#e53e3e' : 'var(--pivot-blue)'
                                            }}>{t.status}</span>
                                        </div>
                                    </div>
                                    <div style={{ height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                        <div style={{ width: `${t.progress}%`, height: '100%', background: t.status === 'Delayed' ? '#f56565' : 'var(--pivot-blue)', transition: 'width 1s ease' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2c3e50' }}>Current Progress</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>{t.progress}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material Usage Tracking */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <Package size={24} color="var(--pivot-blue)" weight="bold" /> Material Usage Log
                            </h3>
                            <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Record Usage</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Item</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Usage Today</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Inventory</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: '#7a7a7a' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialUsage.map((m, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 700, color: '#1a1a1a' }}>{m.item}</td>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--pivot-blue)' }}>{m.used}</td>
                                        <td style={{ padding: '12px 8px', fontSize: '0.85rem', fontWeight: 600 }}>{m.remaining}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{
                                                fontSize: '0.65rem', padding: '4px 8px', borderRadius: '4px', fontWeight: 800,
                                                background: m.status === 'Optimal' ? '#e6f4ea' : '#fff5f5',
                                                color: m.status === 'Optimal' ? '#1e7e34' : '#e53e3e'
                                            }}>{m.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Site Photos & Media Logs (Visual Progress) */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <Monitor size={22} color="var(--pivot-blue)" weight="bold" /> Site Progress Media
                            </h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <Camera size={16} weight="bold" /> Photo
                                </button>
                                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                                    <VideoCamera size={16} weight="bold" /> Video
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ aspectRatio: '1', background: '#f8f9fa', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #eee', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <Plus size={20} color="#ccc" />
                                    <span style={{ fontSize: '0.6rem', color: '#ccc', marginTop: '5px', fontWeight: 700 }}>{i === 1 ? 'SLAB VIEW' : i === 2 ? 'PILLAR B' : 'SITE GEN'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2: Labor & Productivity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Safety Concerns & Alerts */}
                    <div className="card" style={{ background: '#fff9f9', border: '1px solid #fee2e2' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b' }}>
                            <ShieldWarning size={24} color="#dc2626" weight="fill" /> Safety & Issues Report
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ padding: '12px', background: 'white', borderRadius: '12px', borderLeft: '4px solid #dc2626' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', marginBottom: '4px' }}>HIGH PRIORITY</div>
                                <div style={{ fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 700 }}>Scaffolding on Floor 4 lacks proper toe-boards. Safety audit required.</div>
                            </div>
                            <button style={{ width: '100%', marginTop: '5px', padding: '10px', borderRadius: '10px', background: '#dc2626', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>Report New Hazard</button>
                        </div>
                    </div>

                    {/* Labor Attendance & Health */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <UsersThree size={24} color="#4CAF50" weight="bold" /> Labor & Attendance
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {displayAttendance.map((l, i) => (
                                <div key={i} style={{ paddingBottom: '12px', borderBottom: i !== displayAttendance.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1a1a1a' }}>{l.trade}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4CAF50' }}>{l.present}/{l.total}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: '#2c3e50', fontWeight: 600 }}>Shift: {l.trade.includes('Shift') ? 'General' : 'Active'}</div>
                                        <div style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: '#e6f4ea', color: '#1e7e34', fontWeight: 700 }}>{l.productivity} Productivity</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddAttendance} style={{ width: '100%', marginTop: '1.5rem', padding: '12px', borderRadius: '10px', background: '#f8f9fa', color: '#1a1a1a', border: '1px solid #ddd', fontWeight: 700, cursor: 'pointer' }}>Manage Attendance</button>
                    </div>

                    {/* Site Diary & Logs */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <Notebook size={24} color="var(--pivot-blue)" weight="bold" /> Site Diary & Activity Logs
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '10px', background: '#fff9e6', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#F59E0B', marginBottom: '4px' }}>WEATHER ALERT • 2PM</div>
                                <div style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 700 }}>Heavy rain predicted. Covering cement and securing loose material.</div>
                            </div>
                            <div style={{ padding: '10px', background: '#f0f7ff', borderRadius: '8px', borderLeft: '4px solid var(--pivot-blue)' }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '4px' }}>MATERIAL RECEIPT • 10:15 AM</div>
                                <div style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 700 }}>3 Cement trucks (Batch #122) arrived and unloaded at Sector 4 storage.</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7a7a7a', marginBottom: '8px', display: 'block' }}>Add New Log Entry</label>
                            <textarea placeholder="Record site activity..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '60px', fontSize: '0.85rem' }}></textarea>
                            <button style={{ width: '100%', marginTop: '8px', padding: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <PaperPlaneRight size={18} weight="bold" /> Save Log Entry
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .card {
                    background: white;
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                    transition: all 0.3s ease;
                }
                .card:hover {
                    box-shadow: 0 12px 40px rgba(0, 71, 171, 0.08);
                }
            `}</style>
        </div>
    );
};

export default ProjectSiteDashboard;
