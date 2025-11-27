import os
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from dotenv import load_dotenv

load_dotenv()

def get_cassandra_session():
    """
    Establishes a connection to the Cassandra database (Astra DB).
    Returns the session and keyspace.
    """
    client_id = os.getenv("ASTRA_CLIENT_ID")
    client_secret = os.getenv("ASTRA_CLIENT_SECRET")
    secure_bundle_path = os.getenv("SECURE_CONNECT_BUNDLE")
    keyspace = os.getenv("ASTRA_DB_KEYSPACE", "army_vitals")

    if not all([client_id, client_secret, secure_bundle_path]):
        raise ValueError("Missing Astra DB configuration. Please check your .env file.")

    cloud_config = {
        'secure_connect_bundle': secure_bundle_path
    }
    auth_provider = PlainTextAuthProvider(client_id, client_secret)
    
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
    session = cluster.connect()
    
    return session, keyspace
