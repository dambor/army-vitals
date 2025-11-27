from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db_connection import get_cassandra_session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SoldierVital(BaseModel):
    soldier_id: uuid.UUID
    timestamp: datetime
    heart_rate: int
    systolic_bp: int
    diastolic_bp: int
    temperature: float
    spo2: int
    latitude: float
    longitude: float

@app.get("/api/vitals/latest", response_model=List[SoldierVital])
def get_latest_vitals():
    try:
        session, keyspace = get_cassandra_session()
        session.set_keyspace(keyspace)
        
        # In a real production app with massive data, we would have a separate table 
        # for "latest status" or use a materialized view. 
        # For this simulation, we'll fetch recent records.
        # Note: ALLOW FILTERING is used here for simplicity in this specific schema context,
        # but should be avoided in large scale production queries without proper partition keys.
        
        # A better approach for this specific schema (partitioned by soldier_id) 
        # is to get all distinct soldier_ids first, then query latest for each.
        # However, since we don't have a "soldiers" table, we will grab a chunk of recent data.
        
        query = "SELECT * FROM soldier_vitals LIMIT 100" 
        rows = session.execute(query)
        
        # Group by soldier_id to find the latest for each
        latest_map = {}
        for row in rows:
            sid = row.soldier_id
            if sid not in latest_map or row.timestamp > latest_map[sid].timestamp:
                latest_map[sid] = row
                
        return list(latest_map.values())
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/vitals/history/{soldier_id}", response_model=List[SoldierVital])
def get_soldier_history(soldier_id: uuid.UUID, hours: int = 24):
    try:
        session, keyspace = get_cassandra_session()
        session.set_keyspace(keyspace)
        
        # Calculate the cutoff time
        # Note: In a real app, we should use proper timezone handling
        cutoff = datetime.now()
        # We can't easily subtract hours from datetime in standard python without timedelta
        from datetime import timedelta
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        # Cassandra query
        # Note: This requires ALLOW FILTERING if timestamp is not a clustering key in the partition
        # In our schema: PRIMARY KEY (soldier_id, timestamp)
        # So we can efficiently query by soldier_id and range of timestamp!
        
        query = "SELECT * FROM soldier_vitals WHERE soldier_id = %s AND timestamp > %s"
        rows = session.execute(query, (soldier_id, cutoff_time))
        
        return list(rows)
    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
