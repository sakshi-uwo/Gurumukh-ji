import React, { useState } from 'react';
import { X, CheckCircle, Warning, PaperPlaneRight, TextT, Tag, List, Calendar, MapPin, ClipboardText } from '@phosphor-icons/react';

const IssueInstructionModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Structural',
        priority: 'Medium',
        project: 'Saffron Greens',
        siteLocation: '',
        description: '',
        reason: '',
        reference: '',
        expectedOutcome: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        console.log("Issuing Instruction:", formData);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100, backdropFilter: 'blur(5px)' }}>
            <div style={{ width: '800px', maxHeight: '90vh', background: 'white', borderRadius: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }}>

                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--pivot-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Warning size={24} weight="fill" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Issue Site Instruction</h2>
                            <p style={{ margin: '2px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Formal technical directive to site team</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Section 1: Instruction Basic Details */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
                            Instruction Basic Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Instruction Title <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <TextT size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="e.g. Stop concreting at Block B due to rain"
                                        value={formData.title}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Instruction Type <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Tag size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Structural">Structural</option>
                                        <option value="Architectural">Architectural</option>
                                        <option value="MEP">MEP</option>
                                        <option value="Quality">Quality</option>
                                        <option value="Safety">Safety</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Priority Level <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Warning size={18} color={formData.priority === 'Critical' ? '#ef4444' : '#64748b'} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Related Project <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <List size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <select
                                        name="project"
                                        value={formData.project}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: 'white' }}
                                    >
                                        <option value="Saffron Greens">Saffron Greens</option>
                                        <option value="Metro Plaza">Metro Plaza</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Site / Block / Floor</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        name="siteLocation"
                                        placeholder="e.g. Block A, 4th Floor Slab"
                                        value={formData.siteLocation}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Issue Date</label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input
                                        type="text"
                                        value={new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        disabled
                                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none', background: '#f8fafc', color: '#64748b' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Instruction Description */}
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--pivot-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ background: 'var(--pivot-blue)', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
                            Instruction Content
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Detailed Instruction <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea
                                    name="description"
                                    placeholder="Provide clear, step-by-step technical instructions..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Reason for Instruction</label>
                                <input
                                    type="text"
                                    name="reason"
                                    placeholder="e.g. Safety non-compliance observed, Design revision"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Reference (Drawing / BOQ ID)</label>
                                    <div style={{ position: 'relative' }}>
                                        <ClipboardText size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                        <input
                                            type="text"
                                            name="reference"
                                            placeholder="e.g. DWG-102-R3"
                                            value={formData.reference}
                                            onChange={handleChange}
                                            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Expected Outcome</label>
                                    <input
                                        type="text"
                                        name="expectedOutcome"
                                        placeholder="e.g. Rectification within 24 hours"
                                        value={formData.expectedOutcome}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '10px 20px', borderRadius: '10px', background: 'white', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        style={{
                            padding: '10px 20px', borderRadius: '10px', background: 'var(--pivot-blue)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <PaperPlaneRight size={18} weight="bold" />
                        Issue Instruction
                    </button>
                </div>

            </div>
        </div>
    );
};

export default IssueInstructionModal;
