/**
 * Minimal Upstash Redis REST client.
 * Upstash is provisioned through the Vercel Marketplace, which injects either
 * UPSTASH_REDIS_REST_URL/TOKEN or the legacy KV_REST_API_URL/TOKEN names; both
 * are accepted. Plain fetch keeps the dependency footprint at zero.
 */

export type RedisValue = string | number;
export type RedisCommand = RedisValue[];

export interface Redis {
  command<T = unknown>(command: RedisCommand): Promise<T>;
  pipeline(commands: RedisCommand[]): Promise<unknown[]>;
}

export class RedisError extends Error {
  override readonly name = "RedisError";
}

export function redisConfig(env: NodeJS.ProcessEnv = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN ?? env.KV_REST_API_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function createRedis(
  config: { url: string; token: string },
  fetchImpl: typeof fetch = fetch,
): Redis {
  async function post(path: string, body: unknown): Promise<unknown> {
    const response = await fetchImpl(`${config.url}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!response.ok) throw new RedisError(`Redis responded ${response.status}`);
    return response.json();
  }

  return {
    async command<T>(command: RedisCommand) {
      const result = (await post("", command)) as { result?: T; error?: string };
      if (result.error) throw new RedisError(result.error);
      return result.result as T;
    },
    async pipeline(commands: RedisCommand[]) {
      if (commands.length === 0) return [];
      const results = (await post("/pipeline", commands)) as Array<{ result?: unknown; error?: string }>;
      const failed = results.find((entry) => entry.error);
      if (failed) throw new RedisError(failed.error as string);
      return results.map((entry) => entry.result);
    },
  };
}

/** HGETALL over REST returns a flat [field, value, ...] list. */
export function hashToCounts(flat: unknown): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!Array.isArray(flat)) return counts;
  for (let i = 0; i + 1 < flat.length; i += 2) {
    const value = Number(flat[i + 1]);
    if (Number.isFinite(value)) counts[String(flat[i])] = value;
  }
  return counts;
}
