function shouldNormalizeSslMode(url: URL) {
  const sslMode = url.searchParams.get("sslmode");
  const usesLibpqCompat = url.searchParams.get("uselibpqcompat");

  return sslMode === "require" && usesLibpqCompat !== "true";
}

export function normalizeDatabaseUrl(connectionString: string) {
  try {
    const url = new URL(connectionString);

    if (shouldNormalizeSslMode(url)) {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }

    return connectionString;
  } catch {
    return connectionString;
  }
}
