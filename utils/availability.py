from datetime import date, timedelta

def get_earliest_availability(unavailable_dates):
    """
    Find the earliest date from today that is not in the unavailable_dates list.

    Args:
        unavailable_dates (list of str): Dates in 'YYYY-MM-DD' format.

    Returns:
        date: The earliest available date (as a date object).
    """
    today = date.today()
    unavailable = set(unavailable_dates)

    for offset in range(0, 30):  # Check up to 30 days ahead
        candidate = today + timedelta(days=offset)
        if candidate.isoformat() not in unavailable:
            return candidate

    return None  # No available date found within 30 days