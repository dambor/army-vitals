import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const VitalCharts = ({ history }) => {
    if (!history || history.length === 0) return <div className="no-data">NO DATA AVAILABLE</div>;

    // Format data for charts
    const data = history.map(h => ({
        ...h,
        time: new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })).reverse(); // Recharts expects chronological order usually

    return (
        <div className="charts-container">
            <div className="chart-card">
                <h3>HEART RATE (24H)</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Line type="monotone" dataKey="heart_rate" stroke="#ff3333" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-card">
                <h3>BLOOD PRESSURE</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Legend />
                        <Line type="monotone" dataKey="systolic_bp" stroke="#00ff00" strokeWidth={2} dot={false} name="Systolic" />
                        <Line type="monotone" dataKey="diastolic_bp" stroke="#0088ff" strokeWidth={2} dot={false} name="Diastolic" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="chart-grid-row">
                <div className="chart-card half">
                    <h3>TEMPERATURE</h3>
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" />
                            <YAxis domain={[35, 42]} stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                            <Line type="monotone" dataKey="temperature" stroke="#ffaa00" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card half">
                    <h3>SpO2</h3>
                    <ResponsiveContainer width="100%" height={150}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="time" stroke="#666" />
                            <YAxis domain={[80, 100]} stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                            <Line type="monotone" dataKey="spo2" stroke="#00ffff" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default VitalCharts;
