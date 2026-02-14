import React, { useState } from 'react';
import {
    Blueprint, HardHat, Notebook,
    CheckSquare, Clock, FilePlus, ChatCenteredText,
    ArrowSquareOut, Plus, Buildings, ListChecks,
    DownloadSimple, MagnifyingGlass, Warning,
    Gavel, FileText, ClipboardText, Swap,
    Checks, FileArrowUp, PaperPlaneRight
} from '@phosphor-icons/react';

import IssueInstructionModal from '../../components/IssueInstructionModal';

const CivilEngineerDashboard = () => {
    const [showIssueInstructionModal, setShowIssueInstructionModal] = useState(false);
    const [assignedProjects] = useState([
        { id: 1, name: 'Saffron Greens', phase: 'Floor 12 Slab', task: 'Check Rebar Binding', deadline: 'Today', status: 'In Progress' },
        { id: 2, name: 'Metro Plaza', phase: 'Lower Basement', task: 'Waterproofing Audit', deadline: 'Tomorrow', status: 'Pending' }
    ]);

    const drawings = [
        { id: 'D102', name: 'Structural_Plan_F4.dwg', project: 'Saffron Greens', date: 'Feb 12', size: '12MB' },
        { id: 'D105', name: 'Electric_Layout_L2.pdf', project: 'Metro Plaza', date: 'Feb 10', size: '4.5MB' }
    ];

    const boqItems = [
        { item: 'Reinforcement Steel (TATA)', spec: 'Fe 500D (12mm)', unit: 'Metric Ton', qty: '45.0', status: 'Approved' },
        { item: 'ReadyMix Concrete', spec: 'M35 Grade', unit: 'Cubic Mtr', qty: '120.0', status: 'Verifying' }
    ];

    const checklists = [
        { id: 1, title: 'Concreting Pre-Pour', project: 'Saffron Greens', progress: 85, status: 'Reviewing' },
        { id: 2, title: 'Steel Binding Check', project: 'Metro Plaza', progress: 100, status: 'Verified' }
    ];

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Civil Engineering Operations</h2>
                    <p style={{ color: '#2c3e50', fontWeight: 600 }}>Technical management, BOQ oversight, and drawing reviews</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'white', color: 'var(--pivot-blue)', border: '1px solid var(--pivot-blue)',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer'
                    }}>
                        <FileArrowUp size={20} weight="bold" /> Submit Report
                    </button>
                    <button style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px',
                        background: 'var(--pivot-blue)', color: 'white', border: 'none',
                        borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(0, 71, 171, 0.2)'
                    }} onClick={() => setShowIssueInstructionModal(true)}>
                        <Plus size={20} weight="bold" /> Issue Instruction
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>

                {/* Column 1: Projects, Drawings, and BOQ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Assigned Projects & Tasks */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <ListChecks size={24} color="var(--pivot-blue)" weight="bold" /> Assigned Projects & Priorities
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {assignedProjects.map(p => (
                                <div key={p.id} style={{
                                    padding: '1.2rem', background: '#f8f9fa', borderRadius: '14px', border: '1px solid #eee',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>{p.name}</span>
                                            <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'var(--pivot-blue-soft)', borderRadius: '6px', fontWeight: 700 }}>{p.phase}</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1a1a1a', marginTop: '4px' }}>Task: {p.task}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#e53e3e', fontWeight: 700, marginTop: '2px' }}>Deadline: {p.deadline}</div>
                                    </div>
                                    <button style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--pivot-blue)', color: 'white', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Update Status</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Instruction & Change Requests Hub */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Gavel size={20} color="#F59E0B" /> Site Instructions
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: '#2c3e50', marginBottom: '1.2rem' }}>Direct official technical orders to site supervisors and vendors.</p>
                            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #F59E0B', color: '#F59E0B', background: 'transparent', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>New Instruction</button>
                        </div>
                        <div className="card" style={{ borderLeft: '4px solid #8B5CF6' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Swap size={20} color="#8B5CF6" /> Change Requests
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: '#2c3e50', marginBottom: '1.2rem' }}>Raise structural design or scope variations for approval.</p>
                            <button style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #8B5CF6', color: '#8B5CF6', background: 'transparent', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Raise Request</button>
                        </div>
                    </div>

                    {/* Drawings & Layouts Hub */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <Blueprint size={24} color="var(--pivot-blue)" weight="bold" /> Technical Drawings Library
                            </h3>
                            <div style={{ position: 'relative' }}>
                                <MagnifyingGlass size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                                <input type="text" placeholder="Search dwg/pdf..." style={{ padding: '8px 10px 8px 32px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.8rem' }} />
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                            {drawings.map(d => (
                                <div key={d.id} style={{ padding: '1rem', background: 'white', borderRadius: '12px', border: '1px solid #eee', position: 'relative' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#f0f4f8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                                        <Blueprint size={22} color="var(--pivot-blue)" />
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '4px' }}>{d.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#2c3e50', fontWeight: 600 }}>{d.project} • {d.date}</div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                        <button className="icon-btn-small"><DownloadSimple size={16} weight="bold" /></button>
                                        <button className="icon-btn-small" style={{ color: 'var(--pivot-blue)' }}><ArrowSquareOut size={16} weight="bold" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* BOQ & Technical Specifications */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <Notebook size={24} color="var(--pivot-blue)" weight="bold" /> BOQ & Material Specifications
                        </h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                                    <th style={{ padding: '12px 8px', fontSize: '0.8rem', color: '#2c3e50', textTransform: 'uppercase' }}>Material/Description</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.8rem', color: '#2c3e50', textTransform: 'uppercase' }}>Specification</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.8rem', color: '#2c3e50', textTransform: 'uppercase' }}>Qty</th>
                                    <th style={{ padding: '12px 8px', fontSize: '0.8rem', color: '#2c3e50', textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boqItems.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8f8f8' }}>
                                        <td style={{ padding: '15px 8px', fontSize: '0.85rem', fontWeight: 800, color: '#1a1a1a' }}>{item.item}</td>
                                        <td style={{ padding: '15px 8px', fontSize: '0.85rem', color: '#2c3e50', fontWeight: 600 }}>{item.spec}</td>
                                        <td style={{ padding: '15px 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.qty} <span style={{ fontSize: '0.65rem', color: '#7a7a7a' }}>{item.unit}</span></td>
                                        <td style={{ padding: '15px 8px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.65rem', background: item.status === 'Approved' ? '#e6f4ea' : '#fff4e5', color: item.status === 'Approved' ? '#1e7e34' : '#d97706', fontWeight: 800 }}>{item.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Column 2: Structural Notes and Analysis */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Quality Checklists Review */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                            <ClipboardText size={24} color="#10B981" weight="bold" /> Quality Checklists
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {checklists.map(c => (
                                <div key={c.id} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>{c.title}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: c.status === 'Verified' ? '#10B981' : '#F59E0B' }}>{c.status}</span>
                                    </div>
                                    <div style={{ height: '6px', background: '#E5E7EB', borderRadius: '3px', overflow: 'hidden', marginBottom: '5px' }}>
                                        <div style={{ width: `${c.progress}%`, height: '100%', background: '#10B981' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 600, color: '#7a7a7a' }}>
                                        <span>{c.project}</span>
                                        <span>{c.progress}% Complete</span>
                                    </div>
                                    <button style={{ width: '100%', marginTop: '12px', padding: '6px', borderRadius: '6px', background: 'white', border: '1px solid #ddd', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Review Points</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Structural & Technical Notes */}
                    <div className="card" style={{ height: 'fit-content' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: '#1a1a1a' }}>
                                <ChatCenteredText size={24} color="var(--pivot-blue)" weight="bold" /> Technical Feed & Notes
                            </h3>
                            <button className="icon-btn-small" style={{ borderRadius: '50%', background: 'var(--pivot-blue)', color: 'white' }}><Plus size={16} weight="bold" /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ padding: '0.8rem', background: '#fff5f5', borderRadius: '12px', borderLeft: '4px solid #f56565' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c53030', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Warning size={14} weight="fill" /> Structural Alert
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#2c3e50', fontWeight: 600 }}>10:15 AM</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 700 }}>Honeycombing observed in Pillar C-12, Sector 3. Immediate treatment required.</div>
                            </div>

                            <div style={{ padding: '0.8rem', background: '#f0f7ff', borderRadius: '12px', borderLeft: '4px solid var(--pivot-blue)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--pivot-blue)' }}>Design Change Note</div>
                                    <div style={{ fontSize: '0.65rem', color: '#2c3e50', fontWeight: 600 }}>Yesterday</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#1a1a1a', fontWeight: 700 }}>Beam B-4 offset updated to 150mm as per revised structural layout.</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2c3e50', marginBottom: '8px', display: 'block' }}>Add Technical Observation</label>
                            <textarea placeholder="Type observation..." style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '60px', fontSize: '0.85rem', outline: 'none' }}></textarea>
                            <button style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <PaperPlaneRight size={18} weight="bold" /> Submit Note
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
                .icon-btn-small {
                    padding: 8px;
                    background: #f8f9fa;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }
                .icon-btn-small:hover {
                    background: #f0f0f0;
                }
            `}</style>
            {showIssueInstructionModal && (
                <IssueInstructionModal onClose={() => setShowIssueInstructionModal(false)} />
            )}
        </div>
    );
};

export default CivilEngineerDashboard;
