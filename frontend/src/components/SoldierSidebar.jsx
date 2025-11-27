import React from 'react';
import { User, Activity } from 'lucide-react';

const SoldierSidebar = ({ soldiers, selectedId, onSelect }) => {
    return (
        <div className="sidebar">
            <h3 className="sidebar-title">ACTIVE UNITS</h3>
            <div className="soldier-list">
                {soldiers.map((soldier) => (
                    <div
                        key={soldier.soldier_id}
                        className={`soldier-item ${selectedId === soldier.soldier_id ? 'active' : ''}`}
                        onClick={() => onSelect(soldier.soldier_id)}
                    >
                        <User size={16} />
                        <span className="soldier-id-text">{soldier.soldier_id.split('-')[0]}...</span>
                        <div className={`status-dot ${soldier.heart_rate > 100 || soldier.spo2 < 90 ? 'critical' : 'normal'}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SoldierSidebar;
