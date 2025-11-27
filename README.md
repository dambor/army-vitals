# Army Vital Signs Solution

This project simulates capturing soldiers' vital signs and storing them in an Astra DB (Cassandra) database.

## Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    Ensure your `.env` file is configured with:
    - `ASTRA_CLIENT_ID`
    - `ASTRA_CLIENT_SECRET`
    - `SECURE_CONNECT_BUNDLE` (path to zip file)
    - `ASTRA_DB_KEYSPACE`

3.  **Database Setup**:
    Run the setup script to create the schema:
    ```bash
    python3 setup_db.py
    ```

## Usage

Run the sensor simulator to generate and insert data:
```bash
python3 sensor_simulator.py
```
