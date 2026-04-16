// ============================================================
// api/_lib/ratelimit.js — Rate-limit usando Upstash Redis
// ============================================================
// Implementa "fixed window" simples:
//   - Conta tentativas por chave (ex: IP) numa janela de tempo
//   - Se excede o limite, bloqueia até a janela expirar
// ============================================================
import { Redis } from '@upstash/redis';

let redisClient = null;

function getRedis() {
  if (redisClient) return redisClient;
  const url   = (process.env.KV_REST_API_URL   || '').trim();
  const token = (process.env.KV_REST_API_TOKEN || '').trim();
  if (!url || !token) {
    console.warn('[ratelimit] KV_REST_API_URL ou KV_REST_API_TOKEN nao configurados');
    return null;
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

// ── Extrai IP do request (atrás do proxy do Vercel) ──────────
export function getClientIP(req) {
  // x-forwarded-for: "ip1, ip2, ip3" — o primeiro é o real
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    const ip = xff.split(',')[0].trim();
    if (ip) return ip;
  }
  // x-real-ip: alternativa
  const xri = req.headers['x-real-ip'];
  if (typeof xri === 'string' && xri.trim()) return xri.trim();
  // Fallback: socket
  return req.socket?.remoteAddress || 'desconhecido';
}

// ── Verifica e incrementa contador de tentativas ─────────────
//
// chave        - identificador único (ex: 'auth:ip:1.2.3.4')
// limite       - máximo de tentativas permitido na janela
// janelaSegundos - tamanho da janela em segundos (ex: 900 = 15min)
//
// Retorna { permitido: bool, restante: int, retryApos: int (segundos) }
//
// Se o Redis estiver indisponível, retorna permitido=true (fail-open)
// para não bloquear o login em caso de falha do Redis.
export async function checarRateLimit(chave, limite = 5, janelaSegundos = 900) {
  const redis = getRedis();
  if (!redis) {
    return { permitido: true, restante: limite, retryApos: 0, erro: 'redis-indisponivel' };
  }

  try {
    // INCR atômico: incrementa o contador
    const novoValor = await redis.incr(chave);

    // Se é a primeira tentativa, define o TTL da janela
    if (novoValor === 1) {
      await redis.expire(chave, janelaSegundos);
    }

    if (novoValor > limite) {
      // Excedeu o limite — pega o TTL atual para informar quanto falta
      const ttl = await redis.ttl(chave);
      return {
        permitido: false,
        restante: 0,
        retryApos: ttl > 0 ? ttl : janelaSegundos,
      };
    }

    return {
      permitido: true,
      restante: limite - novoValor,
      retryApos: 0,
    };
  } catch (e) {
    // Em caso de erro do Redis, fail-open (não bloqueia o login)
    console.error('[ratelimit] erro:', e.message);
    return { permitido: true, restante: limite, retryApos: 0, erro: e.message };
  }
}

// ── Reseta o contador (útil após login bem-sucedido) ────────
export async function resetRateLimit(chave) {
  const redis = getRedis();
  if (!redis) return false;
  try {
    await redis.del(chave);
    return true;
  } catch (e) {
    console.error('[ratelimit] erro ao resetar:', e.message);
    return false;
  }
}
