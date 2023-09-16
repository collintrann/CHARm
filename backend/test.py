import snscrape.modules.twitter as sntwitter
import pandas as pd
import itertools
from datetime import datetime
import time

# Define the query
query = '"#vaccine"'

# Retry settings
max_retries = 3
retry_delay = 5  # seconds

# Retry loop
for retry in range(max_retries):
    try:
        data = pd.DataFrame(itertools.islice(
            sntwitter.TwitterSearchScraper(query).get_items(), 10))
        break  # Success, break out of the loop
    except Exception as e:
        print(f"Attempt {retry + 1} failed. Error: {str(e)}")
        if retry < max_retries - 1:
            print(f"Retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
        else:
            print("Max retries reached. Exiting.")
            break

# Extract the desired columns
df = data[['date', 'id', 'content', 'username']]

# Display the first 10 rows
df.head(10)
