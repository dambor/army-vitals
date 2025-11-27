from db_connection import get_cassandra_session

def create_schema():
    print("Connecting to database...")
    session, keyspace = get_cassandra_session()
    
    print(f"Creating keyspace '{keyspace}' if not exists (Note: Astra DB keyspaces are usually pre-created)...")
    # In Astra DB, keyspace is usually created via UI, but we can try to select it.
    session.set_keyspace(keyspace)
    
    print("Creating table 'soldier_vitals'...")
    create_table_query = """
    CREATE TABLE IF NOT EXISTS soldier_vitals (
        soldier_id uuid,
        timestamp timestamp,
        heart_rate int,
        systolic_bp int,
        diastolic_bp int,
        temperature float,
        spo2 int,
        latitude float,
        longitude float,
        PRIMARY KEY (soldier_id, timestamp)
    ) WITH CLUSTERING ORDER BY (timestamp DESC);
    """
    session.execute(create_table_query)
    print("Table 'soldier_vitals' created successfully.")

if __name__ == "__main__":
    create_schema()
