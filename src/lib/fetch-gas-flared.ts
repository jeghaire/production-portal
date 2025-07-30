export async function fetchGasFlared(date: string) {
  const url = `https://217.14.88.108/prod/home/dailyGasFlared?publickey=123456789&datecreated=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch gas flared data");
  return await res.json();
}
