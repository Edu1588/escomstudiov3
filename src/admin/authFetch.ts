import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../lib/firebase";

/* O painel chama a API com fetch("/api/...") em dezenas de lugares. Em vez de mexer em cada chamada, este arquivo
   faz TODA chamada para /api/ do mesmo site levar o ID token do Firebase do administrador logado
   ("Authorization: Bearer <token>"). A API confere esse token (api/index.ts, "SEGURANÇA DA API").
   - Espera o Firebase restaurar a sessão salva antes da primeira chamada (senão a 1ª requisição iria sem token).
   - Sem usuário logado, a chamada segue sem token (e a API recusa as rotas protegidas).
   - Chamadas para outros domínios não são tocadas. */
const auth = getAuth(app);
const authReady = new Promise<void>(resolve => {
  const off = onAuthStateChanged(auth, () => { off(); resolve(); });
});
const nativeFetch = window.fetch.bind(window);

function isSameOriginApi(input: RequestInfo | URL): boolean {
  try {
    const raw = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const u = new URL(raw, window.location.origin);
    return u.origin === window.location.origin && u.pathname.startsWith("/api/");
  } catch {
    return false;
  }
}

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  if (!isSameOriginApi(input)) return nativeFetch(input, init);
  await authReady;
  const user = auth.currentUser;
  if (!user) return nativeFetch(input, init);
  const token = await user.getIdToken();            // o SDK renova o token sozinho quando perto de expirar
  const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
  if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  return input instanceof Request
    ? nativeFetch(new Request(input, { ...init, headers }))
    : nativeFetch(input, { ...init, headers });
};
