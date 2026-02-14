import React, { useState, useEffect, useMemo } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import {
    DownloadSimple, Funnel, UserPlus, FileCsv, CheckCircle, XCircle, TrendUp, Users, Check,
    Buildings, CalendarCheck, Lightbulb, CaretRight, SmileySad, Database // Added Database and SmileySad
} from '@phosphor-icons/react';
import { leadService, userService, projectService, visitService } from '../services/api';
import socketService from '../services/socket';
import Skeleton from '../components/Skeleton';

const LeadsAnalytics = () => {
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeads, setSelectedLeads] = useState([]);
    const [filters, setFilters] = useState({
        status: 'All',
        source: 'All',
        dateRange: '30_days',
        assignedTo: 'All'
    });
    const [activeStatusView, setActiveStatusView] = useState('Cold'); // For the impact card interaction
    const [chartView, setChartView] = useState('Status'); // 'Status' or 'Source'

    // --- Data Fetching & Real-time Updates ---
    useEffect(() => {
        fetchData();

        const handleNewLead = (newLead) => setLeads(prev => [newLead, ...prev]);

        socketService.on('lead-added', handleNewLead);
        socketService.on('newLead', handleNewLead);
        socketService.on('lead-updated', (updatedLead) => setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l)));

        return () => {
            socketService.off('lead-added');
            socketService.off('newLead');
            socketService.off('lead-updated');
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [leadsData, usersData, projectsData, visitsData] = await Promise.all([
                leadService.getAll(),
                userService.getAll(),
                projectService.getAll(),
                visitService.getAll()
            ]);
            setLeads(leadsData || []);
            setUsers(usersData || []);
            setProjects(projectsData || []);
            setVisits(visitsData || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Admin Actions ---
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
            await leadService.update(id, { status: newStatus });
        } catch (error) {
            console.error("Update failed:", error);
            fetchData();
        }
    };

    const handleAssignUser = async (id, userId) => {
        try {
            const user = users.find(u => u._id === userId);
            setLeads(prev => prev.map(l => l._id === id ? { ...l, assignedTo: user } : l));
            await leadService.update(id, { assignedTo: userId });
        } catch (error) {
            console.error("Assignment failed:", error);
            fetchData();
        }
    };

    const handleBulkAssign = async (userId) => {
        if (!userId) return;
        const user = users.find(u => u._id === userId);
        try {
            const updates = selectedLeads.map(id => leadService.update(id, { assignedTo: userId }));
            await Promise.all(updates);
            setLeads(prev => prev.map(l => selectedLeads.includes(l._id) ? { ...l, assignedTo: user } : l));
            setSelectedLeads([]);
            // Could add a toast notification here
        } catch (error) {
            console.error("Bulk assignment failed:", error);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) setSelectedLeads(filteredLeads.map(l => l._id));
        else setSelectedLeads([]);
    };

    const handleSelectLead = (id) => {
        setSelectedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
    };

    const handleExport = () => {
        const leadsToExport = selectedLeads.length > 0 ? leads.filter(l => selectedLeads.includes(l._id)) : filteredLeads;
        const headers = ["Name,Phone,Source,Status,Assigned To,Date\n"];
        const rows = leadsToExport.map(l => `${l.name},${l.phone},${l.source || 'Website'},${l.status},${l.assignedTo?.name || 'Unassigned'},${new Date(l.createdAt).toLocaleDateString()}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `leads_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Analytics Logic ---
    const filteredLeads = useMemo(() => {
        let result = [...leads];
        if (filters.status !== 'All') result = result.filter(l => l.status === filters.status);
        if (filters.source !== 'All') result = result.filter(l => (l.source || 'Website') === filters.source);
        if (filters.assignedTo !== 'All') result = result.filter(l => (l.assignedTo?._id || 'Unassigned') === filters.assignedTo);

        const now = new Date();
        if (filters.dateRange === '7_days') {
            const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
            result = result.filter(l => new Date(l.createdAt) >= sevenDaysAgo);
        } else if (filters.dateRange === '30_days') {
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            result = result.filter(l => new Date(l.createdAt) >= thirtyDaysAgo);
        }
        return result;
    }, [leads, filters]);

    const metrics = useMemo(() => {
        const statusCounts = {};
        const sourceCounts = {};

        leads.forEach(lead => {
            const status = lead.status || 'New';
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            const source = lead.source || 'Website';
            sourceCounts[source] = (sourceCounts[source] || 0) + 1;
        });

        const statusPieData = [
            { name: 'Hot', value: statusCounts['Hot'] || 0, color: '#ef4444' }, // Red
            { name: 'Warm', value: statusCounts['Warm'] || 0, color: '#f97316' }, // Orange
            { name: 'Cold', value: statusCounts['Cold'] || 0, color: '#3b82f6' }, // Blue
            { name: 'New', value: statusCounts['New'] || 0, color: '#A0A0A0' }, // Grey
            { name: 'Converted', value: statusCounts['Converted'] || 0, color: '#10B981' } // Green
        ].filter(d => d.value > 0);

        const sourcePieData = [
            { name: 'WhatsApp', value: sourceCounts['WhatsApp Button'] || 0, color: '#25D366' }, // WhatsApp Green
            { name: 'Linktree', value: sourceCounts['Linktree'] || 0, color: '#43E660' }, // Linktree Green
            { name: 'Instagram', value: sourceCounts['Instagram'] || 0, color: '#E1306C' }, // Instagram Pink
            { name: 'Website', value: sourceCounts['Website'] || 0, color: '#3b82f6' }, // Website Blue
            { name: 'Other', value: sourceCounts['Other'] || 0, color: '#A0A0A0' } // Other Grey
        ].filter(d => d.value > 0);

        return { statusCounts, statusPieData, sourcePieData };
    }, [leads]);

    // Derived Impact Data
    const impactData = useMemo(() => {
        const activeProject = projects[0] || { title: 'No Projects Found', totalUnits: 100, soldUnits: 0 };
        const upcomingVisits = visits.filter(v => ['Scheduled', 'Confirmed'].includes(v.status)).length;
        const availability = activeProject.totalUnits - activeProject.soldUnits;
        const soldPercentage = Math.round((activeProject.soldUnits / activeProject.totalUnits) * 100);

        return {
            projectName: activeProject.title,
            availability,
            soldPercentage,
            upcomingVisits,
            strategyTip: activeStatusView === 'Cold'
                ? "Send a re-engagement email sequence highlighting new project amenities."
                : activeStatusView === 'Hot'
                    ? "Schedule personal site visits immediately. Urgency closes deals."
                    : "Add to monthly newsletter for long-term brand awareness."
        };
    }, [projects, visits, activeStatusView]);


    if (loading) {
        return (
            <div style={{ padding: '2rem', height: '100%', overflowY: 'hidden' }}>
                {/* Header Skeleton */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div style={{ width: '200px' }}><Skeleton height="40px" /></div>
                </div>

                {/* Top Section Skeleton */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '2rem', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Skeleton width="200px" height="200px" borderRadius="50%" />
                    </div>
                    <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Skeleton width="40%" height="30px" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <Skeleton height="80px" />
                            <Skeleton height="80px" />
                            <Skeleton height="80px" />
                            <Skeleton height="80px" />
                        </div>
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <Skeleton width="200px" height="30px" />
                        <Skeleton width="100px" height="40px" />
                    </div>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <Skeleton width="5%" />
                            <Skeleton width="20%" />
                            <Skeleton width="15%" />
                            <Skeleton width="15%" />
                            <Skeleton width="20%" />
                            <Skeleton width="15%" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentPieData = chartView === 'Status' ? metrics.statusPieData : metrics.sourcePieData;

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>

            {/* Top Section: Charts & Impact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem', marginBottom: '2rem' }}>

                {/* Left Card: Distribution */}
                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', minHeight: '400px' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Lead {chartView}</h3>
                        <div style={{ display: 'flex', background: '#f5f5f5', borderRadius: '8px', padding: '4px' }}>
                            {['Status', 'Source'].map((view) => (
                                <button
                                    key={view}
                                    onClick={() => setChartView(view)}
                                    style={{
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: chartView === view ? '#fff' : 'transparent',
                                        boxShadow: chartView === view ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                        color: chartView === view ? '#000' : '#888',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {view}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                        <ResponsiveContainer width={260} height={260}>
                            <PieChart>
                                <Pie
                                    data={currentPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {currentPieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => chartView === 'Status' && setActiveStatusView(entry.name)}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{leads.length}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600, letterSpacing: '1px' }}>TOTAL</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                        {currentPieData.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color }}></div>
                                <span style={{ fontSize: '0.9rem', color: 'var(--charcoal)', fontWeight: 500 }}>{item.name} ({item.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Card: Impact & Insights */}
                <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: chartView === 'Status' ? (metrics.statusPieData.find(d => d.name === activeStatusView)?.color || '#3b82f6') : '#3b82f6' }}></div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{activeStatusView} Lead Impact</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Active Projects */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#3b82f6' }}>
                                <Buildings size={22} weight="fill" />
                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Active Projects</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--charcoal)', fontSize: '0.9rem', marginLeft: '30px' }}>
                                <CaretRight size={14} /> {impactData.projectName}
                            </div>
                        </div>

                        {/* Inventory Availability */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#3b82f6' }}>
                                <Database size={22} weight="fill" /> {/* Using generic Icon as placeholder */}
                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Inventory Availability</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginLeft: '30px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{isNaN(impactData.soldPercentage) ? 0 : impactData.soldPercentage}% Sold</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#3b82f6' }}>{impactData.availability} Left</span>
                            </div>
                        </div>

                        {/* Scheduled Site Visits */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#3b82f6' }}>
                                <CalendarCheck size={22} weight="fill" />
                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Scheduled Site Visits</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '30px' }}>
                                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3b82f6' }}>{impactData.upcomingVisits}</span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--charcoal)' }}>upcoming</span>
                            </div>
                        </div>

                        {/* Strategy Tip */}
                        <div style={{ background: '#e0f2fe', borderRadius: '12px', padding: '1.2rem' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '6px' }}>Strategy Tip</div>
                            <div style={{ fontSize: '0.8rem', color: '#0c4a6e', lineHeight: '1.4' }}>
                                {impactData.strategyTip}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leads Management Header */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Leads Management</h2>
                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>Recent Performance History</p>
                    </div>
                    <button onClick={() => setFilters({ ...filters, limit: 100 })} style={{ padding: '8px 16px', borderRadius: '8px', background: '#e0f2fe', color: '#0369a1', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                        View All Leads
                    </button>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} style={filterStyle}>
                        <option value="All">Status: All</option>
                        <option value="New">New</option>
                        <option value="Hot">Hot</option>
                        <option value="Cold">Cold</option>
                    </select>
                    <select value={filters.source} onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))} style={filterStyle}>
                        <option value="All">Source: All</option>
                        <option value="WhatsApp Button">WhatsApp</option>
                        <option value="Linktree">Linktree</option>
                        <option value="Website">Website</option>
                        <option value="Instagram">Instagram</option>
                    </select>
                    <select value={filters.assignedTo} onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))} style={filterStyle}>
                        <option value="All">Assigned: All</option>
                        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                    </select>
                    <div style={{ flex: 1 }}></div>
                    {/* Bulk Actions */}
                    {selectedLeads.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <select onChange={(e) => handleBulkAssign(e.target.value)} style={{ ...filterStyle, background: 'var(--pivot-blue-soft)', color: 'var(--pivot-blue)', border: 'none' }} defaultValue="">
                                <option value="" disabled>Assign Selected ({selectedLeads.length})</option>
                                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#888', fontSize: '0.85rem' }}>
                                <th style={{ padding: '0 1rem', width: '40px' }}><input type="checkbox" onChange={handleSelectAll} checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0} /></th>
                                <th style={{ padding: '0 1rem' }}>LEAD NAME</th>
                                <th style={{ padding: '0 1rem' }}>SOURCE</th>
                                <th style={{ padding: '0 1rem' }}>STATUS</th>
                                <th style={{ padding: '0 1rem' }}>ASSIGNED TO</th>
                                <th style={{ padding: '0 1rem' }}>DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.length > 0 ? (
                                filteredLeads.slice(0, 10).map((lead, i) => (
                                    <tr key={i} style={{ background: selectedLeads.includes(lead._id) ? '#f0f7ff' : '#fff', transition: 'all 0.2s', borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <input type="checkbox" checked={selectedLeads.includes(lead._id)} onChange={() => handleSelectLead(lead._id)} />
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{lead.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{lead.phone}</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#555' }}>
                                            {lead.source || 'Website'}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <select
                                                value={lead.status || 'New'}
                                                onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                                                style={{
                                                    padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                                                    background: getStatusColor(lead.status).bg, color: getStatusColor(lead.status).text
                                                }}
                                            >
                                                <option value="New">New</option>
                                                <option value="Hot">Hot</option>
                                                <option value="Warm">Warm</option>
                                                <option value="Cold">Cold</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.9rem', color: '#555' }}>
                                            {lead.assignedTo?.name || 'Unassigned'}
                                        </td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', color: '#888' }}>
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', opacity: 0.7 }}>
                                            <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '50%' }}>
                                                <SmileySad size={32} />
                                            </div>
                                            <p style={{ fontWeight: 500 }}>No leads found matching your filters.</p>
                                            <button
                                                onClick={() => setFilters({ status: 'All', source: 'All', dateRange: 'all_time', assignedTo: 'All' })}
                                                style={{ marginTop: '5px', color: '#0047AB', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                                            >
                                                Clear Filtering
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Hot': return { bg: '#fee2e2', text: '#ef4444' }; // Red
        case 'Warm': return { bg: '#ffedd5', text: '#f97316' }; // Orange
        case 'Converted': return { bg: '#dcfce7', text: '#16a34a' }; // Green
        case 'Cold': return { bg: '#dbeafe', text: '#3b82f6' }; // Blue
        default: return { bg: '#f3f4f6', text: '#6b7280' }; // Grey
    }
};

const filterStyle = {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #eee',
    background: '#fff',
    fontSize: '0.85rem',
    color: '#555',
    cursor: 'pointer'
};

export default LeadsAnalytics;
