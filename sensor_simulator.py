import time
import random
import uuid
from datetime import datetime
from db_connection import get_cassandra_session

# Configuration
NUM_SOLDIERS = 5
UPDATE_INTERVAL = 2  # seconds

def generate_vitals(soldier_id):
    """Generates realistic random vital signs."""
    return {
        "soldier_id": soldier_id,
        "timestamp": datetime.now(),
        "heart_rate": random.randint(60, 100),
        "systolic_bp": random.randint(110, 130),
        "diastolic_bp": random.randint(70, 85),
        "temperature": round(random.uniform(36.5, 37.5), 1),
        "spo2": random.randint(95, 100),
        "latitude": round(random.uniform(-33.0, 5.0), 6), # Approx Brazil range
        "longitude": round(random.uniform(-74.0, -35.0), 6)
    }

def simulate_sensors():
    print("Initializing sensor simulation...")
    try:
        session, keyspace = get_cassandra_session()
        session.set_keyspace(keyspace)
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return

    # Generate persistent IDs for this session
    soldier_ids = [uuid.uuid4() for _ in range(NUM_SOLDIERS)]
    print(f"Simulating {NUM_SOLDIERS} soldiers: {[str(uid) for uid in soldier_ids]}")

    insert_query = session.prepare("""
        INSERT INTO soldier_vitals (
            soldier_id, timestamp, heart_rate, systolic_bp, diastolic_bp, 
            temperature, spo2, latitude, longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """)

    try:
        while True:
            for uid in soldier_ids:
                data = generate_vitals(uid)
                session.execute(insert_query, (
                    data["soldier_id"],
                    data["timestamp"],
                    data["heart_rate"],
                    data["systolic_bp"],
                    data["diastolic_bp"],
                    data["temperature"],
                    data["spo2"],
                    data["latitude"],
                    data["longitude"]
                ))
                print(f"Updated vitals for {uid}: HR={data['heart_rate']}, Temp={data['temperature']}")
            
            time.sleep(UPDATE_INTERVAL)
    except KeyboardInterrupt:
        print("\nSimulation stopped.")

if __name__ == "__main__":
    simulate_sensors()
