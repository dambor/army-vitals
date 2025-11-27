# Army Vital Signs Solution

This project simulates capturing soldiers' vital signs, storing them in an Astra DB (Cassandra) database, and visualizing them on a real-time dashboard.

## Architecture

-   **Database**: Astra DB (Cassandra)
-   **Simulator**: Python script generating random vital signs.
-   **Backend**: FastAPI (Python) serving data to the frontend.
-   **Frontend**: React + Vite application with a tactical dark theme.

## Prerequisites

-   Python 3.12+
-   Node.js & npm

## Setup

### 1. Backend & Simulator

1.  **Install Python Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    Ensure your `.env` file is configured with:
    -   `ASTRA_CLIENT_ID`
    -   `ASTRA_CLIENT_SECRET`
    -   `SECURE_CONNECT_BUNDLE` (path to zip file)
    -   `ASTRA_DB_KEYSPACE`

3.  **Database Schema**:
    Run the setup script to create the table:
    ```bash
    python3 setup_db.py
    ```

### 2. Frontend

1.  **Install Node Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

## Running the Application

You will need three terminal instances running simultaneously.

### Terminal 1: Sensor Simulator
Generates and inserts fake soldier data into the database.
```bash
python3 sensor_simulator.py
```

### Terminal 2: Backend API
Starts the API server on port 8000.
```bash
uvicorn api:app --reload
```

### Terminal 3: Frontend Dashboard
Starts the React application on port 5173.
```bash
cd frontend
npm run dev
```

## Access

-   **Dashboard**: [http://localhost:5173](http://localhost:5173)
-   **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
