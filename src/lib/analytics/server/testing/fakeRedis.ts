import type { Redis, RedisCommand } from "../redis";

/** In-memory stand-in for the handful of Redis commands the analytics code uses. */
export class FakeRedis implements Redis {
  strings = new Map<string, string>();
  hashes = new Map<string, Map<string, number>>();
  ttl = new Map<string, number>();
  commands: RedisCommand[] = [];
  failNext = false;

  async command<T>(command: RedisCommand): Promise<T> {
    return this.run(command) as T;
  }

  async pipeline(commands: RedisCommand[]): Promise<unknown[]> {
    return commands.map((command) => this.run(command));
  }

  hash(key: string): Record<string, number> {
    return Object.fromEntries(this.hashes.get(key) ?? []);
  }

  private run(command: RedisCommand): unknown {
    if (this.failNext) {
      this.failNext = false;
      throw new Error("redis down");
    }
    this.commands.push(command);
    const [name, key, ...args] = command.map(String);
    switch (name) {
      case "GET":
        return this.strings.get(key) ?? null;
      case "SET": {
        if (args.includes("NX") && this.strings.has(key)) return null;
        this.strings.set(key, args[0]);
        const ex = args.indexOf("EX");
        if (ex !== -1) this.ttl.set(key, Number(args[ex + 1]));
        return "OK";
      }
      case "DEL":
        return Number(this.strings.delete(key));
      case "INCR": {
        const next = Number(this.strings.get(key) ?? 0) + 1;
        this.strings.set(key, String(next));
        return next;
      }
      case "HINCRBY": {
        const hash = this.hashes.get(key) ?? new Map<string, number>();
        hash.set(args[0], (hash.get(args[0]) ?? 0) + Number(args[1]));
        this.hashes.set(key, hash);
        return hash.get(args[0]);
      }
      case "HGETALL":
        return Array.from(this.hashes.get(key) ?? []).flatMap(([field, value]) => [field, String(value)]);
      case "EXPIRE":
        this.ttl.set(key, Number(args[0]));
        return 1;
      default:
        throw new Error(`unsupported command ${name}`);
    }
  }
}
